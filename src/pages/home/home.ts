import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import {Http} from '@angular/http';
import * as io from "socket.io-client";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public position = 0;

  constructor(public navCtrl: NavController, public locationTracker: LocationTracker) {

  }

  start() {
    var latitude = this.locationTracker.startTracking();

    var socket = io.connect('http://trainmate16.azurewebsites.net:80');
    socket.on('connect', function() {
      socket.emit('message', latitude);
    });
  }

  stop() {
    this.locationTracker.stopTracking();
  }

}
