import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage implements OnInit {
  userId: string = '';
  username: string = '';
  avatarUrl: string = '';


  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.userId = user.uid;
      console.log(" User ID:", this.userId);  // 🔹 Debug log
      this.loadUserProfile();
    } else {
      console.error(" No user found in Firebase Auth.");
    }
  }


  async loadUserProfile() {
    if (!this.userId) return;

    const userDoc = doc(this.firestore, `users/${this.userId}`);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      this.username = userData['username'] || 'User';
      this.avatarUrl = userData['avatarUrl'] || this.auth.currentUser?.photoURL || 'default-avatar-url.jpg';

    }
  }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  async updateAvatar(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const AvatarUrl = URL.createObjectURL(file);
    this.avatarUrl = AvatarUrl;

    const userDoc = doc(this.firestore, `users/${this.userId}`);
    await updateDoc(userDoc, { avatarUrl: AvatarUrl });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/sign-in']);
  }
}
