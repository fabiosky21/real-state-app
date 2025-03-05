import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  showCheck = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Show checkmark after 4 seconds (loader disappears)
    setTimeout(() => {
      this.showCheck = true;
    }, 4000);

    // Auto-close modal after 6 seconds
    setTimeout(() => {
      this.closeModal();
    }, 6000);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
