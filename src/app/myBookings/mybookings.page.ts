import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.page.html',
  styleUrls: ['./mybookings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MyBookingsPage implements OnInit {
  userId: string = '';
  bookings: any[] = [];
  loading: boolean = true;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router, private ngZone: NgZone ) {}

  ngOnInit() {
    const authInstance = getAuth();

    onAuthStateChanged(authInstance, (user) => {
      if (user) {
        this.userId = user.uid;
        console.log(" User authenticated:", this.userId);
        this.loadBookings();
      } else {
        console.error("No authenticated user found.");
        this.loading = false;
      }
    });
  }

  async loadBookings() {
    if (!this.userId) return;

    try {
      const bookingsRef = collection(this.firestore, 'bookings');
      const q = query(bookingsRef, where("userId", "==", this.userId));
      const querySnapshot = await getDocs(q);

      this.bookings = querySnapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          date: data['date'].toDate().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) // Convert Firestore Timestamp to readable format
        };
      });

      console.log(" Bookings fetched:", this.bookings);
    } catch (error) {
      console.error(" Error fetching bookings:", error);
    } finally {
      this.loading = false;
    }
  }


  goBack() {
    this.router.navigate(['/profile']);
  }
}
