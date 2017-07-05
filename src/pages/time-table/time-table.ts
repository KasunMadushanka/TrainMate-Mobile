import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/take';
import {MapPage} from '../map/map';
import {DetailsPage} from '../details/details';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
    selector: 'page-time-table',
    templateUrl: 'time-table.html'
})
export class TimeTablePage {

    arrivals:any;
    train:any;
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

            this.arrivals=[];

            this.train=this.af.database.object('trains/'+this.trainId,{ preserveSnapshot: true }).take(1);

            this.train.subscribe(snapshot => {

                console.log(new Date().getSeconds());
                this.trainName=snapshot.val().name;
                let stations=snapshot.val()['route']
                let arrival;
                for(let i=0;i<stations.length;i++){
                    let arrivals=this.af.database.object('stations/'+stations[i],{ preserveSnapshot: true }).take(1);
                    arrivals.subscribe(snapshot => {
                        arrival=snapshot.val();
                        this.arrivals.push({stationId:stations[i],stationName:arrival['name'],ar_time:arrival['arrivals'][this.trainId].dynamic_ar_time,dpt_time:arrival['arrivals'][this.trainId].dynamic_dpt_time});
                    });
                }
            });

    }

    getDetails(stationId,stationName){

        this.navCtrl.push(DetailsPage,{trainId:this.trainId,stationId:stationId,stationName:stationName});
    }

}
