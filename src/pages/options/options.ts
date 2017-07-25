import { Component,ElementRef  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import { SettingsPage } from '../settings/settings';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';

@Component({
    selector: 'page-options',
    templateUrl: 'options.html'
})
export class OptionsPage {

    background: string;
    contentEle: any;
    textEle: any;
    fontFamily;

    notifications:any;

    constructor(private navParams: NavParams,public af: AngularFire,public navCtrl:NavController,public userProvider:UserProvider) {


    }

    gotoSettings(){
        this.navCtrl.push(SettingsPage);
    }

}
