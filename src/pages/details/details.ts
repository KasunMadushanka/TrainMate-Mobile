import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {MapPage} from '../map/map';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

/*
  Generated class for the Details page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

    schedule: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,af: AngularFire) {

      this.schedule=af.database.list('/trains/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  showOnMap(){

      this.navCtrl.push(MapPage);
  }

}
