import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import {DetailsPage} from '../details/details';

@Component({
    selector: 'page-trains',
    templateUrl: 'trains.html'
})
export class TrainsPage {
    trains:any;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire,public userProvider:UserProvider) {
        this.trains=navParams.get('trains');

    }

    getDetails(trainId){
        this.navCtrl.push(DetailsPage,{trainId:trainId});

    }

}
