import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import {Http} from '@angular/http';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
    selector: 'page-contribute',
    templateUrl: 'contribute.html'
})
export class ContributePage {

    constructor(public navCtrl: NavController, public locationTracker: LocationTracker,private alertCtrl: AlertController,private backgroundMode: BackgroundMode) {

    }

    start() {


        this.locationTracker.startTracking(1,'kasun');


    }

    stop() {
        this.locationTracker.stopTracking();
    }

}
