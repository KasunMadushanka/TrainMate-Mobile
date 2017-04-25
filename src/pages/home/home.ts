import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {TrainsPage} from '../trains/trains';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    path:string[];
    trains:any[]=[];
    Numbers:Array<number>=[];
    arrivals:FirebaseListObservable<any>;

    constructor(public navCtrl: NavController,public af:AngularFire) {

        this.path = ["maradana", "fort", "kollupitiya", "dehiwala"];
        this.path.push("lnn");
    }

    search(){

     this.navCtrl.push(TrainsPage);

        }

    }
