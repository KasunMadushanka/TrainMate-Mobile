import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {MapPage} from '../map/map';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

    schedule: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,af: AngularFire) {
      navParams.get('trainId');
      this.schedule=af.database.list('/trains/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  showOnMap(){

      this.navCtrl.push(MapPage);
  }

}
