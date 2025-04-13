// sell-property.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sellproperty',
  templateUrl: './sellproperty.page.html',
  styleUrls: ['./sellproperty.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class SellPropertyPage implements OnInit {
  propertyForm!: FormGroup;
  currentUser: any = null;

  facilities: string[] = [
    'wifi',
    'restaurant',
    'laundry',
    'petfriendly',
    'gym',
    'parking',
    'swimmingPool',
  ];
  propertyTypes: string[] = ['Houses', 'Studio', 'Condos', 'Apartments'];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private alertController: AlertController,
    private router: Router
  ) {}



  ngOnInit() {
    const auth = getAuth();

    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      price: ['', Validators.required],
      type: ['', Validators.required],
      overview: ['', Validators.required],
      imageUrls: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      rating: ['', Validators.required],
      likes: ['', Validators.required],
      facilities: [[], Validators.required],
      beds: ['', Validators.required],
      baths: ['', Validators.required],
      area: ['', Validators.required],
      agentName: ['', Validators.required],
      agentPhone: ['', Validators.required],
      agentAvatar: ['', Validators.required],
      featured: [false],
    });
  }

  async onSubmit() {
    if (this.propertyForm.invalid) return;

    const formData = this.propertyForm.value;

    const propertyData = {
      name: formData.name,
      location: formData.location,
      price: formData.price,
      type: formData.type,
      overview: formData.overview,
      imageUrls: formData.imageUrls.split(',').map((url: string) => url.trim()),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      rating: Number(formData.rating),
      likes: Number(formData.likes),
      userLiked: {},
      featured: false,
      facilities: formData.facilities,
      details: {
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        area: Number(formData.area),
      },
      agent: {
        name: formData.agentName,
        phone: formData.agentPhone,
        avatar: formData.agentAvatar,
      },
    };

    await addDoc(collection(this.firestore, 'properties'), propertyData);

    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Property added successfully!',
      buttons: [{ text: 'OK', handler: () => this.propertyForm.reset() }],
    });
    await alert.present();


  }
  goBack() {
    this.router.navigate(['/profile']);
  }
}
