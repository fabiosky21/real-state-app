import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [EmailComposer],
})
export class InvitePage {
  inviteForm!: FormGroup;
  qrCodeUrl: any = null;

  constructor(
    private fb: FormBuilder,
    private emailComposer: EmailComposer,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: [
        'Come and join me on this amazing real estate app!',
        Validators.required,
      ],
    });
  }

  generateQRCode() {
    const appUrl = `http://localhost:8100/`;
    const qrCodeData = encodeURIComponent(appUrl);
    this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeData}`
    );
  }

  sendInvitation() {
    if (this.inviteForm.invalid) {
      console.error(' Form is invalid');
      return;
    }

    const email = this.inviteForm.value.email;
    const message = this.inviteForm.value.message;

    console.log(' Sending invitation to:', email);

    let emailData = {
      to: email,
      subject: 'You Are Invited!',
      body: message,
      isHtml: true,
    };

    this.emailComposer.open(emailData);
    console.log('Email Sent to:', email);
  }
}
