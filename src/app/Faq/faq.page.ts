import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FaqPage {
  faqs = [
    {
      question: 'How do I create an account?',
      answer: 'To create an account, click on the Sign-Up button and follow the steps to register.',
      expanded: false,
    },
    {
      question: 'How do I make a booking?',
      answer: 'Navigate to the property you want, choose a date and time, and click "Book Now".',
      expanded: false,
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Currently, bookings cannot be canceled directly from the app. Please contact support.',
      expanded: false,
    },
    {
      question: 'How do I contact the agent?',
      answer: 'Go to "My Bookings" and click on the agent’s name to view their contact details.',
      expanded: false,
    },
    {
      question: 'Why am I not receiving booking confirmations?',
      answer: 'Check your spam folder or make sure your email is correct in your profile settings.',
      expanded: false,
    },
  ];
  constructor(private router: Router) {}

  toggleFAQ(index: number) {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }

  goBack() {
    this.router.navigate(['/profile']); 
  }
}

