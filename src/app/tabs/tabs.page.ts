import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  IonLabel,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
  ],
})
export class TabsPage {
  selectedTab: string = 'home'; // Set default selected tab

  setActiveTab(tab: string) {
    this.selectedTab = tab; // Update the active tab
  }
}
