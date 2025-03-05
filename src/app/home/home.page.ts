import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyService, Property } from '../services/property.service';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule],
})
export class HomePage implements OnInit {
  userAvatar: string = '';
  userName: string = 'User';
  userId: string = '';
  searchTerm: string = '';
  selectedFilter: string = 'All';
  filters: string[] = [ 'Most Liked', 'Less Liked', 'More Rated', 'More Expensive'];

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  featuredProperties: Property[] = [];

  constructor(private auth: Auth, private propertyService: PropertyService, private router: Router) {}

  ngOnInit() {
    // Get User Auth
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, (user) => {
      if (user) {
        this.userId = user.uid;
        this.userName = user.displayName || 'User';
        this.userAvatar = user.photoURL || this.generateInitialAvatar(this.userName);
        this.loadProperties();
      }
    });
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe((data) => {
      this.properties = data;
      this.filteredProperties = data;
      this.featuredProperties = data.filter(property => property.featured === true);
    });
  }

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

  applyFilter(filter: string) {
    this.selectedFilter = filter;

    switch (filter) {
      case 'Most Liked':
        this.filteredProperties = this.properties.filter(property => property.likes > 99);
        break;
      case 'Less Liked':
        this.filteredProperties = this.properties.filter(property => property.likes <= 99);
        break;
      case 'More Rated':
        this.filteredProperties = this.properties.filter(property => property.rating > 4.0);
        break;
      case 'More Expensive':
        this.filteredProperties = this.properties.filter(property => parseFloat(property.price.replace(/[^0-9.]/g, '')) > 900.000);
        break;
      default:
        this.filteredProperties = this.properties;
    }
  }

  toggleLike(property: Property, event: Event) {
    event.stopPropagation();

    if (!this.userId) return;

    const userLiked = property.userLiked ? { ...property.userLiked } : {};
    const wasLikedBefore = userLiked[this.userId] || false;
    userLiked[this.userId] = !wasLikedBefore;

    let newLikes = property.likes || 0;
    newLikes += wasLikedBefore ? -1 : 1;

    this.propertyService.updateProperty(property.id, { likes: newLikes, userLiked })
      .catch(error => console.error("❌ Error updating property likes:", error));
  }

  viewPropertyDetail(propertyId: string) {
    this.router.navigate(['/property-detail', propertyId]);
  }
}
