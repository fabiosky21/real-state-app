import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashComponent } from './splash/splash.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SplashComponent, NgIf],
  styleUrls: ['app.component.scss'],
  template: 'app.component.html'
})
export class AppComponent {
  splash = true;
  constructor() {
    setTimeout(() => {
      this.splash = false;
    }, 4000);
  }
}
