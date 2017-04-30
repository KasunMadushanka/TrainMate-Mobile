import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import 'rxjs/add/operator/filter';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import { NavController, AlertController } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from './user-provider/user-provider';


@Injectable()
export class LocationTracker {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;


    contributors: FirebaseListObservable<any>;

    constructor(public zone: NgZone, private alertCtrl: AlertController, private backgroundMode: BackgroundMode,private badge: Badge,af: AngularFire,public up: UserProvider) {
        this.contributors=af.database.list('/contributors');

    }

    startTracking(con_id, username,userId) {
this.badge.clear();
        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 5,
            distanceFilter: 5,
            debug: true,
            interval: 4000
        };

        BackgroundGeolocation.configure((location) => {

            console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

            // Run update inside of Angular's zone
            this.zone.run(() => {

                this.lat = location.latitude;
                this.lng = location.longitude;
                this.contributors.update(userId, {
                    id: con_id,
                    username: username,
                    longitude:this.lng,
                    latitude: this.lat,
                    number: i++
                });
            });

        }, (err) => {

            console.log(err);

        }, config);

        // Turn ON the background-geolocation system.
        BackgroundGeolocation.start();

        let i = 0;

        this.backgroundMode.enable();

    }

    stopTracking() {

        console.log('stopTracking');

        BackgroundGeolocation.finish();
        this.watch.unsubscribe();

    }

}
