import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  compassOutline,
  personOutline,
  eyeOffOutline,
  eyeOutline,
  logoGoogle,
  arrowBackCircleOutline,
  bedOutline,
  expandOutline,
  callOutline,
  chatbubbleEllipsesOutline,
  searchOutline,
  cameraOutline,
  calendarOutline,
  helpCircleOutline,
  giftOutline,
  arrowForwardOutline,
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Import Firebase modules
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { firebaseConfig } from './environments/firebase-config';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Register Ionic icons
addIcons({
  'home-outline': homeOutline,
  'compass-outline': compassOutline,
  'person-outline': personOutline,
  'eye-off-outline': eyeOffOutline,
  'eye-outline': eyeOutline,
  'logo-google': logoGoogle,
  'arrow-back-circle-outline': arrowBackCircleOutline,
  'bed-outline': bedOutline,
  'expand-outline': expandOutline,
  'call-outline': callOutline,
  'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,
  'search-outline': searchOutline,
  'camera-outline': cameraOutline,
  'calendar-outline': calendarOutline,
  'help-circle-outline': helpCircleOutline,
  'gift-outline': giftOutline,
  'arrow-forward-outline': arrowForwardOutline,
});

// Initialize Ionic PWA elements
defineCustomElements(window);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Initialize Firebase
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});
