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

    trainId:number;
    stationId:number;
    stationName:string;
    trainName:string;

    static_ar_time:string;
    dynamic_ar_time:string;
    static_dpt_time:string;
    dynamic_dpt_time:string;
    delay:string;

    prev_station:string;
    current_station:string;
    next_station:string;

    avg_speed:any;
    current_speed:any;

    private tick: string;
    dif:number;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire) {

        this.trainId=navParams.get('trainId');
        this.stationId=navParams.get('stationId');
        this.stationName=navParams.get('stationName');
        console.log(this.stationId)
        this.getArrival();

        /*let timer = TimerObservable.create(2000, 1000).subscribe(t => {
            let hourDiff2=Number(((this.dif-t)/60).toFixed(0));
            let minDiff=((this.dif-t)%60);
            this.tick = hourDiff2+":"+minDiff;
        });*/
    }

    showOnMap(){

        this.navCtrl.push(MapPage,{trainId:this.trainId});
    }

    getArrival(){
        console.log(this.trainId)
        let arrivals=this.af.database.object('stations/'+this.stationId+'/arrivals/'+this.trainId,{ preserveSnapshot: true });
        arrivals.subscribe(snapshot => {
            this.static_ar_time=snapshot.val().static_ar_time;
            this.dynamic_ar_time=snapshot.val().dynamic_ar_time;
            this.static_dpt_time=snapshot.val().static_dpt_time;
            this.dynamic_dpt_time=snapshot.val().dynamic_dpt_time;

            let time1=this.static_ar_time.split(':')
            let time2=this.dynamic_ar_time.split(':')

            let hourDif=Number(time2[0])-Number(time1[0]);
            let minDif=Number(time2[1])-Number(time1[1]);

            let dif=hourDif*60+minDif;

            let hourDiff=Number((dif/60).toFixed(0));
            let minDiff=(dif%60);

            if(hourDiff>0){
                if(hourDif==1){
                    this.delay=hourDiff+" hour and "+minDiff+" mins";
                }else{
                    this.delay=hourDiff+" hours and "+minDiff+" mins";
                }
            }else{
                this.delay=minDiff+" mins";
            }

            let time=new Date();

            let time3=this.dynamic_ar_time.split(':')

            let hourDif2=time.getHours()-Number(time3[0]);
            let minDif2=time.getMinutes()-Number(time3[1]);

            this.dif=hourDif2*60+minDif2;


        });

        let train=this.af.database.object('trains/'+this.trainId,{ preserveSnapshot: true });
        train.subscribe(snapshot => {
            this.trainName=snapshot.val().name;
            this.prev_station=snapshot.val().prev_station;
            this.current_station=snapshot.val().current_station;
            this.next_station=snapshot.val().next_station;
            this.avg_speed=snapshot.val().avg_speed;
            this.current_speed=snapshot.val().current_speed;

        });


    }

}
