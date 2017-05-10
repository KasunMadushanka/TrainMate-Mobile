import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {TrainsPage} from '../trains/trains';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    graph={'001': ['002'],
    '002': ['001','003'],
    '003': ['002','004'],
    '004': ['003','005'],
    '005': ['004','006'],
    '006': ['005','007'],
    '007': ['006','008'],
    '008': ['007','009'],
    '009': ['008','010'],
    '010': ['009','011'],
    '011': ['010','012'],
    '012': ['011','013'],
    '013': ['012','014'],
    '014': ['013','015'],
    '015': ['014','016'],
    '016': ['015','017'],
    '017': ['016','018'],
    '018': ['017','019'],
    '019': ['018','020'],
    '020': ['019','021'],
    '021': ['020','022'],
    '022': ['021','023'],
    '023': ['022','024'],
    '024': ['023','025'],
    '025': ['024','026'],
    '026': ['025','027'],
    '027': ['026','028'],
    '028':['027']}

    constructor(public navCtrl: NavController,public navParams: NavParams,public af:AngularFire) {

    }

    findRoutes(start,end){
        console.log(start+" "+end)
        let queue=[];
        let temp_path=[start];

        queue.push(temp_path);
        //console.log(queue)

        while(queue.length!=0){

            let tmp_path=queue.shift();

            let last_node=tmp_path[tmp_path.length-1];

            if(last_node==end){
                console.log(tmp_path)
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
                    tmp_path.push(this.graph[last_node][i]);
                    new_path=tmp_path;
                    queue.push(new_path);
                }
            }
        }
    }

    getArrivals(route,callback){

        var array=[];

        for(let i=0;i<route.length;i++){
            array[i]=[];
            let list=this.af.database.list('/stations/'+route[i]+'/arrivals');

            list.subscribe(

                train => {
                    train.map(train =>
                        array[i].push({trainId:train.trainId,ar_time:train.dynamic_ar_time,dpt_time:train.dynamic_dpt_time})
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
                    if(current_train.trainId==arrivals[arrivals.length-1][j].trainId && (current_train.dpt_time<arrivals[arrivals.length-1][j].ar_time) ){
                        p=true;
                        console.log("uyftf")
                        path.push({trainId:current_train.trainId,start:route[0],end:route[route.length-1]});
                        break;
                    }
                }

                if(!p){

                    for(let m=1;m<arrivals.length;m++){
                        let k=false;
                        for(let n=0;n<arrivals[m].length;n++){
                            if(current_train.trainId==arrivals[m][n].trainId && (current_train.dpt_time<arrivals[m][n].ar_time)){

                                k=true;

                                if(path.length>0 && path[path.length-1].trainId==current_train.trainId){
                                    path[path.length-1].end=route[m];

                                }else{
                                    path.push({trainId:current_train.trainId,start:route[m-1],end:route[m]});
                                }
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
