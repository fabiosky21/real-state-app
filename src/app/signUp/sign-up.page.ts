import { Component } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  fetchSignInMethodsForEmail
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})

export class SignUpPage {
  username: string = '';
  email: string = '';
  password: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'password' ? 'eye-off-outline' : 'eye-outline';
  }

  async signUpWithEmail() {
    if (!this.username || !this.email || !this.password) {
      this.showAlert('All fields are required.');
      return;
    }

    try {
      // Check if the email is already registered
      const methods = await fetchSignInMethodsForEmail(this.auth, this.email);
      if (methods.length > 0) {
        this.showAlert('User already exists. Please sign in.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: this.username });

      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        id: user.uid,
        username: this.username,
        email: user.email,
        likedProperties: [],
        avatarUrl: '',
      });

      await sendEmailVerification(user, { url: 'http://localhost:8100/sign-in', handleCodeInApp: true });

      // show verification alert for 3 seconds before redirecting
      this.showAlert('Verify your account. Please check your email.', true);
      setTimeout(() => {
        this.router.navigate(['/sign-in']);
      }, 6000);

    } catch (error) {
      console.error(' Error during sign-up:', error);
      this.showAlert('the user or email has been already used.');
    }
  }

  async showAlert(message: string, autoClose: boolean = false) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message: message,
      buttons: ['OK'],
      cssClass: 'custom-alert',
    });

    await alert.present();

    if (autoClose) {
      setTimeout(() => alert.dismiss(), 3000);
    }
  }
  goBack() {
    this.router.navigate(['/sign-in']);
  }
}
