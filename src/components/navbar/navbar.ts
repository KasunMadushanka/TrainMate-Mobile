import { Component,Input } from '@angular/core';
import { NavController, NavParams,PopoverController } from 'ionic-angular';
import {OptionsPage} from '../../pages/options/options';
import {PopoverPage} from '../../pages/popover/popover';
import { SettingsPage } from '../settings/settings';
import { NotificationProvider } from '../../providers/notification-provider';

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.html'
})
export class NavbarComponent {

    text: string;
    @Input() title: string;
    @Input() toggle: boolean;

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

    openSettings(ev){

        let popover = this.popoverCtrl.create(OptionsPage);

        popover.present({
            ev: ev
        });
    }

}
