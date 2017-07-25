import { Component,ViewChild } from '@angular/core';
import { Platform,AlertController,Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../pages/welcome/welcome';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { Push, PushObject,PushOptions } from '@ionic-native/push';
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

    i=0;

    constructor(platform: Platform,public push:Push,public alertCtrl:AlertController,public af:AngularFire,public storage:Storage,public userProvider:UserProvider) {

        this.pages = [
            { title: 'Home', component: HomePage },
            { title: 'Notifications', component: LeaderboardPage },
            { title: 'Profile', component:ProfilePage },
            { title: 'Settings', component: SettingsPage }
        ];

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
            this.pushSetup();
        });

    }

    openPage(page) {
            console.log("scscscs")
        this.userProvider.getUid().then(uid => {
            console.log(uid)
            let f=firebase.database().ref('users/'+uid).child('image');
            console.log(f)
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
            this.i++;
            badge_count=pushObject.getApplicationIconBadgeNumber();
            pushObject.setApplicationIconBadgeNumber(badge_count);


        });

        pushObject.on('registration').subscribe((registration: any) => {

            this.storage.set('device_token', registration.registrationId);
            console.log("device token ->", registration.registrationId);
            this.af.database.list('/devices').push(
                {
                    id:registration.registrationId,
                    badge_count:0
                }
            );
        });

        pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
    }

}
