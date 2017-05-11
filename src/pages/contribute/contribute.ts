import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Geolocation, Geoposition,GoogleMapsGroundOverlay} from 'ionic-native';
import { LocationTracker } from '../../providers/location-tracker';
import {Http} from '@angular/http';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';

@Component({
    selector: 'page-contribute',
    templateUrl: 'contribute.html'
})
export class ContributePage {

    trains: FirebaseListObservable<any>;
    stations:FirebaseObjectObservable<any>;
    data: any;
    stationId:any;

    constructor(public navCtrl: NavController, public locationTracker: LocationTracker,public util:UtilProvider,public http:Http,private alertCtrl: AlertController,private backgroundMode: BackgroundMode,public af: AngularFire,public userProvider:UserProvider) {
        this.trains=af.database.list('/trains');


    }

    checkLocation(trainId){
        console.log(trainId)
        this.getStations(trainId,list=>{
            this.getCoordinates(list,coords=>{
                this.getUserPosition(user_coords=>{
                    this.getDistances(user_coords,coords)
                });
            });
        });
    }

    getStations(trainId,callback){

        this.stations= this.af.database.object('/trains/'+trainId+'/route', { preserveSnapshot: true });

        this.stations.subscribe(snapshot => {
            callback(snapshot.val())
        });

    }

    getCoordinates(stations,callback){
        console.log(stations.length)
        let coords=[];

        for(let i=0;i<stations.length;i++){
            let stations_list= this.af.database.object('/stations/'+stations[i], { preserveSnapshot: true });
            stations_list.subscribe(snapshot => {
                let station=snapshot.val();
                coords.push({id:station.key,name:station.name,latitude:station.latitude,longitude:station.longitude});
                if(i==stations.length-1){
                    callback(coords);
                }
            });
        }
    }

    getUserPosition(callback){
        callback({latitude:6.9,longitude:79.9})
        //Geolocation.getCurrentPosition(function(position) {
        //    callback({latitude:position.coords.latitude,longitude:position.coords.longitude})
        //});

    }

    getDistances(user_coords,coords){
        let data=this.applyHaversine(user_coords,coords);
    }

    applyHaversine(user_coords,locations){

        let usersLocation = {
            //lat: user_coords.latitude,
            //lng:user_coords.longitude
            lat: 6.929448334838397,
            lng:79.86510001656347
        };

        locations.map((location) => {

            let placeLocation = {
                id:location.id,
                name:location.name,
                lat: location.latitude,
                lng: location.longitude
            };

            location.distance = this.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'miles'
            ).toFixed(2);

            if(location.distance==0){
                let alert = this.util.doAlert("Confirmation","You are at "+placeLocation.name+" station","Proceed");
                alert.present();
                this.stationId=placeLocation.id;
                return;
            }

        });

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

    start(trainId) {
        console.log(this.stationId)
        this.locationTracker.startTracking(1,trainId);
    }

    stop() {
        this.locationTracker.stopTracking();
    }

}
