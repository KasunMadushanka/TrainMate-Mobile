import { Component,ElementRef,ViewChild } from '@angular/core';
import { NavController,AlertController,PopoverController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import {Http} from '@angular/http';
import * as io from "socket.io-client";
import { TrackingPage } from '../tracking/tracking';
import { LeaderboardPage } from '../leaderboard/leaderboard';
import { HistoryPage } from '../history/history';
import {PopoverPage} from '../popover/popover';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';

@Component({
    selector: 'page-contribution',
    templateUrl: 'contribution.html'
})
export class ContributionPage {

    trains: FirebaseListObservable<any>;
    stations:FirebaseObjectObservable<any>;
    data: any;
    station:any;
    trainId:any;

    @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
    @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

    constructor(public navCtrl: NavController, public locationTracker: LocationTracker,public util:UtilProvider,public http:Http,private alertCtrl: AlertController,public af: AngularFire,public userProvider:UserProvider,public popoverCtrl:PopoverController) {

    }

    gotoContribution(){
        this.navCtrl.push(TrackingPage);
    }

    gotoHistory(){
        this.navCtrl.push(HistoryPage);
    }

    gotoLeaderboard(){
        this.navCtrl.push(LeaderboardPage);
    }

    showNotifications(ev,type) {

        let popover = this.popoverCtrl.create(PopoverPage, {
            type:type
        });

        popover.present({
            ev: ev
        });
    }

    openSettings(ev,type){

        let popover = this.popoverCtrl.create(PopoverPage, {
            type:type
        });

        popover.present({
            ev: ev
        });
    }

}
