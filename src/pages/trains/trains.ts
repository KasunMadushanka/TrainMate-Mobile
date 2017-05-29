import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import {TimeTablePage} from '../time-table/time-table';
import firebase from 'firebase';

@Component({
    selector: 'page-trains',
    templateUrl: 'trains.html'
})
export class TrainsPage {
    trains:any;
    options=[];

    direct_trains=[];
    other_options=[];

    start_station:string;
    end_station:string;
    display:boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire,public userProvider:UserProvider,public loadingCtrl: LoadingController) {

        this.presentLoading();

        this.trains=navParams.get('trains');
        console.log(this.trains[0][0].ar_time)

        let start_station=navParams.get('start');
        let end_station=navParams.get('end');

        this.load(start_station,end_station);

        let trainRef,startRef,endRef;
        let status=1;
        let train,start,end;
        console.log(this.trains)
        for(let i=0;i<this.trains.length;i++){
            let temp=[];
            let entries=this.trains[i].length;

            for(let j=0;j<this.trains[i].length;j++){

                this.getTrain(i,j,entries,data=>{
                    if(entries>1){
                        console.log(this.trains[i][j].trainId+"kb")
                        this.getStart(i,j,data,result=>{
                            this.getEnd(i,j,result,res=>{
                                    temp.push([this.trains[i][j].trainId,this.trains[i][j].ar_time,this.trains[i][j].dpt_time,data,res]);
                                    if(j==entries-1){
                                    this.other_options.push(temp);
                                }
                            });
                        });

                    }else{
                        status=0
                        this.direct_trains.push([this.trains[i][j].trainId,this.trains[i][j].ar_time,this.trains[i][j].dpt_time,data])
                    }
                });

            }

        }


    }

    presentLoading() {
        this.loadingCtrl.create({
            content: 'Please wait...',
            duration: 3000,
            dismissOnPageChange: true
        }).present();
    }

    getTimes(){


    }

    load(start,end){

        let station = this.af.database.object('/stations/' +start, { preserveSnapshot: true });
        station.subscribe(snapshot => {
            this.start_station=snapshot.val().name;
        });

        station = this.af.database.object('/stations/' +end, { preserveSnapshot: true });
        station.subscribe(snapshot => {
            this.end_station=snapshot.val().name;
        });

    }

    getTrain(i,j,entries,callback){
        let temp;
        let trainRef = firebase.database().ref('/trains/'+this.trains[i][j].trainId);
        trainRef.on('value', function(snapshot) {
            let train=snapshot.val().name;
            temp=train;
            callback(temp)
        });
    }

    getStart(i,j,tmp,callback){

        let startRef = firebase.database().ref('/stations/'+this.trains[i][j].start);
        startRef.on('value', function(snapshot) {
            let start=snapshot.val().name;

            tmp=" from "+start;
            callback(tmp)
        });
    }

    getEnd(i,j,tmp,callback){

        let endRef = firebase.database().ref('/stations/'+this.trains[i][j].end);
        endRef.on('value', function(snapshot) {
            let end=snapshot.val().name;

            tmp+=" to "+end;
            callback(tmp)
        });
    }

    getDetails(trainId){
        this.navCtrl.push(TimeTablePage,{trainId:trainId});

    }

}
