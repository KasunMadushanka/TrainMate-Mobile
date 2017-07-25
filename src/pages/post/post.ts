import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { validateEmail } from '../../validators/email';
import { UserProvider } from '../../providers/user-provider/user-provider';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UtilProvider } from '../../providers/utils';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html'
})
export class PostPage {

    postForm:any;
    topic:string;
    picture:any = "assets/images/add-image.png";
    pictureData:any;
    pictureSelected:boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams,public userProvider:UserProvider,public af:AngularFire,public alertCtrl:AlertController,public util: UtilProvider) {
        this.topic=navParams.get('topic');
    }

    ngOnInit() {
        this.postForm = new FormGroup({
            subject: new FormControl("",Validators.required),
            content: new FormControl("",Validators.required)
        });
    }

    addNewPost(){

        this.userProvider.getUser()
        .then(user=> {
            user.subscribe(snapshot => {
                let posts=this.af.database.list('/forum'+this.topic);
                posts.push({
                    user: {
                        avatar: "assets/images/profiles/1.jpg",
                        name: snapshot.val().name
                    },
                    date: Date(),
                    image:"" ,
                    subject:this.postForm.subject,
                    content: this.postForm.content

                });
            });
        });
    }

    selectOptions(){
        let alert = this.alertCtrl.create();
        alert.setTitle('Select');

        alert.addInput({
            type: 'radio',
            label: 'Use Camera',
            value: '1',
            checked: true
        });

        alert.addInput({
            type: 'radio',
            label: 'Select Image',
            value: '2',
            checked: false
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: option => {
                this.setPicture(option);
            }
        });
        alert.present();
    }

    savePicture(){
        if (this.picture != null) {
            return this.userProvider.getUid().then(uid => {
                firebase.storage().ref('forum/'+this.topic)
                .child(1+'.jpg')
                .putString(this.picture, 'base64', {contentType: 'image/jpg'})
                .then((savedPicture) => {
                    firebase.database().ref('forum/'+this.topic+'/1').child('image').set(savedPicture.downloadURL);
                });
            });
        }
    }

    setPicture(option){
        this.userProvider.takePicture(option).then(data => {
            this.pictureData=data;
            this.picture='data:image/jpeg;base64,'+data;
            this.pictureSelected=true;

        });
    }
x
}
