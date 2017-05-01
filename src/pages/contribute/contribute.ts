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

    trains: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public locationTracker: LocationTracker,private alertCtrl: AlertController,private backgroundMode: BackgroundMode,af: AngularFire,public userProvider:UserProvider) {
        this.trains=af.database.list('/trains');

    }

    start(trainId) {
console.log(trainId)

        this.locationTracker.startTracking(1,trainId);


    }

    stop() {
        this.locationTracker.stopTracking();
    }

}
