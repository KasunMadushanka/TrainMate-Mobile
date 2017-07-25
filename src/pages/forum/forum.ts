import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ChatViewPage } from '../chat-view/chat-view'
import { LoginPage } from '../login/login';
import { PostPage } from '../post/post';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
    selector: 'page-forum',
    templateUrl: 'forum.html'
})
export class ForumPage {

    posts:  FirebaseListObservable<any>;
    topic:string;

    constructor(public navCtrl: NavController,public af:AngularFire,public navParams:NavParams) {
        this.topic=navParams.get('topic');
        this.posts=this.af.database.list('/forum/'+this.topic);
    }

    addNewPost(){

        this.navCtrl.push(PostPage,{topic:this.topic});
    }

    gotoComment(){

        this.navCtrl.push(ChatViewPage);

    }
}
