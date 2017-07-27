import { Component,ViewChild } from '@angular/core';
import { Platform,AlertController,Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../pages/welcome/welcome';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { Push, PushObject,PushOptions } from '@ionic-native/push';
import { Badge } from '@ionic-native/badge';
import { AngularFire, FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';
import { UserProvider } from '../providers/user-provider/user-provider';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage = TabsPage;
    pages: Array<{title: string, component: any}>;
    picture:any = "assets/images/default-user.png";
    devices:any;

    i=0;

    constructor(platform: Platform,public push:Push,public alertCtrl:AlertController,public af:AngularFire,public storage:Storage,public userProvider:UserProvider,public badge:Badge) {

        this.pages = [
            { title: 'Home', component: HomePage },
            { title: 'Notifications', component: NotificationsPage },
            { title: 'Profile', component:ProfilePage },
            { title: 'Settings', component: SettingsPage }
        ];

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
            this.pushSetup();
            this.storage.clear();
            this.badge.set(0);
        });

        this.devices=firebase.database().ref('devices/');

    }

    openPage(page) {
        this.userProvider.getUid().then(uid => {
            console.log(uid)
            let f=firebase.database().ref('users/'+uid).child('image');
        });

        this.nav.setRoot(page.component);
    }

    pushSetup() {
        const options: PushOptions = {
            android: {
                senderID: '405567674998'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        let badge_count;

        pushObject.on('notification').subscribe((notification: any) => {
            this.userProvider.getBadge().then(badge=>{
                let new_badge=badge+1;

                pushObject.setApplicationIconBadgeNumber(new_badge);
                this.storage.set('badge',new_badge);
                this.userProvider.getDeviceToken().then(device_token=>{
                    this.devices.child(device_token).child("badge").set(new_badge);
                });
            });
        });

        pushObject.on('registration').subscribe((registration: any) => {

            this.devices.child(registration.registrationId).child("badge").set(0);

            this.storage.set('device_token', registration.registrationId);
            this.storage.set('badge',0);

        });

        pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
    }

}
