import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { AlertController } from '@ionic/angular';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, addDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class BookingPage implements OnInit {
  bookingForm!: FormGroup;
  propertyName: string = '';
  agents: string[] = [];
  allTimeSlots: string[] = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];
  availableTimes: string[] = []; // Will be populated when date is selected
  selectedDate: string | null = null;
  minDate: string = new Date().toISOString().split('T')[0]; // Today
  maxDate: string = new Date(new Date().setMonth(new Date().getMonth() + 2))
    .toISOString()
    .split('T')[0]; // 2 months ahead

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private alertController: AlertController,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    //  Initialize Form
    this.bookingForm = this.fb.group({
      fullName: ['', Validators.required],
      propertyName: [
        { value: this.propertyName, disabled: true },
        Validators.required,
      ], // Make it readonly
      agent: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });

    this.route.queryParamMap.subscribe((params) => {
      console.log('Query Params:', params.keys); // Debugging query params

      this.propertyName = params.get('propertyName') || '';
      const agentName = params.get('agentName');

      //  Ensure propertyName is received
      console.log(' Property Name:', this.propertyName);
      console.log(' Agent Name:', agentName);

      //  Populate agents dynamically
      if (agentName) {
        this.agents = [agentName];
      }

      //  Update the form after setting the values
      this.bookingForm.patchValue({
        propertyName: this.propertyName,
        agent: this.agents.length > 0 ? this.agents[0] : '',
      });
    });
  }

  preventTyping(event: Event) {
    event.preventDefault();
  }

  onDateChange(event: any) {
    if (event.value) {
      this.selectedDate = event.value;
      this.availableTimes = [...this.allTimeSlots]; // Populate available times
      console.log(' Selected Date:', this.selectedDate);
    }
  }

  async onSubmit() {
    const authInstance = getAuth(); // Get Firebase Auth instance
    const currentUser = authInstance.currentUser;

    if (!currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    if (this.bookingForm.valid) {
      try {
        const userId = currentUser.uid; //  Fix undefined auth issue
        const fullName = this.bookingForm.value.fullName;
        const date = this.bookingForm.value.date;
        const time = this.bookingForm.value.time;
        const agentName = this.bookingForm.value.agent;
        const propertyName = this.propertyName;

        // Fetch Property Details from Firestore
        const propertyQuery = query(collection(this.firestore, "properties"), where("name", "==", propertyName));
        const querySnapshot = await getDocs(propertyQuery);

        if (querySnapshot.empty) {
          console.error("❌ Property not found:", propertyName);
          return;
        }

        const propertyData = querySnapshot.docs[0].data();
        const agentImageUrl = propertyData['agent'].avatar || '';
        const agentPhone = propertyData['agent'].phone || '';
        const imagesUrl = propertyData['imageUrls'] || [];
        const firstImageUrl = imagesUrl.length > 0 ? imagesUrl[0] : '';

        //  Prepare booking data
        const bookingData = {
          userId,
          fullName,
          propertyName,
          agentName,
          agentImageUrl,
          agentPhone,
          imagesUrl: firstImageUrl,
          date,
          time
        };

        // Save booking to Firestore
        await addDoc(collection(this.firestore, "bookings"), bookingData);
        console.log(" Booking saved successfully!", bookingData);

        //  Show confirmation alert
        const alert = await this.alertController.create({
          header: "Booking Confirmed",
          message: "Your booking has been sent! Our agents will contact you shortly.",
          cssClass: "custom-alert",
          buttons: [{ text: "OK", handler: () => this.clearForm() }],
        });

        await alert.present();
      } catch (error) {
        console.error("❌ Error saving booking:", error);
      }
    } else {
      console.log(" Booking Form is invalid");
    }
  }

  clearForm() {
    this.bookingForm.reset();
    this.selectedDate = null;
    this.availableTimes = [];
  }
}
