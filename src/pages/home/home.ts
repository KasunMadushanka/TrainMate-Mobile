import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {TrainsPage} from '../trains/trains';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    graph={'A': ['B'],
    'B': ['A','C', 'D'],
    'C': ['B','E','F','G'],
    'D': ['B'],
    'E': ['C'],
    'F': ['C'],
    'G':['C','H'],
    'H':['G']}

    constructor(public navCtrl: NavController,public navParams: NavParams,public af:AngularFire) {

    }

    findRoutes(start,end){

        let queue=[];
        let temp_path=[start];

        queue.push(temp_path);

        while(queue.length!=0){

            let tmp_path=queue.shift();
            let last_node=tmp_path[tmp_path.length-1];

            if(last_node==end){
                this.getArrivals(tmp_path,data=>{
                    this.findTrains(data,tmp_path);
                });
            }

            for(let i=0;i<this.graph[last_node].length;i++){
                let k=0;

                for(let j=0;j<tmp_path.length;j++){
                    if(this.graph[last_node][i]==tmp_path[j]){
                        k=1;
                    }

                }
                if(k==0){
                    let new_path=[];
                    new_path=tmp_path+this.graph[last_node][i];
                    queue.push(new_path);
                }
            }
        }
    }

    getArrivals(route,callback){

        var array=[];

        for(let i=0;i<route.length;i++){
            array[i]=[];
            let list=this.af.database.list('/stations/'+route[i]);

            list.subscribe(

                train => {
                    train.map(train =>
                        array[i].push({trainId:train.trainId,ar_time:train.ar_time,dpt_time:train.dpt_time})
                    )
                    if(i==route.length-1){
                        callback(array);
                    }
                });
            }
        }

        findTrains(arrivals,route){

            let data=[];

            for(let i=0;i<arrivals[0].length;i++){

                let path=[];
                let p=false;
                let path_exists=true;

                let current_train=arrivals[0][i];

                for(let j=0;j<arrivals[arrivals.length-1].length;j++){
                    if(current_train.trainId==arrivals[arrivals.length-1][j].trainId){
                        p=true;
                        path.push(current_train.trainId+' is a direct train');
                        break;
                    }
                }

                if(!p){

                    for(let m=1;m<arrivals.length;m++){
                        let k=false;
                        for(let n=0;n<arrivals[m].length;n++){
                            if(current_train.trainId==arrivals[m][n].trainId && current_train.dpt_time<arrivals[m][n].ar_time){
                                k=true;
                                path.push(current_train.trainId+" "+route[m-1]+"->"+route[m]);

                                current_train=arrivals[m][n];
                                break;

                            }

                        }

                        if(!k){

                            let l=false;

                            for(let n=0;n<arrivals[m-1].length;n++){

                                if(current_train.trainId!=arrivals[m-1][n].trainId && current_train.ar_time<arrivals[m-1][n].dpt_time){
                                    l=true;
                                    current_train=arrivals[m-1][n];
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
                    data.push(path);
                }
            }

            this.navCtrl.push(TrainsPage,{trains:data});

        }

    }
