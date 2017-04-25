import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';

/*
Generated class for the Trains page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/

import {DetailsPage} from '../details/details';


@Component({
    selector: 'page-trains',
    templateUrl: 'trains.html'
})
export class TrainsPage {

    trainDetails = DetailsPage;

    trains: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams,af: AngularFire,public userProvider:UserProvider) {
        this.trains=af.database.list('/trains');
    }

    getDetails(trainId){

        this.navCtrl.push(DetailsPage,{trainId});

    }

}
