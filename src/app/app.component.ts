import { Component,ViewChild } from '@angular/core';
import { Platform,AlertController,Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { WelcomePage } from '../pages/welcome/welcome';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { Push, PushObject,PushOptions } from '@ionic-native/push';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage = TabsPage;
    pages: Array<{title: string, component: any}>;

 i=0;

    constructor(platform: Platform,public push:Push,public alertCtrl:AlertController) {

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

        pushObject.on('notification').subscribe((notification: any) => {
            this.i++;
            pushObject.setApplicationIconBadgeNumber(this.i);

        });

        pushObject.on('registration').subscribe((registration: any) => {
            console.log("device token ->", registration.registrationId);
        });

        pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
    }





}
