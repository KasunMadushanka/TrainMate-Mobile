import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { validateEmail } from '../../validators/email';
import { UserProvider } from '../../providers/user-provider/user-provider';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

    postForm:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public userProvider:UserProvider,public af:AngularFire) {

  }

  ngOnInit() {
      this.postForm = new FormGroup({
          subject: new FormControl("",Validators.required),
          content: new FormControl("",Validators.required)
      });
  }

  addNewPost(){
console.log(this.postForm.value)
      this.userProvider.getUser()
      .then(user=> {
          user.subscribe(snapshot => {
               let posts=this.af.database.list('/forum');
               posts.push({
                   user: {
                       avatar: "assets/images/profiles/1.jpg",
                       name: snapshot.val().name
                   },
                   date: "April 8, 2017",
                   image: "assets/images/forum/3.JPG",
                   subject:this.postForm.value.subject,
                   content: this.postForm.value.content

               });
          });
      });
  }

}
