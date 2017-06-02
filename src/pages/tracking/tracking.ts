import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import {Http} from '@angular/http';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import firebase from 'firebase';

@Component({
    selector: 'page-tracking',
    templateUrl: 'tracking.html'
})
export class TrackingPage {

    trains: FirebaseListObservable<any>;
    stations:any;
    data: any;
    start_station:any;
    trainId:any;
    startDisabled:any;
    stopDisabled:any;
    imgDisplayed:any;

    userId:any;
    sessions:any;
    sessionId:any;

    constructor(public navCtrl: NavController, public locationTracker: LocationTracker,public util:UtilProvider,public http:Http,private alertCtrl: AlertController,private backgroundMode: BackgroundMode,public af: AngularFire,public userProvider:UserProvider) {

        this.userProvider.getUid()
        .then(uid=> {
            this.userId=uid;
            this.sessions= firebase.database().ref('/users/'+this.userId+'/contributions');

        });

        this.checkLocation();
        this.startDisabled=true;
        this.stopDisabled=true;
        this.imgDisplayed=false;

    }

    checkLocation(){
        this.getAllStations(coords=>{
            this.locationTracker.getUserPosition(user_coords=>{
                this.getDistances(user_coords,coords);
            });
        });
    }

    getAllStations(callback){

        var array=[];

        let list = firebase.database().ref('/stations');
        list.on('child_added', function(snapshot) {
            array.push({id:snapshot.key,name:snapshot.val().name,latitude:snapshot.val().latitude,longitude:snapshot.val().longitude});
        });

        setTimeout(()=>{
            console.log(array.length)
            callback(array);
        },3000);
    }

    loadStations(trainId){

        this.trainId=trainId;

        this.getTrainStations(trainId,list=>{
            this.getCoordinates(list,stations=>{
                this.stations=stations;
                this.startDisabled=false;
            });
        });
    }

    getTrainStations(trainId,callback){

        let stations:FirebaseObjectObservable<any>= this.af.database.object('/trains/'+trainId+'/route', { preserveSnapshot: true });
        stations.subscribe(snapshot => {
            let list=snapshot.val();
            for(let i=0;i<list.length;i++){
                if(this.start_station.id==list[i]){
                    callback(list.slice(i,list.length));
                }
            }
        });
    }

    getCoordinates(stations,callback){

        let list=[];

        for(let i=0;i<stations.length;i++){
            let stations_list= this.af.database.object('/stations/'+stations[i], { preserveSnapshot: true });
            stations_list.subscribe(snapshot => {
                let station=snapshot.val();
                if(i<stations.length-1){
                    list.push({id:snapshot.key,name:station.name,latitude:station.latitude,longitude:station.longitude,ar_time:station.arrivals[this.trainId].dynamic_ar_time,dpt_time:station.arrivals[this.trainId].dynamic_dpt_time,distance:station.distances[stations[i+1]]['distance'],avg_speed:station.distances[stations[i+1]].avgSpeed});
                }else if(i==stations.length-1){
                    list.push({id:snapshot.key,name:station.name,latitude:station.latitude,longitude:station.longitude,ar_time:station.arrivals[this.trainId].dynamic_ar_time,dpt_time:station.arrivals[this.trainId].dynamic_dpt_time,distance:0,avg_speed:0});
                    callback(list);
                }
            });
        }
    }

    getDistances(user_coords,coords){
        this.applyHaversine(user_coords,coords,start_station=>{
            this.getTrains(start_station);
        });
    }

    getTrains(start_station){
        this.trains= this.af.database.list('/stations/'+start_station.id+'/arrivals');
    }

    applyHaversine(user_coords,locations,callback){

        let found=false;

        let usersLocation = {
            lat: user_coords.latitude,
            lng:user_coords.longitude
        };

        for(let i=0;i<locations.length;i++){

            if(!found){

                let placeLocation = {
                    id:locations[i].id,
                    name:locations[i].name,
                    lat: locations[i].latitude,
                    lng: locations[i].longitude
                };

                let distance = this.locationTracker.getDistanceBetweenPoints(
                    usersLocation,
                    placeLocation,
                    'miles'
                ).toFixed(2);

                if(Number(distance)<0.2){
                    let alert = this.util.doAlert("Confirmation","You are at "+placeLocation.name+" station","Proceed");
                    alert.present();
                    this.start_station=placeLocation;
                    found=true;
                    callback(placeLocation);
                }

            }
        }

        if(!found){

            let alert = this.util.doAlert("Error","The system cannot detect what station you are at. Please make sure you are at a station before start contributing...","OK");
            alert.present();

        }
    }

    startSession(){

        let time=new Date();

        this.sessionId=this.sessions.push({
            start_time:time.getHours()+":"+time.getMinutes(),
            end_time:""
        }).key;

        console.log(this.sessionId)


    }

    endSession(){

        let time=new Date();
        let session:FirebaseListObservable<any>=this.af.database.list('/users/'+this.userId+'/contributions');
        session.update(this.sessionId,{
            end_time:time.getHours()+":"+time.getMinutes()
        });
    }

    start(trainId) {
        this.locationTracker.startTrack(1,trainId,this.stations);
        this.startSession();
        this.startDisabled=true;
        this.stopDisabled=false;
        this.imgDisplayed=true;
    }

    stop() {
        this.locationTracker.stopTracking();
        this.endSession();

    }

}
