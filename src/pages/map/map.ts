import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {GoogleMap, GoogleMapsAnimation, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, GoogleMapsMarkerOptions, GoogleMapsMarker, CameraPosition} from 'ionic-native';
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
    markers=[];
    i:number;

    constructor(public navCtrl: NavController, private platform: Platform, public http:Http,public af : AngularFire) {
        this.i=0;
        this.trains=this.af.database.list('/trains');

        platform.ready().then(() => {
            this.loadData(data=>{
                this.loadMap(data);
            });
        });

    }

    loadData(callback){

        let coords=[];

        this.trains.subscribe(
            trains => {
                trains.map(trains =>
                    coords.push({name:trains.name,latitude:trains.latitude,longitude:trains.longitude})

                )

                callback(coords);
                coords=[];

            });

        }

        loadMap(coords){

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
                    'camera': {
                        'latLng': location,
                        'tilt': 30,
                        'zoom': 15,
                        'bearing': 50
                    }
                });

                this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {

                    let position: CameraPosition = {
                        target: location,
                        zoom: 15,
                        tilt: 30
                    };

                    this.map.moveCamera(position);
                    this.map.clear();

                    for(let i=0;i<coords.length;i++){

                        let l: GoogleMapsLatLng = new GoogleMapsLatLng(coords[i].latitude,coords[i].longitude);

                        let markerOptions: GoogleMapsMarkerOptions = {
                            position: l,
                            title: coords[i].name
                        };

                        let marker=this.map.addMarker(markerOptions)
                        .then((marker: GoogleMapsMarker) => {
                            marker.showInfoWindow();
                            this.markers.push(marker);
                        });

                    }

                });

            }else{
                for(let i=0;i<this.markers.length;i++){
                    let li: GoogleMapsLatLng = new GoogleMapsLatLng(coords[i].latitude,coords[i].longitude);
                    let marker:GoogleMapsMarker=this.markers[i];
                    marker.setPosition(li);
                }
            }
        }

    }
