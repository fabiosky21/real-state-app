import { Component } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class SignInPage {
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
    this.passwordIcon =
      this.passwordType === 'password' ? 'eye-off-outline' : 'eye-outline';
  }

  async signInWithEmail() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        await this.ensureUserInFirestore(
          user.uid,
          user.email,
          user.displayName || 'New User'
        );
        console.log(' Email verified. Redirecting to home...');
        this.router.navigate(['/home']);
      } else {
        alert(' Please verify your email before signing in.');
        await this.auth.signOut();
      }
    } catch (error) {
      console.error(' Error signing in:', error);
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      if (!user) return;

      await this.ensureUserInFirestore(
        user.uid,
        user.email,
        user.displayName || 'New User'
      );

      console.log(' Google sign-in successful! Redirecting...');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error(' Error signing in with Google:', error);
    }
  }

  async checkUserExists(userId: string): Promise<boolean> {
    const userRef = doc(this.firestore, `users/${userId}`);
    const docSnap = await getDoc(userRef);
    return docSnap.exists();
  }

  async ensureUserInFirestore(
    userId: string,
    email: string | null,
    username: string
  ) {
    if (!email) return;

    const userRef = doc(this.firestore, `users/${userId}`);
    const docSnap = await getDoc(userRef);
    const authUser = this.auth.currentUser;

    const avatarUrl = authUser?.photoURL || '';

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        id: userId,
        email: email,
        username: username,
        avatarUrl: avatarUrl, //  Only stores username (No avatar)
        likedProperties: [],
      });
      console.log(' New user added to Firestore');
    }
  }

  // Button touch events for UI effects
  onTouchStart(event: Event) {
    const target = event.currentTarget as HTMLElement;
    target.classList.add('button-active');
  }

  onTouchEnd(event: Event) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('button-active');
  }
}
