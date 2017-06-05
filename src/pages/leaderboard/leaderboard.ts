import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public af:AngularFire) {
      let id=navParams.get('id')
     let a=af.database.list('/trains')
     a.update('8741',{
          con_id:id
     });
  }


}
