import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';

@Component({
    selector: 'page-comment',
    templateUrl: 'comment.html'
})
export class CommentPage {

    comments:FirebaseListObservable<any>;
    content:string;

    constructor(public navCtrl: NavController, public navParams: NavParams,public af:AngularFire,public userProvider:UserProvider) {
        let topic=navParams.get('topic');
        let postId=navParams.get('postId');
        this.comments=af.database.list('forum/'+topic+'/'+postId+'/comments');
    }

    addComment(){

        let date=new Date();
        let posted_date=+date.getMonth()+"/"+date.getDate()+"/"+date.getFullYear();
        let posted_time=date.getHours()+":"+date.getMinutes();

        if(date.getMinutes()<10){
            posted_time=date.getHours()+":0"+date.getMinutes();
        }

        this.userProvider.getUser().then(user=> {
            user.subscribe(snapshot => {
                let userData=snapshot.val();
                this.comments.push({
                    user: {
                        uid:snapshot.key,
                        picture: userData.picture,
                        name: userData.first_name+" "+userData.last_name
                    },
                    date: posted_date,
                    time:posted_time,
                    content: this.content

                });
            });
        });
    }

}
