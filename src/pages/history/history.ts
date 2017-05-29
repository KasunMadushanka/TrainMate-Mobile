import { Component } from '@angular/core';
import { NavController,AlertController,NavParams } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import {Http} from '@angular/http';
import * as io from "socket.io-client";
import { BackgroundMode } from '@ionic-native/background-mode';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import firebase from 'firebase';

/*
  Generated class for the History page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
    
    sessions:FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public af:AngularFire,public userProvider:UserProvider) {
       this.userProvider.getUid()
         .then(uid=> {
             this.sessions= af.database.list('/users/'+uid+'/contributions');
             
         });
       
  }



}
