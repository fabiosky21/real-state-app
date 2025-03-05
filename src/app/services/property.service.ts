import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDoc,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  type: string;
  imageUrls: string[];
  featured: boolean;
  facilities: string[];
  overview: string;
  agent: { name: string; phone: number; avatar: string };
  phone: number;
  details: { beds: number; baths: number; area: number };
  latitude: number;
  longitude: number;
  likes: number;
  rating: number;
  userLiked: {[userId: string]: boolean};
}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private propertyCollection = collection(this.firestore, 'properties');

  constructor(private firestore: Firestore) {}

  //  Get all properties from Firestore
  getProperties(): Observable<Property[]> {
    const propertiesCollection = collection(this.firestore, 'properties');
    return collectionData(propertiesCollection, { idField: 'id' }).pipe(
      map((properties) =>
        properties.map((property) => ({
          ...property,
          id: property.id || '',
          userLiked: property['userLiked'] || {},
        }))
      )
    ) as Observable<Property[]>;
  }
  //  Get a single property by ID (For Property Detail Page)
  async getPropertyById(id: string): Promise<Property | null> {
    const propertyDoc = doc(this.firestore, `properties/${id}`);
    const docSnap = await getDoc(propertyDoc);
    return docSnap.exists() ? (docSnap.data() as Property) : null;
  }

  // Update a property
  updateProperty(propertyId: string, data: Partial<Property>) {
    if (!propertyId) {
      console.error(" Error: Property ID is missing.");
      return Promise.reject("Property ID is missing.");
    }

    const propertyDoc = doc(this.firestore, `properties/${propertyId}`);

    return updateDoc(propertyDoc, data)
      .then(() => console.log(` Property ${propertyId} updated successfully.`))
      .catch((error) => console.error(" Firestore update error:", error));
  }
}
