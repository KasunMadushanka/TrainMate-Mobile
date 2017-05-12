import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
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
    station:any;
    trainId:any;

    constructor(public navCtrl: NavController, public locationTracker: LocationTracker,public util:UtilProvider,public http:Http,private alertCtrl: AlertController,private backgroundMode: BackgroundMode,public af: AngularFire,public userProvider:UserProvider) {

        this.trains=af.database.list('/trains');

    }

    checkLocation(trainId){

        this.trainId=trainId;

        this.getStations(trainId,list=>{
            this.getCoordinates(list,coords=>{
                this.locationTracker.getUserPosition(user_coords=>{
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
                coords.push({id:snapshot.key,name:station.name,latitude:station.latitude,longitude:station.longitude,ar_time:station.arrivals[this.trainId].dynamic_ar_time,dpt_time:station.arrivals[this.trainId].dynamic_dpt_time});
                if(i==stations.length-1){
                    callback(coords);
                }
            });
        }
    }

    getDistances(user_coords,coords){
        let data=this.applyHaversine(user_coords,coords);
    }

    applyHaversine(user_coords,locations){

        let i=0;

        let usersLocation = {
            lat: user_coords.latitude,
            lng:user_coords.longitude
            //lat: 6.831672283442692,
            //lng:79.86277722355658
        };

        locations.map((location) => {

            let placeLocation = {
                id:location.id,
                name:location.name,
                lat: location.latitude,
                lng: location.longitude
            };

            location.distance = this.locationTracker.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'miles'
            ).toFixed(2);

            if(location.distance<300){
                let alert = this.util.doAlert("Confirmation","You are at "+placeLocation.name+" station","Proceed");
                alert.present();
                this.stations=locations.slice(i,locations.length);
                console.log(this.stations)
                return;
            }

            i++;

        });

    }

    start(trainId) {
        this.locationTracker.startTracking(1,trainId,this.stations);
    }

    stop() {
        this.locationTracker.stopTracking();
    }

}
