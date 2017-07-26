import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {

    notifications:FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public af:AngularFire,public userProvider: UserProvider) {
      this.userProvider.getDeviceToken().then(device_token => {
           this.notifications=af.database.list('devices/'+device_token+'/notifications');
      });
  }

}
