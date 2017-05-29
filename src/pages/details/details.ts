import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {MapPage} from '../map/map';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html'
})
export class DetailsPage {

    arrivals:any;
    train:FirebaseObjectObservable<any>;
    trainId:number;
    stationId:number;
    stationName:string;
    trainName:string;
    static_ar_time:string;
    dynamic_ar_time:string;
    static_dpt_time:string;
    dynamic_dpt_time:string;

    private tick: number;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire) {
         let timer = TimerObservable.create(2000, 1000).subscribe(t => { this.tick = t; });
        this.trainId=navParams.get('trainId');
        this.stationId=navParams.get('stationId');
        this.stationName=navParams.get('stationName');
        console.log(this.stationId)
        this.getArrival();
    }

    showOnMap(){

        this.navCtrl.push(MapPage,{trainId:this.trainId});
    }

    getArrival(){
        console.log(this.trainId)
        this.arrivals=[];
        this.train=this.af.database.object('stations/'+this.stationId+'/arrivals/'+this.trainId,{ preserveSnapshot: true });
        this.train.subscribe(snapshot => {
            this.static_ar_time=snapshot.val().static_ar_time;
            this.dynamic_ar_time=snapshot.val().dynamic_ar_time;
            this.static_dpt_time=snapshot.val().static_dpt_time;
            this.dynamic_dpt_time=snapshot.val().dynamic_dpt_time;

        });

    }

}
