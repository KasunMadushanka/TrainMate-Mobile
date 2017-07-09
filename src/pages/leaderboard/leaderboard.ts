import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
    selector: 'page-leaderboard',
    templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {

    users:FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af:AngularFire) {

        this.users = af.database.list('/users', {
            query: {
                orderByChild: 'points'
            }
        });
    }

    test(value){
        console.log(value)
    }

}
