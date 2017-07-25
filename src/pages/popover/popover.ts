import { Component,ElementRef  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';

@Component({
    selector: 'page-popover',
    templateUrl: 'popover.html'
})
export class PopoverPage {

    background: string;
    contentEle: any;
    textEle: any;
    fontFamily;

    notifications:any;

    constructor(private navParams: NavParams,public af: AngularFire,public navCtrl:NavController,public userProvider:UserProvider) {
        let type=navParams.get('type');
        this.userProvider.getUid().then(uid=> {
            if(type==1){
                this.notifications=af.database.list('/users/1/notifications');
            }else{
                this.notifications=af.database.list('/users/1/notifications');
            }
        });
    }

    loadNotifications(){

        this.navCtrl.push(NotificationsPage);
    }

}
