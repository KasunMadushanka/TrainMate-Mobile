import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import {DetailsPage} from '../details/details';
import firebase from 'firebase';

@Component({
    selector: 'page-trains',
    templateUrl: 'trains.html'
})
export class TrainsPage {
    trains:any;
    options:any;

    direct_trains:any;
    other_options:any;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire,public userProvider:UserProvider) {

        this.trains=navParams.get('trains');
        this.options=[];

        let trainRef,startRef,endRef;

        let train,start,end;
        console.log(this.trains.length)
        for(let i=0;i<this.trains.length;i++){
            let temp=[];
            let entries=this.trains[i].length;

            for(let j=0;j<this.trains[i].length;j++){

                this.getTrain(i,j,entries,data=>{
                    if(entries>1){
                        this.getStart(i,j,data,result=>{
                            this.getEnd(i,j,result,res=>{
                                if(temp.length==0){
                                    temp.push(this.trains[i][j].trainId)
                                }
                                temp.push(res)
                            });
                        });

                    }else{
                        console.log(data)
                        temp.push(this.trains[i][j].trainId,data)

                    }
                });

            }
            this.options.push(temp);


        }

    }

    getTrain(i,j,entries,callback){
        let temp;
        let trainRef = firebase.database().ref('/trains/'+this.trains[i][j].trainId);
        trainRef.on('value', function(snapshot) {
            let train=snapshot.val().name;
            if(entries==1){
                temp=train+" is a Direct Train";
            }else{
                if(j==0){
                    temp=" First You can take "+train;
                }else{
                    temp=" Then take "+train;
                }
            }
            callback(temp)
        });
    }

    getStart(i,j,tmp,callback){

        let startRef = firebase.database().ref('/stations/'+this.trains[i][j].start);
        startRef.on('value', function(snapshot) {
            let start=snapshot.val().name;

            tmp+=" from "+start;
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
        this.navCtrl.push(DetailsPage,{trainId:trainId});

    }

}
