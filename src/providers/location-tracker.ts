import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import 'rxjs/add/operator/filter';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import { NavController, AlertController } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from './user-provider/user-provider';
import { UtilProvider } from './utils';

@Injectable()
export class LocationTracker {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    next_station:any;
    time:Date;

    trains: FirebaseListObservable<any>;

    constructor(public zone: NgZone, private alertCtrl: AlertController,public util:UtilProvider, private backgroundMode: BackgroundMode,private badge: Badge,public af: AngularFire,public up: UserProvider) {
        this.trains=af.database.list('/trains');

    }

    startTracking(con_id,trainId,station) {

        console.log(station)
        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 5,
            distanceFilter: 10,
            debug: true,
            interval: 4000
        };

        let distance=0;
        let i=0;
        let current_station=station[i];

        let arrived=true;

        BackgroundGeolocation.configure((location) => {

            let usersLocation = {
                //lat: location.latitude,
                //lng:location.longitude
                lat: 6.929448334838397,
                lng:79.86510001656347
            };

            location.distance = this.getDistanceBetweenPoints(
                current_station,
                usersLocation,
                'miles'
            ).toFixed(2);

            if(arrived && location.distance>=500){

                this.time=new Date();

                current_station= this.af.database.object('/stations/'+station[0].id, { preserveSnapshot: true });
                current_station.update(trainId, {
                    prev_station:this.next_station,
                    current_station:0,
                    next_station:station[i+1].id,
                    dynamic_dpt_time:this.time.getHours()+":"+this.time.getMinutes()
                });
                this.next_station=station[i+1];
                arrived=false;

            }else if(!arrived && location.distance<=500){

                this.time=new Date();

                this.next_station= this.af.database.object('/stations/'+this.next_station.id, { preserveSnapshot: true });
                current_station.update(trainId, {
                    current_station:this.next_station,
                    next_station:station[i+1].id,
                    dynamic_ar_time:this.time.getHours()+":"+this.time.getMinutes()
                });
                arrived=true;

            }

            // Run update inside of Angular's zone
            this.zone.run(() => {

                this.lat = location.latitude;
                this.lng = location.longitude;

                this.trains.update(trainId, {
                    con_id: con_id,
                    longitude:this.lng,
                    latitude: this.lat,
                    distance:distance,
                    total_distance:0
                });

                distance+=10;
            });

        }, (err) => {

            console.log(err);

        }, config);

        // Turn ON the background-geolocation system.
        BackgroundGeolocation.start();

        this.backgroundMode.enable();

    }

    getDistanceBetweenPoints(start, end, units){

        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;

    }

    toRad(x){
        return x * Math.PI / 180;
    }

    stopTracking() {

        console.log('stopTracking');

        BackgroundGeolocation.finish();
        this.watch.unsubscribe();

    }

}
