import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
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

    trains:any;
    stations:any;

    constructor(public zone: NgZone, private alertCtrl: AlertController,public http:Http,public util:UtilProvider, private backgroundMode: BackgroundMode,private badge: Badge,public af: AngularFire,public up: UserProvider) {
        this.k=0;
        this.trains=af.database.list('/trains').take(1);
        this.stations=af.database.list('/stations').take(1);

    }

    getUserPosition(callback){
        //callback({latitude:6.961153,longitude:79.8945402});//kelaniya
        callback({latitude:6.9375911,longitude:79.8790437});//dematagoda
        //callback({latitude:6.9263603,longitude:79.8784536});//baseline
        //navigator.geolocation.getCurrentPosition(function (position) {
        //    callback({latitude:position.coords.latitude,longitude:position.coords.longitude});
        //});
    }

    startTracking(con_id,trainId,stations) {

        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 5,
            distanceFilter: 10,
            debug: false,
            interval: 2000
        };

        let total_distance=0;
        let distance=0,gap=0;
        let i=0,j=0,k=0,m=0;;
        let current_station=stations[0];

        this.trainId=trainId;

        this.trains.update(trainId, {
            con_id:con_id,
            current_station:current_station.name,
            total_distance:current_station.distance,
            avg_speed:current_station.avg_speed
        });

        let arrived=true;

        let coords;

        let placeLocation = {
            lat: current_station.latitude,
            lng: current_station.longitude,
            time:new Date()
        };

        BackgroundGeolocation.configure((location) => {

            let usersLocation = {
                lat: location.latitude,
                lng:location.longitude,
                time:new Date()
            };

            if(arrived && gap>=0.2){

                this.time=new Date();
                let stat=stations[j].dpt_time.split(':');

                let hour_diff=this.time.getHours()-stat[0];
                let minute_diff=this.time.getMinutes()-stat[1];
                let delay=Math.abs(hour_diff*60+minute_diff);

                let alert = this.util.doAlert("Confirmation","You departed from "+current_station.name+" station","Proceed");
                alert.present();

                for(let n=j;n<stations.length;n++){

                    this.stations.update('/'+stations[n].id+'/arrivals/'+trainId,{
                        dynamic_ar_time:this.getUpdatedTime(stations[n].ar_time,delay),
                        dynamic_dpt_time:this.getUpdatedTime(stations[n].dpt_time,delay)
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

                this.time=new Date();
                let stat=stations[j].dpt_time.split(':');

                let hour_diff=this.time.getHours()-stat[0];
                let minute_diff=this.time.getMinutes()-stat[1];
                let delay=Math.abs(hour_diff*60+minute_diff);

                let alert = this.util.doAlert("Confirmation","You arrived at "+current_station.name+" station","Proceed");
                alert.present();

                for(let n=j;n<stations.length;n++){

                    this.stations.update('/'+stations[n].id+'/arrivals/'+trainId,{
                        dynamic_ar_time:this.getUpdatedTime(stations[n].ar_time,delay),
                        dynamic_dpt_time:this.getUpdatedTime(stations[n].dpt_time,delay)
                    });

                }

                this.trains.update(trainId, {
                    current_station:current_station.name,
                    next_station:stations[j+1].name,
                    total_distance:current_station.distance,
                    avg_speed:current_station.avg_speed
                });

                arrived=true;

            }

            let earthRadius = {
                miles: 3958.8,
                km: 6371
            };

            let units='miles';

            let d=Number(this.getDistanceBetweenPoints(
                placeLocation,
                usersLocation,
                'miles'
            ).toFixed(3));

            distance=d;

            gap= Number(this.getDistanceBetweenPoints(
                {lat:current_station.latitude,lng:current_station.longitude},
                usersLocation,
                'miles'
            ).toFixed(3));

            let eventStartTime = new Date(placeLocation.time);
            let eventEndTime = new Date(usersLocation.time);
            var duration = (eventEndTime.valueOf() - eventStartTime.valueOf())/(1000*60*60);

            let current_speed=distance/duration;

            this.trains.update(trainId, {
                con_id: con_id,
                latitude:location.latitude,
                longitude:location.longitude,
                distance:total_distance,
                current_speed:current_speed
            });
            total_distance+=distance;

            placeLocation = {
                lat: location.latitude,
                lng: location.longitude,
                time:new Date()
            };

            i++;

        }, (err) => {

            console.log(err);

        }, config);

        // Turn ON the background-geolocation system.
        BackgroundGeolocation.start();

        this.backgroundMode.enable();

    }

    getData(stations,callback){

        this.http.get('assets/data/trainPath/path-'+this.trainId+'.json')
        .subscribe(result =>
            callback(result.json()));

        }

        startTrack(con_id,trainId,stations){
            console.log(con_id)
            let total_distance=0;
            let distance=0,gap=0;
            let i=0,j=0,k=0;
            let current_station=stations[0];

            this.trainId=trainId;

            this.trains.update(trainId, {
                con_id:con_id,
                current_station:current_station.name,
                total_distance:current_station.distance,
                avg_speed:current_station.avg_speed,
                status:1
            });

            let arrived=true;

            let coords;

            this.getData(stations,coords=>{

                let current_station=stations[0];
                let distance=0;

                let placeLocation = {
                    lat: current_station.latitude,
                    lng: current_station.longitude,
                    time:new Date()
                };
                let k=0;
                let m=0;

                let segment=stations[0].id+'-'+stations[1].id;
                let pathCoordinates=coords[segment];

                setInterval(()=>{

                    let status=0;

                    if(i<pathCoordinates.length){

                        let usersLocation = {
                            lat: pathCoordinates[i][0],
                            lng:pathCoordinates[i][1],
                            time:new Date()
                        };

                        /*for(let n=m,b=0;n<pathCoordinates.length;n++,b++){
                        let d=Number(this.getDistanceBetweenPoints(
                        {lat:pathCoordinates[n][0],lng:pathCoordinates[n][1]},
                        usersLocation,
                        'miles'
                    ).toFixed(3));
                    if(d<0.05){
                    status=1;
                    m=n;
                    console.log(b)
                    break;
                }
            }

            if(status==1){*/

            if(arrived && gap>=0.2){

                this.time=new Date();
                let stat=stations[j].dpt_time.split(':');

                let hour_diff=this.time.getHours()-stat[0];
                let minute_diff=this.time.getMinutes()-stat[1];
                let delay=Math.abs(hour_diff*60+minute_diff);

                let alert = this.util.doAlert("Confirmation","You departed from "+current_station.name+" station","Proceed");
                alert.present();

                for(let n=j;n<stations.length;n++){

                    this.stations.update('/'+stations[n].id+'/arrivals/'+trainId,{
                        dynamic_ar_time:this.getUpdatedTime(stations[n].ar_time,delay),
                        dynamic_dpt_time:this.getUpdatedTime(stations[n].dpt_time,delay)
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

                this.time=new Date();
                let stat=stations[j].dpt_time.split(':');

                let hour_diff=this.time.getHours()-stat[0];
                let minute_diff=this.time.getMinutes()-stat[1];
                let delay=Math.abs(hour_diff*60+minute_diff);

                let alert = this.util.doAlert("Confirmation","You arrived at "+current_station.name+" station","Proceed");
                alert.present();

                for(let n=j;n<stations.length;n++){

                    this.stations.update('/'+stations[n].id+'/arrivals/'+trainId,{
                        dynamic_ar_time:this.getUpdatedTime(stations[n].ar_time,delay),
                        dynamic_dpt_time:this.getUpdatedTime(stations[n].dpt_time,delay)
                    });

                }

                this.trains.update(trainId, {
                    current_station:current_station.name,
                    next_station:stations[j+1].name,
                    total_distance:current_station.distance,
                    avg_speed:current_station.avg_speed
                });

                arrived=true;

            }

            let earthRadius = {
                miles: 3958.8,
                km: 6371
            };

            let units='miles';

            let d=Number(this.getDistanceBetweenPoints(
                placeLocation,
                usersLocation,
                'miles'
            ).toFixed(3));

            distance=d;

            gap= Number(this.getDistanceBetweenPoints(
                {lat:current_station.latitude,lng:current_station.longitude},
                usersLocation,
                'miles'
            ).toFixed(3));

            let eventStartTime = new Date(placeLocation.time);
            let eventEndTime = new Date(usersLocation.time);
            var duration = (eventEndTime.valueOf() - eventStartTime.valueOf())/(1000*60*60);

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

            /*}else{
            this.trains.update(trainId,{
            status:0
        })
    }*/

}else{
    k++;
    segment=stations[k].id+'-'+stations[k+1].id;
    pathCoordinates=coords[segment];
    i=0;
    m=0;
}

},2000);

});

}

getUpdatedTime(prev_time,delay){

    let time=prev_time.split(':');

    let hours=Number(time[0])+Number((delay/60).toFixed(0))-1;
    let minutes=Number(time[1])+(delay%60);

    if(hours>23){
        hours-=24;
    }
    if(minutes>59){
        hours+=1;
        minutes=(minutes%60);
    }

    if(hours<10){
        hours=Number("0"+hours);
    }
    if(minutes<10){
        minutes=Number("0"+minutes);
    }

    return hours+":"+minutes;

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

    return d*1.60934;

}

toRad(x){
    return x * Math.PI / 180;
}

stopTracking() {

    console.log('stopTracking');

    BackgroundGeolocation.finish();

}

}
