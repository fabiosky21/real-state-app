import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonItem, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../services/property.service';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonInput, IonItem, IonIcon],
})
export class ExplorePage implements OnInit {
  userId: string = ''; // Current user ID
  searchTerm: string = '';
  selectedFilter: string = 'All';
  filters: string[] = ['All', 'Houses', 'Studio', 'Condos', 'Apartments'];

  properties: Property[] = []; // All properties from Firestore
  filteredProperties: Property[] = [];


  constructor(private router: Router, private propertyService: PropertyService, private auth: Auth) {}

  ngOnInit() {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, (user) => {
      if (user) {
        this.userId = user.uid;

      }
      this.loadProperties();
    });
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe((data) => {
      this.properties = data;
      this.filteredProperties = data; // Initially show all properties
    });
  }

  filterProperties() {
    this.filteredProperties = this.properties.filter((property) =>
      (this.selectedFilter === 'All' || property.type === this.selectedFilter) &&
      (property.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       property.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       property.price.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  applyFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterProperties();
  }

  viewPropertyDetail(id?: string) {
    if (!id) return;
    this.router.navigate(['/property-detail', id]);
  }

  toggleLike(property: Property, event: Event) {
    event.stopPropagation(); // Prevent triggering navigation

    if (!this.userId) return; // Ensure user is authenticated

    const userLiked = property.userLiked ? { ...property.userLiked } : {}; // Clone userLiked to avoid modifying directly

    const wasLikedBefore = userLiked[this.userId] || false; // Store previous state
    userLiked[this.userId] = !wasLikedBefore; // Toggle like state


    let newLikes = property.likes || 0; // Preserve likes count
  newLikes = wasLikedBefore ? newLikes - 1 : newLikes + 1;


    this.propertyService.updateProperty(property.id, { likes: newLikes, userLiked })
      .catch(error => console.error(" Error updating property likes:", error));
  }


}
