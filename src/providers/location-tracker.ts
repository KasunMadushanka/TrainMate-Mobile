import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import 'rxjs/add/operator/filter';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import { NavController, AlertController } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { UserProvider } from './user-provider/user-provider';
import { UtilProvider } from './utils';
import {Http} from '@angular/http';

@Injectable()
export class LocationTracker {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    next_station:any;
    trainId:any;
    time:Date;
    k:number;

    trains: FirebaseListObservable<any>;

    constructor(public zone: NgZone, private alertCtrl: AlertController,public http:Http,public util:UtilProvider, private backgroundMode: BackgroundMode,private badge: Badge,public af: AngularFire,public up: UserProvider) {
        this.k=0;
        this.trains=af.database.list('/trains');

    }

    getUserPosition(callback){
        callback({latitude: 6.929553,longitude:79.866547});
        /*navigator.geolocation.getCurrentPosition(function (position) {
        callback({latitude:position.coords.latitude,longitude:position.coords.longitude});
    });*/
}

startTracking(con_id,trainId,stations) {

    this.k++;
    this.trainId=trainId;

    console.log(stations)
    let config = {
        desiredAccuracy: 0,
        stationaryRadius: 5,
        distanceFilter: 10,
        debug: false,
        interval: 2000
    };

    let distance=0;
    let current_station=stations[0];

    let i=0;

    let arrived=true;

    let placeLocation = {
        id:current_station.id,
        name:current_station.name,
        lat: current_station.latitude,
        lng: current_station.longitude
    };

    BackgroundGeolocation.configure((location) => {

        let usersLocation = {
            lat: location.latitude,
            lng:location.longitude
        };

        location.distance = this.getDistanceBetweenPoints(
            placeLocation,
            usersLocation,
            'miles'
        ).toFixed(2);

        if(arrived && location.distance>=250){
            this.time=new Date();
            let stat=stations[i].dpt_time.split(':');

            let hour_diff=this.time.getHours()-stat[0];
            let minute_diff=this.time.getMinutes()-stat[1];
            let delay=hour_diff*60+minute_diff;
            let alert = this.util.doAlert("Confirmation","You departed from "+current_station.name+" station","Proceed");
            alert.present();

            //for(let n=i;n<stations.length;n++){
            let stat1=stations[i].dpt_time.split(':');
            let new_time=(Number(stat1[0])+Number((delay/60).toFixed(0)))+":"+(Number(stat1[1])+(delay%60));

            let cur_station:FirebaseObjectObservable<any>= this.af.database.object('/stations/'+current_station.id+'/arrivals/'+trainId);
            cur_station.update({
                dynamic_dpt_time:new_time
            });

            //}

            i++;

            current_station=stations[i];

            arrived=false;

        }else if(!arrived && location.distance<=250){

            let alert = this.util.doAlert("Confirmation","You arrived at "+current_station.name+" station","Proceed");
            alert.present();

            this.time=new Date();

            //for(let n=i;n<stations.length;n++){
            let cur_station:FirebaseObjectObservable<any>= this.af.database.object('/stations/'+current_station.id+'/arrivals/'+trainId);
            cur_station.update({
                dynamic_ar_time:this.time.getHours()+":"+this.time.getMinutes()
            });
            //}
            arrived=true;

        }

        // Run update inside of Angular's zone
        this.zone.run(() => {

            this.trains.update(trainId, {
                con_id: con_id,
                latitude:location.latitude,
                longitude: location.longitude,
                distance:distance,
                total_distance:(6.825-distance).toFixed(3)
            });
            distance+=Number(location.distance);

            placeLocation = {
                id:current_station.id,
                name:current_station.name,
                lat: location.latitude,
                lng: location.longitude
            };

        });

    }, (err) => {

        console.log(err);

    }, config);

    // Turn ON the background-geolocation system.
    BackgroundGeolocation.start();

    this.backgroundMode.enable();

}

getData(callback){

    this.http.get('assets/data/path1.json')
    .subscribe(result =>
        callback(result.json()['path']));

    }

    startTrack(con_id,trainId,stations){

        let total_distance=0;
        let distance=0,gap=0;
        let i=0,j=0;
        let current_station=stations[0];

        this.trains.update(trainId, {
            current_station:current_station.name,
            total_distance:current_station.distance,
            avg_speed:current_station.avg_speed
        });

        let arrived=true;

        this.getData(pathCoordinates=>{

            let current_station=stations[0];
            let distance=0;

            let placeLocation = {
                lat: current_station.latitude,
                lng: current_station.longitude,
                time:new Date()
            };

            setInterval(()=>{


                let usersLocation = {
                    lat: pathCoordinates[i][0],
                    lng:pathCoordinates[i][1],
                    time:new Date()
                };

                if(arrived && gap>=0.2){
                    console.log("gya")
                    this.time=new Date();
                    let stat=stations[j].dpt_time.split(':');

                    let hour_diff=this.time.getHours()-stat[0];
                    let minute_diff=this.time.getMinutes()-stat[1];
                    let delay=hour_diff*60+minute_diff;
                    let alert = this.util.doAlert("Confirmation","You departed from "+current_station.name+" station","Proceed");
                    alert.present();
                    console.log(stations[j].name)
                    for(let n=i;n<stations.length;n++){
                        let stat1=stations[j].dpt_time.split(':');
                        let new_time=(Number(stat1[0])+Number((delay/60).toFixed(0)))+":"+(Number(stat1[1])+(delay%60));

                        let cur_station:FirebaseObjectObservable<any>= this.af.database.object('/stations/'+current_station.id+'/arrivals/'+trainId);
                        cur_station.update({
                            dynamic_dpt_time:new_time
                        });

                        this.trains.update(trainId, {
                            prev_station:current_station.name,
                            current_station:"",
                            next_station:stations[j+1].name
                        });

                    }

                    j++;

                    current_station=stations[j];
                    distance=0;

                    arrived=false;

                }else if(!arrived && gap<=0.2){
                    console.log("awa")
                    let alert = this.util.doAlert("Confirmation","You arrived at "+current_station.name+" station","Proceed");
                    alert.present();

                    this.time=new Date();

                    for(let n=i;n<stations.length;n++){
                        let cur_station:FirebaseObjectObservable<any>= this.af.database.object('/stations/'+current_station.id+'/arrivals/'+trainId);
                        cur_station.update({
                            dynamic_ar_time:this.time.getHours()+":"+this.time.getMinutes()
                        });

                        this.trains.update(trainId, {
                            total_distance:current_station.distance,
                            avg_speed:current_station.avg_speed
                        });
                    }

                    this.trains.update(trainId, {
                        current_station:current_station.name,
                        next_station:stations[j+1].name
                    });

                    arrived=true;

                }

                let earthRadius = {
                    miles: 3958.8,
                    km: 6371
                };

                let units='miles';

                let R = earthRadius[units || 'miles'];
                let lat1 = placeLocation.lat;
                let lon1 = placeLocation.lng;
                let lat2 = usersLocation.lat;
                let lon2 = usersLocation.lng;

                let dLat = this.toRad((lat2 - lat1));
                let dLon = this.toRad((lon2 - lon1));
                let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1*Math.PI / 180) * Math.cos(lat2*Math.PI / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                let d = R * c;
                distance=d*1.60934;

                let lat3 = current_station.latitude;
                let lon3 = current_station.longitude;
                let lat4 = usersLocation.lat;
                let lon4 = usersLocation.lng;

                let dLat1 = this.toRad((lat4 - lat3));
                let dLon1 = this.toRad((lon4 - lon3));
                let a1 = Math.sin(dLat1 / 2) * Math.sin(dLat1 / 2) +
                Math.cos(lat3*Math.PI / 180) * Math.cos(lat4*Math.PI / 180) *
                Math.sin(dLon1 / 2) *
                Math.sin(dLon1 / 2);
                let c1 = 2 * Math.atan2(Math.sqrt(a1), Math.sqrt(1 - a1));
                let d1= R * c1;
                gap=d1*1.60934;

                let eventStartTime = new Date(placeLocation.time);
                let eventEndTime = new Date(usersLocation.time);
                var duration = (eventEndTime.valueOf() - eventStartTime.valueOf())/(1000*60*60);
                console.log(duration*60*60)

                let current_speed=distance/duration;

                this.trains.update(trainId, {
                    con_id: con_id,
                    latitude:pathCoordinates[i][0],
                    longitude:pathCoordinates[i][1],
                    distance:total_distance,
                    current_speed:current_speed
                });
                total_distance+=distance;

                placeLocation = {
                    lat: pathCoordinates[i][0],
                    lng: pathCoordinates[i][1],
                    time:new Date()
                };

                i++;

            },3000);

        });

    }

    updateTimetable(rem_stations){

        let stations= this.af.database.list('/stations');
        for(let i=0;i<rem_stations.length;i++){
            this.trains.update(rem_stations[i]+'/arrivals/'+this.trainId, {
                dynamic_ar_time:2,
                dynamic_dpt_time:2
            });
        }

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

        return d*1609.34;

    }

    toRad(x){
        return x * Math.PI / 180;
    }

    stopTracking() {

        console.log('stopTracking');

        BackgroundGeolocation.finish();

    }

}
