import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { TutorialPage } from '../tutorial/tutorial';
import { ContributionPage } from '../contribution/contribution';
import { PostPage } from '../post/post';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { validateEmail } from '../../validators/email';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';

@Component({
    templateUrl: 'signup.html'
})
export class SignupPage {

    signupForm:any;
    picture:any = "assets/images/default-user.png";
    pictureData:any;
    pictureSelected:boolean;

    constructor(public nav:NavController,
        public auth: AuthProvider,
        public userProvider: UserProvider,
        public util: UtilProvider,
        public navParams:NavParams,
        public navCtrl:NavController,
        public storage:Storage,
        public alertCtrl:AlertController) {

        }

        ngOnInit() {
            this.signupForm = new FormGroup({
                first_name:new FormControl("",Validators.required),
                last_name:new FormControl("",Validators.required),
                mobile:new FormControl("",Validators.required),
                email: new FormControl("",[Validators.required, validateEmail]),
                password: new FormControl("",Validators.required)
            });
        }

        createAccount() {
            let credentials = this.signupForm.value;
            this.auth.createAccount(credentials)
            .then((data) => {
                if(this.pictureSelected){
                    this.savePicture();
                }
                this.storage.set('uid', data.uid);
                this.userProvider.createUser(credentials, data.uid);
                this.navCtrl.push(LoginPage)
            }, (error) => {
                let alert = this.util.doAlert("Error",error.message,"Ok");
                alert.present();
            });
        }

        selectOption(){

            let alert = this.alertCtrl.create();
            //alert.setTitle('Select');

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
                    firebase.storage().ref('profiles/users/')
                    .child(uid+'.jpg')
                    .putString(this.picture, 'base64', {contentType: 'image/jpg'})
                    .then((savedPicture) => {
                        firebase.database().ref('users/${uid}/').child('image_url').set(savedPicture.downloadURL);
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
