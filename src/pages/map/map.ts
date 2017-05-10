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
            stationsRef.on('value', function(snapshot) {
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

                for(let i=0;i<station_coords.length;i++){

                    let l: GoogleMapsLatLng = new GoogleMapsLatLng(station_coords[i].latitude,station_coords[i].longitude);

                    let markerOptions: GoogleMapsMarkerOptions = {
                        position: l,
                        title: station_coords[i].name+'\narriving at: '+station_coords[i].ar_time+'\ndeparting at: '+station_coords[i].dpt_time,
                        flat:true,
                        icon:{
                            url:'http://trainmate03.azurewebsites.net/images/station.png',
                            size:{width:35,height:35},
                            optimized:false
                        }

                    };

                    let marker=this.map.addMarker(markerOptions)
                    .then((marker: GoogleMapsMarker) => {
                        marker.showInfoWindow();
                        this.station_markers.push(marker);
                    });

                }

                let pathCoordinates=[
                    [6.929448334838397,79.86510001656347],//maradana
                    [6.929064917874421,79.86459576126867],
                    [6.928441864642933,79.8632492923432],
                    [6.928148976087226,79.86214422222906],
                    [6.928085073105443,79.86164533135229],
                    [6.928117024597417,79.86099623677069],
                    [6.928260806284509,79.86051343914801],
                    [6.931455943572146,79.85768102642828],
                    [6.932020415575154,79.8570372962647],
                    [6.9323079765242674,79.85617898937994],
                    [6.933223910229622,79.85235952374273],
                    [6.933436917812894,79.85051416394049],//fort
                    [6.933628624555481,79.84860443112188],
                    [6.933575372690365,79.84802507397467],
                    [6.933458218565897,79.84740280148321],
                    [6.933178646105917,79.84684758421713],
                    [6.932829845946852,79.84646939274603],
                    [6.931996452154962,79.84608851906592],//secretarial halts
                    [6.93199378955244,79.84609120127493],
                    [6.931477244414714,79.84601073500448],
                    [6.930878157850026,79.84608047243887],
                    [6.929240650688447,79.84688245293432],
                    [6.926993395829159,79.848287930458130],
                    [6.925049671496609,79.84920524594122],
                    [6.924463889990156,79.8493983649903],
                    [6.92216602187675,79.8498141073876],
                    [6.921026402949243,79.84972827669912],
                    [6.920600376475371,79.84951369997793],
                    [6.920195650969046,79.84921329256827],
                    [6.919844178537329,79.84878413912588],
                    [6.918960170961428,79.84720700022513],
                    [6.917969654482443,79.84652035471731],
                    [6.917458419357789,79.84647743937307],
                    [6.911217045935828,79.84820478197867],
                    [6.897413306341793,79.85191695925528],
                    [6.894910270326033,79.85259287592703],
                    [6.892566990582798,79.85331170794302],
                    [6.887933653358676,79.85433094736868],
                    [6.882991377098101,79.85540383097464],
                    [6.878986391344675,79.85653035876089],
                    [6.876621729642439,79.85701315638357],
                    [6.866204296116138,79.85911600825125],
                    [6.864031305761038,79.85969536539847],
                    [6.861261793870754,79.8600065016442],
                    [6.8584709617482105,79.86030690905386],
                    [6.855126202473738,79.86103646990591],
                    [6.850918589795315,79.86209862467581],
                    [6.847019857316504,79.86272089716726],
                    [6.841986610494669,79.86283891436392],
                    [6.837342128267387,79.86346118685537],
                    [6.836649713058758,79.8634290003472],
                    [6.83578152949502,79.86318223711783],
                    [6.834881386588935,79.86275308367544],
                    [6.834146357396629,79.86249559161001],
                    [6.833560463752747,79.86238830324942],
                    [6.8325644429104635,79.86239903208548],
                    [6.831642988625996,79.86269943949515],
                    [6.829986496979712,79.8630159401589],
                    [6.82732331510672,79.8633217119866],
                    [6.823072846136834,79.86414783236319],
                    [6.821203267009862,79.86475132939154],
                    [6.8172883127222725,79.8660226964646],
                    [6.81475822321043,79.86688100334936],//rathmalana
                    [6.811146830209958,79.86799680229956],
                    [6.805511298326444,79.87027131554419],
                    [6.804019842143182,79.87103306290442],
                    [6.798916896313423,79.87261020180517],//angulana
                    [6.797318885432547,79.87303935524756],
                    [6.789286136961336,79.87470232483679],
                    [6.787054202270902,79.87543725010687],//lunawa
                    [6.784944774770633,79.87595223423773],
                    [6.78095494850268,79.87693928715521],
                    [6.778531206133851,79.877802958458],
                    [6.777748148302089,79.87818383213812],
                    [6.776906492887801,79.87880610462958],
                    [6.7754149480385,79.88064610001379],
                    [6.774301613340551,79.8818906449967],
                    [6.773481259813428,79.88237880703741],
                    [6.772181476044112,79.88278113838965],
                    [6.769049195854426,79.88287769791418],
                    [6.766769224022608,79.88316737648779],
                    [6.758373720951103,79.88591932293707],
                    [6.722019938830045,79.89951275822455],
                    [6.7146891863202836,79.90398668286139],
                    [6.714262976381126,79.9042227172547],
                    [6.712345027036344,79.90465187069708]//panadura

                ]

                let pathPoints=[];


                for(let i=0;i<pathCoordinates.length;i++){
                    let coords:GoogleMapsLatLng = new GoogleMapsLatLng(pathCoordinates[i][0],pathCoordinates[i][1]);
                    pathPoints.push(coords);
                }

                let flightPath:GoogleMapsPolylineOptions={
                    points:pathPoints,
                    geodesic: true,
                    width:3,
                    color:'#000000'
                };

                this.map.addPolyline(flightPath);




            });

        }else{

            for(let i=0;i<this.train_markers.length;i++){

                let loc: GoogleMapsLatLng = new GoogleMapsLatLng(coords[i].latitude,coords[i].longitude);

                let marker:GoogleMapsMarker=this.train_markers[i];
                marker.setPosition(loc);
                marker.setTitle(coords[i].name+"\npassed: "+coords[i].distance+" m\nto go: "+(coords[i].total_distance-coords[i].distance+" m"));
            }

            for(let i=0;i<this.station_markers.length;i++){

                let marker:GoogleMapsMarker=this.station_markers[i];
                marker.setTitle(station_coords[i].name+'\narriving at: '+station_coords[i].ar_time+'\ndeparting at: '+station_coords[i].dpt_time);
            }

        }
    }

}
