import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {GoogleMap, GoogleMapsAnimation, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, GoogleMapsMarkerOptions, GoogleMapsMarker, CameraPosition,GoogleMapsPolyline,GoogleMapsPolylineOptions} from 'ionic-native';
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
                            title: coords[i].name,
                            icon:'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'
                        };

                        let marker=this.map.addMarker(markerOptions)
                        .then((marker: GoogleMapsMarker) => {
                            marker.showInfoWindow();
                            this.markers.push(marker);
                        });

                    }

                    let l1: GoogleMapsLatLng = new GoogleMapsLatLng(6.929448334838397,79.86510001656347);
                    let l2: GoogleMapsLatLng = new GoogleMapsLatLng(6.929064917874421,79.86459576126867);
                    let l3: GoogleMapsLatLng = new GoogleMapsLatLng(6.928441864642933,79.8632492923432);
                    let l4: GoogleMapsLatLng = new GoogleMapsLatLng(6.928148976087226,79.86214422222906);
                    let l5: GoogleMapsLatLng = new GoogleMapsLatLng(6.928085073105443,79.86164533135229);
                    let l6: GoogleMapsLatLng = new GoogleMapsLatLng(6.928117024597417,79.86099623677069);

                    let l7: GoogleMapsLatLng = new GoogleMapsLatLng(6.928260806284509,79.86051343914801);
                    let l8: GoogleMapsLatLng = new GoogleMapsLatLng(6.931455943572146,79.85768102642828);
                    let l9: GoogleMapsLatLng = new GoogleMapsLatLng(6.932020415575154,79.8570372962647);
                    let l10: GoogleMapsLatLng = new GoogleMapsLatLng(6.9323079765242674,79.85617898937994);
                    let l11: GoogleMapsLatLng = new GoogleMapsLatLng(6.933223910229622,79.85235952374273);
                    let l12: GoogleMapsLatLng = new GoogleMapsLatLng(6.933436917812894,79.85051416394049);

                    let flightPlanCoordinates = [l1,l2,l3,l4,l5,l6,l7,l8,l9,l10,l11,l12];

                    let flightPath:GoogleMapsPolylineOptions={
                        points:flightPlanCoordinates,
                        geodesic: true,
                        width:3,
                        color:'#000000'
                    };

                    this.map.addPolyline(flightPath);

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
