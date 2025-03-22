import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Auth, signOut, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  showAvatarBox: boolean = false;

  availableAvatars: string[] = [
    'assets/images/avatar1.png',
    'assets/images/avatar2.png',
    'assets/images/female1.jpg',
    'assets/images/female2.jpg',
    'assets/images/avatar5.jpg',
    'assets/images/avatar6.jpg',
  ];
  toggleAvatarBox() {
    setTimeout(() => {
    this.showAvatarBox = !this.showAvatarBox;
    },0);
  }
  showNameBox: boolean = false;
  showConfirmBox: boolean = false;
  newUsername: string = '';

  openNameBox() {
    setTimeout(() => {
    this.showNameBox = true;
    this.showConfirmBox = false;
    },0);
  }

  cancelChangeName() {
    this.newUsername = '';
    this.showNameBox = false;
    this.showConfirmBox = false;
  }
  goToConfirm() {
    if (!this.newUsername.trim()) return;
    this.showConfirmBox = true;
  }

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private eRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // outside click
    if (
      this.showNameBox &&
      !this.eRef.nativeElement
        .querySelector('.name-change-box')
        ?.contains(target)
    ) {
      this.cancelChangeName(); 
    }
    //avatar box
    if (
      this.showAvatarBox &&
      !this.eRef.nativeElement
        .querySelector('.avatar-box')
        ?.contains(target)
    ) {
      this.showAvatarBox = false;
    }
  }

  ngOnInit() {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, (user) => {
      if (user) {
        this.userId = user.uid;
        this.username = user.displayName || 'User';
        this.avatarUrl = user.photoURL || 'default-avatar-url.jpg';
        this.loadUserProfile();
      } else {
        console.error(' No user found in Firebase Auth.');
      }
    });
  }

  async loadUserProfile() {
    if (!this.userId) return;

    const userDoc = doc(this.firestore, `users/${this.userId}`);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      this.username = userData['username'] || 'User';
      this.avatarUrl =
        userData['avatarUrl'] ||
        this.auth.currentUser?.photoURL ||
        'default-avatar-url.jpg';
    }
  }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
  //selction from asssets component
  selectAvatar(avatar: string) {
    this.avatarUrl = avatar;
    const userDoc = doc(this.firestore, `users/${this.userId}`);
    updateDoc(userDoc, { avatarUrl: avatar })
      .then(() => console.log('Avatar updated'))
      .catch((error) => console.error('Error updating avatar:', error));
  }
  //update avatar
  async updateAvatar(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const AvatarUrl = URL.createObjectURL(file);
    this.avatarUrl = AvatarUrl;

    const userDoc = doc(this.firestore, `users/${this.userId}`);
    await updateDoc(userDoc, { avatarUrl: AvatarUrl });
  }
  //change name
  async confirmChangeName() {
    if (!this.newUsername.trim()) return;

    const userDoc = doc(this.firestore, `users/${this.userId}`);
    try {
      await updateDoc(userDoc, { username: this.newUsername });

      // Update current view
      this.username = this.newUsername;
      this.newUsername = '';
      this.showNameBox = false;
      this.showConfirmBox = false;

      // Optional: Add a custom success message or toast
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Something went wrong.');
    }
  }

  cancelConfirmation() {
    this.showConfirmBox = false;
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/sign-in']);
  }
}
