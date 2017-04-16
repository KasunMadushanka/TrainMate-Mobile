import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import {Http} from '@angular/http';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';

@Component({
    selector: 'page-contribute',
    templateUrl: 'contribute.html'
})
export class ContributePage {

    contributors: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public locationTracker: LocationTracker,private alertCtrl: AlertController,private backgroundMode: BackgroundMode,af: AngularFire,public userProvider:UserProvider) {
        this.contributors=af.database.list('/contributors');
        this.contributors.push({
            id: 1,
            username: "kasun",
            longitude: 0,
            latitude: 0,
            number: 0
        });
    }

    start(userId) {


        this.locationTracker.startTracking(1,'kasun',userId);


    }

    stop() {
        this.locationTracker.stopTracking();
    }

}
