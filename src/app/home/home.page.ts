import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyService, Property } from '../services/property.service';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular'; // ← Add this import at the top

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule, IonButton],
})
export class HomePage implements OnInit {
  userAvatar: string = '';
  userName: string = 'User';
  userId: string = '';
  searchTerm: string = '';
  selectedFilter: string = 'All';
  filters: string[] = [
    'Most Liked',
    'Less Liked',
    'More Rated',
    'More Expensive',
  ];

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  featuredProperties: Property[] = [];

  constructor(
    private auth: Auth,
    private propertyService: PropertyService,
    private router: Router,
    private firestore: Firestore,
    private alertController: AlertController
  ) {}

  isGuest: boolean = true;

  ngOnInit() {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        this.userId = user.uid;
        this.userName = user.displayName || 'User';
        this.isGuest = false;

        const userDoc = doc(this.firestore, `users/${this.userId}`);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.userName = userData['username'] || 'User';
          this.userAvatar =
            userData['avatarUrl'] ||
            user.photoURL ||
            this.generateInitialAvatar(this.userName);
        } else {
          this.userName = user.displayName || 'User';
          this.userAvatar = user.photoURL || this.generateInitialAvatar(this.userName);
        }
      } else {
        this.isGuest = true;
        this.userName = 'Guest';
        this.userAvatar = this.generateInitialAvatar('G');
      }
      this.loadProperties();
    });
  }
  loadProperties() {
    this.propertyService.getProperties().subscribe((data) => {
      this.properties = data;
      this.filteredProperties = data;
      this.featuredProperties = data.filter(
        (property) => property.featured === true
      );
    });
  }
  //avatar part

  generateInitialAvatar(name: string): string {
    const initial = name.charAt(0).toUpperCase();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 40;
    canvas.height = 40;

    if (context) {
      context.fillStyle = '#62aeff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#ffffff';
      context.font = '20px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(initial, canvas.width / 2, canvas.height / 2);
    }

    return canvas.toDataURL();
  }
  //fillter part proprtis
  applyFilter(filter: string) {
    this.selectedFilter = filter;

    switch (filter) {
      case 'Most Liked':
        this.filteredProperties = this.properties.filter(
          (property) => property.likes > 99
        );
        break;
      case 'Less Liked':
        this.filteredProperties = this.properties.filter(
          (property) => property.likes <= 99
        );
        break;
      case 'More Rated':
        this.filteredProperties = this.properties.filter(
          (property) => property.rating > 4.0
        );
        break;
      case 'More Expensive':
        this.filteredProperties = this.properties.filter((property) => {
          if (!property.price) return false;

          const priceString = property.price
            .replace(/[€,\s]/g, '')
            .replace(/[.](?=\d{3})/g, '');
          const price = parseInt(priceString, 10);
          return price > 900000;
        });
        break;
    }
  }

  async toggleLike(property: Property, event: Event) {
    event.stopPropagation();

    if (!this.userId) {
      const alert = await this.alertController.create({
        header: 'Login Required',
        message: 'Please log in to like properties.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Login',
            handler: () => {
              this.router.navigate(['/sign-in']);
            },
          },
        ],
      });
      await alert.present();
      return;
    }

    const userLiked = property.userLiked ? { ...property.userLiked } : {};
    const wasLikedBefore = userLiked[this.userId] || false;
    userLiked[this.userId] = !wasLikedBefore;

    let newLikes = property.likes || 0;
    newLikes += wasLikedBefore ? -1 : 1;

    this.propertyService
      .updateProperty(property.id, { likes: newLikes, userLiked })
      .catch((error) =>
        console.error(' Error updating property likes:', error)
      );
  }

  viewPropertyDetail(propertyId: string) {
    this.router.navigate(['/property-detail', propertyId]);
  }
  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }

}
