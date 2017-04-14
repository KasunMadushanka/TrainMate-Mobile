import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import 'rxjs/add/operator/filter';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import { NavController, AlertController } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';
declare var cordova: any;

@Injectable()
export class LocationTracker {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;

    constructor(public zone: NgZone, private alertCtrl: AlertController, private backgroundMode: BackgroundMode,private badge: Badge) {

    }

    startTracking(con_id, username) {




        let i = 0;

        console.log(i++);

        var socket = io.connect('http://trainmate18.azurewebsites.net:80');

        this.backgroundMode.moveToBackground();
        //this.backgroundMode.setDefaults({ color: 'FF0000' });
        this.badge.clear();

        setInterval(() => {
            if(this.backgroundMode.isActive()){
                this.badge.increase(1);
            }
        }, 5000);


        socket.on('connect', function() {

            setInterval(() => {

                navigator.geolocation.getCurrentPosition((position) => {

                    var data = {
                        id: con_id,
                        username: username,
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                        number: i++

                    };

                    socket.emit('message', data);
                    console.log(position.coords.latitude, position.coords.longitude);

                });

            }, 3000);

        });

    }

    stopTracking() {

        console.log('stopTracking');

        BackgroundGeolocation.finish();
        this.watch.unsubscribe();

    }

}
