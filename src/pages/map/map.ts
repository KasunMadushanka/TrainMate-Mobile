import {Component} from '@angular/core';
import {NavController, NavParams,Platform} from 'ionic-angular';
import {GoogleMap, GoogleMapsAnimation, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, GoogleMapsMarkerOptions, GoogleMapsMarker,GoogleMapsMarkerIcon,CameraPosition,GoogleMapsPolyline,GoogleMapsPolylineOptions} from 'ionic-native';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';
import { DetailsPage } from '../details/details';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})

export class MapPage {

    map: GoogleMap;
    url: any;
    trains:any;
    stations:any;
    train_markers=[];
    station_markers=[];
    route:any;
    i:number;

    constructor(public navCtrl: NavController,public navParams:NavParams, private platform: Platform, public http:Http,public af : AngularFire) {
        this.i=0;
        let trainId=navParams.get('trainId');
        console.log(trainId);

        platform.ready().then(() => {
            this.loadTrain(trainId,coords=>{
                this.loadStations(trainId,coords[0].route,station_coords=>{
                    console.log(station_coords)
                    this.loadMap(coords,station_coords);
                });
            });
        });

    }

    loadTrain(trainId,callback){

        let coords=[];
        let trainRef = firebase.database().ref('/trains/'+trainId);
        trainRef.on('value', function(snapshot) {
            let train=snapshot.val();
            coords.push({name:train.name,latitude:train.latitude,longitude:train.longitude,route:train.route,distance:train.distance,total_distance:train.total_distance});
            callback(coords);
            coords=[];
        });


    }

    loadStations(trainId,stations,callback){

        let coords=[];

        for(let i=0;i<stations.length;i++){

            let stationsRef = firebase.database().ref('/stations/'+stations[i]);
            stationsRef.once('value', function(snapshot) {
                let station=snapshot.val();
                coords.push({name:station.name,latitude:station.latitude,longitude:station.longitude,ar_time:station.arrivals[trainId].dynamic_ar_time,dpt_time:station.arrivals[trainId].dynamic_dpt_time});
                if(i==stations.length-1){
                    callback(coords);
                    coords=[];
                }
            });
        }


    }


    loadMap(coords,station_coords){

        this.i++;

        if(this.i==1){

            let location: GoogleMapsLatLng = new GoogleMapsLatLng(coords[0].latitude,coords[0].longitude);

            this.map = new GoogleMap('map', {
                'backgroundColor': 'white',
                'controls': {
                    'compass': true,
                    'myLocationButton': true,
                    'indoorPicker': true,
                    'zoom': true
                },
                'gestures': {
                    'scroll': true,
                    'tilt': true,
                    'rotate': true,
                    'zoom': true
                },

            });

            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {

                let position: CameraPosition = {
                    target: location,
                    zoom: 15,
                    tilt: 30
                };

                this.map.moveCamera(position);
                this.map.clear();

                for(let i=0;i<station_coords.length;i++){

                    let l: GoogleMapsLatLng = new GoogleMapsLatLng(station_coords[i].latitude,station_coords[i].longitude);

                    let markerOptions: GoogleMapsMarkerOptions = {
                        position: l,
                        title: station_coords[i].name+'\narriving at: '+station_coords[i].ar_time+'\ndeparting at: '+station_coords[i].dpt_time,
                        flat:true,
                        icon:{
                            url:'http://trainmate03.azurewebsites.net/images/station.png',
                            size:{width:30,height:30},
                            optimized:false
                        }

                    };

                    let marker=this.map.addMarker(markerOptions)
                    .then((marker: GoogleMapsMarker) => {
                        marker.showInfoWindow();
                        this.station_markers.push(marker);
                    });

                }

                for(let i=0;i<coords.length;i++){

                    let l: GoogleMapsLatLng = new GoogleMapsLatLng(coords[i].latitude,coords[i].longitude);

                    let markerOptions: GoogleMapsMarkerOptions = {
                        position: l,
                        title: coords[i].name,
                        icon:{
                            url:'http://trainmate03.azurewebsites.net/images/train.png',
                            size:{width:50,height:70},
                            optimized:false
                        }
                    };

                    let marker=this.map.addMarker(markerOptions)
                    .then((marker: GoogleMapsMarker) =>{
                        marker.showInfoWindow();
                        this.train_markers.push(marker);
                    });

                }

                this.getData(coordinates=>{

                    let path=['001-002','002-003','003-004','004-005','005-006','038-001','039-038','040-001','041-040'];
                    let pathCoords;
                    let pathPoints;

                    for(let i=0;i<path.length;i++){

                        pathCoords=coordinates[path[i]];
                        pathPoints=[];

                        for(let j=0;j<pathCoords.length;j++){
                            let coords:GoogleMapsLatLng = new GoogleMapsLatLng(pathCoords[j][0],pathCoords[j][1]);
                            pathPoints.push(coords);
                        }

                        let flightPath:GoogleMapsPolylineOptions={
                            points:pathPoints,
                            geodesic: true,
                            width:3,
                            color:'#000000'
                        };

                        this.map.addPolyline(flightPath);

                    }

                });

            });

        }else{

            for(let i=0;i<this.train_markers.length;i++){

                let loc: GoogleMapsLatLng = new GoogleMapsLatLng(coords[i].latitude,coords[i].longitude);

                let marker:GoogleMapsMarker=this.train_markers[i];
                marker.setPosition(loc);
                //this.map.setCenter(loc)
                marker.setTitle(coords[i].name+"\npassed: "+(coords[i].distance).toFixed(0)+" m\nto go: "+((coords[i].total_distance-coords[i].distance).toFixed(0)+" m"));
            }

            for(let i=0;i<this.station_markers.length;i++){

                let marker:GoogleMapsMarker=this.station_markers[i];
                marker.setTitle(station_coords[i].name+'\narriving at: '+station_coords[i].ar_time+'\ndeparting at: '+station_coords[i].dpt_time);
            }

        }
    }

    getData(callback){

        this.http.get('assets/data/trainLine.json')
        .subscribe(result =>
            callback(result.json()));

        }


    }
