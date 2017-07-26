import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { validateEmail } from '../../validators/email';
import { UserProvider } from '../../providers/user-provider/user-provider';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { UtilProvider } from '../../providers/utils';
import firebase from 'firebase';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html'
})
export class PostPage {

    postForm:any;
    topic:string;
    postId:string;
    picture:any = "assets/images/add-image.png";
    pictureData:any;
    pictureSelected=false;

    constructor(public navCtrl: NavController, public navParams: NavParams,public userProvider:UserProvider,public af:AngularFire,public alertCtrl:AlertController,public util: UtilProvider,public toastCtrl:ToastController) {
        this.topic=navParams.get('topic');
    }

    ngOnInit() {
        this.postForm = new FormGroup({
            subject: new FormControl("",Validators.required),
            content: new FormControl("",Validators.required)
        });
    }

    addNewPost(){
       this.saveData(postId=>{
           this.savePicture(postId);
           let toast = this.toastCtrl.create({
               message: 'Post Added Successfully!',
               duration: 3000
           });
           toast.present();
       });
    }

    saveData(callback){

        let date=new Date();
        let posted_date=+date.getMonth()+"/"+date.getDate()+"/"+date.getFullYear();
        let posted_time=date.getHours()+":"+date.getMinutes();

        if(date.getMinutes()<10){
                posted_time=date.getHours()+":0"+date.getMinutes();
        }

        this.userProvider.getUser().then(user=> {
            user.subscribe(snapshot => {
                let posts=this.af.database.list('/forum/'+this.topic);
                let userData=snapshot.val();
                callback(posts.push({
                    user: {
                        uid:snapshot.key,
                        picture: userData.picture,
                        name: userData.first_name+" "+userData.last_name
                    },
                    date: posted_date,
                    time:posted_time,
                    image:"" ,
                    subject:this.postForm.value.subject,
                    content: this.postForm.value.content

                }).key);
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

    savePicture(postId){

        if (this.pictureSelected) {
            return this.userProvider.getUid().then(uid => {
                firebase.storage().ref('/forum/'+this.topic+'/')
                .child(postId+'.jpg')
                .putString(this.pictureData, 'base64', {contentType: 'image/jpg'})
                .then((savedPicture) => {
                    firebase.database().ref('forum/'+this.topic+'/'+postId).child('image').set(savedPicture.downloadURL);
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

}
