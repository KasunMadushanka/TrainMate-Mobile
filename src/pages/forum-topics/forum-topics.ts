import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ForumPage } from '../forum/forum';
import { UsersPage } from '../users/users';

@Component({
    selector: 'page-forum-topics',
    templateUrl: 'forum-topics.html'
})
export class ForumTopicsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
       
    }

    gotoForum() {
        this.navCtrl.push(ForumPage);
    }

    gotoUsers(){
        this.navCtrl.push(UsersPage);
    }

}
