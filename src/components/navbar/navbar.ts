import { Component } from '@angular/core';
import { NavController, NavParams,PopoverController } from 'ionic-angular';
import {PopoverPage} from '../../pages/popover/popover';
import { NotificationProvider } from '../../providers/notification-provider';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {

  text: string;

  constructor(public popoverCtrl:PopoverController,public notificationProvider:NotificationProvider) {

  }

  showPopup(ev,type){

      let popover = this.popoverCtrl.create(PopoverPage, {
          type:type
      });

      popover.present({
          ev: ev
      });
  }

}
