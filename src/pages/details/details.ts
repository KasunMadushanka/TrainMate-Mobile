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
    trainId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,af: AngularFire) {
      this.trainId=navParams.get('trainId');

  }

  showOnMap(){

      this.navCtrl.push(MapPage,{trainId:this.trainId});
  }

}
