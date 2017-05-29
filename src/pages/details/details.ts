import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {MapPage} from '../map/map';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html'
})
export class DetailsPage {

    arrivals:any;
    train:FirebaseObjectObservable<any>;
    trainId:number;
    trainName:string;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire) {
        this.trainId=navParams.get('trainId');
        this.getData();
    }

    showOnMap(){

        this.navCtrl.push(MapPage,{trainId:this.trainId});
    }

    getData(){
        console.log(this.trainId)
        this.arrivals=[];
        this.train=this.af.database.object('trains/'+this.trainId,{ preserveSnapshot: true });
        this.train.subscribe(snapshot => {
            this.trainName=snapshot.val().name;
            let stations=snapshot.val()['route']
            let arrival;
            for(let i=0;i<stations.length;i++){
                let arrivals=this.af.database.object('stations/'+stations[i],{ preserveSnapshot: true });
                arrivals.subscribe(snapshot => {
                    arrival=snapshot.val();
                    console.log(arrival)
                    this.arrivals.push({station:arrival['name'],ar_time:arrival['arrivals'][this.trainId].dynamic_ar_time,dpt_time:arrival['arrivals'][this.trainId].dynamic_dpt_time});
                });
            }
        });

    }

}
