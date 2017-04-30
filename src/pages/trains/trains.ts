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
    graph={'A': ['B'],
    'B': ['A','C', 'D'],
    'C': ['B','E','F','G'],
    'D': ['B'],
    'E': ['C'],
    'F': ['C'],
    'G':['C','H'],
    'H':['G'],}

    route=[];
    path_queue=[];

    trains: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire,public userProvider:UserProvider) {
        let start=navParams.get('start');
        let end=navParams.get('end');
        this.BFS(this.graph,start,end,this.path_queue);
    }

    BFS(graph,start,end,queue){

        let temp_path=[start];

        queue.push(temp_path);

        while(queue.length!=0){

            let tmp_path=queue.shift();
            let last_node=tmp_path[tmp_path.length-1];

            if(last_node==end){
                this.findRoute(tmp_path);
                console.log("pdath: "+tmp_path);

            }

            for(let i=0;i<graph[last_node].length;i++){
                let k=0;

                for(let j=0;j<tmp_path.length;j++){
                    if(graph[last_node][i]==tmp_path[j]){
                        k=1;
                    }

                }
                if(k==0){
                    let new_path=[];
                    new_path=tmp_path+graph[last_node][i];
                    queue.push(new_path);
                }
            }
        }
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
