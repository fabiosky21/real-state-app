import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Booking {
  fullName: string;
  propertyName: string;
  date: string;
  time: string;
  userId: string;
  agent: { name: string; phone: number; avatar: string };
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingCollection = collection(this.firestore, 'bookings'); // Firestore Collection

  constructor(private firestore: Firestore) {}

  // Add a new booking
  addBooking(booking: Booking): Promise<void> {
    return addDoc(this.bookingCollection, booking) as unknown as Promise<void>;
  }

  // Fetch bookings (for admin or user history)
  getBookings(): Observable<Booking[]> {
    return collectionData(this.bookingCollection, { idField: 'id' }) as Observable<Booking[]>;
  }
}
