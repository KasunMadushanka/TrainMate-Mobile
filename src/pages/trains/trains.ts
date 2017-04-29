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
    graph={'A':['B'],
    'B':['C','D'],
    'C':['B','E','F','G'],
    'D':['B'],
    'E':['C'],
    'F':['C'],
    'G':['C'],
    'H':['G']}

    route=['A','B','C','D','E','F','G','H'];

    trains: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire,public userProvider:UserProvider) {

        this.findRoute(this.route);
    }

    getDetails(trainId){
        this.navCtrl.push(DetailsPage,{trainId});

    }

    findRoute(route){

        var array=[];

        for(let i=0;i<route.length;i++){
            array[i]=[];
            let list=this.af.database.list('/stations/'+route[i]);

            list.subscribe(

                train => {
                    train.map(train =>
                        array[i].push({trainId:train.trainId,ar_time:train.ar_time,dpt_time:train.dpt_time})


                    )

                });


            }
            setTimeout(function () {

                for(let i=0;i<array[0].length;i++){

                    let path=[];
                    let p=false;
                    let path_exists=true;

                    let current_train=array[0][i];

                    for(let j=0;j<array[array.length-1].length;j++){
                        if(current_train.trainId==array[array.length-1][j].trainId){
                            p=true;
                            path.push(current_train.trainId+' is a direct train');
                            break;
                        }
                    }

                    if(!p){

                        for(let m=1;m<array.length;m++){
                            let k=false;
                            for(let n=0;n<array[m].length;n++){
                                if(current_train.trainId==array[m][n].trainId && current_train.dpt_time<array[m][n].ar_time){
                                    k=true;
                                    path.push(current_train.trainId+" "+route[m-1]+"->"+route[m]);

                                    current_train=array[m][n];
                                    break;

                                }

                            }


                            if(!k){
                                let l=false;

                                for(let n=0;n<array[m-1].length;n++){

                                    if(current_train.trainId!=array[m-1][n].trainId && current_train.ar_time<array[m-1][n].dpt_time){
                                        l=true;
                                        current_train=array[m-1][n];
                                        m-=1;
                                        break;
                                    }

                                }
                                if(!l){
                                    path_exists=false;
                                }

                            }


                        }
                    }

                    if(path_exists){
                        console.log(path);
                    }

                }

            }, 3000);

        }

    }
