import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { HomePage } from './home/home.page';
import { ExplorePage } from './explore/explore.page';
import { ProfilePage } from './profile/profile.page';
import { SignInPage } from './signIn/sign-in.page';
import { SignUpPage } from './signUp/sign-up.page';
import { PropertyDetailPage } from './propertyDetail/property-detail.page';
import { BookingPage } from './booking/booking.page';
import { MyBookingsPage } from './myBookings/mybookings.page';
import { FaqPage } from './Faq/faq.page';
import { InvitePage } from './invite/invite.page';
import { SellPropertyPage } from './sellaproperty/sellproperty.page';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInPage,
  },
  {
    path: 'sign-up',
    component: SignUpPage,
  },
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'home', component: HomePage },
      { path: 'explore', component: ExplorePage },
      { path: 'property-detail/:id', component: PropertyDetailPage },
      { path: 'profile', component: ProfilePage },
      { path: 'booking', component: BookingPage },
      { path: 'myBookings', component: MyBookingsPage },
      { path: 'Faq', component: FaqPage },
      { path: 'imagec', component: InvitePage },
      {
        path: 'sellaproperty',
        loadComponent: () => import('./sellaproperty/sellproperty.page').then(m => m.SellPropertyPage), canActivate: [AuthGuard]
      },


      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ],
  },
];
