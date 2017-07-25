import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { TutorialPage } from '../tutorial/tutorial';
import { SignupPage } from '../signup/signup';
import { ContributionPage } from '../contribution/contribution';
import { PostPage } from '../post/post';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { validateEmail } from '../../validators/email';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import firebase from 'firebase';

@Component({
    templateUrl: 'login.html'
})
export class LoginPage {

    loginForm:any;
    next:any;
    status:number;

    constructor(public nav:NavController,
        public auth: AuthProvider,
        public userProvider: UserProvider,
        public util: UtilProvider,
        public navParams:NavParams,
        public navCtrl:NavController,
        public storage:Storage,
        public toastCtrl: ToastController) {
            this.next=navParams.get('next');
            this.status=0;
        }

        ngOnInit() {
            this.loginForm = new FormGroup({
                email: new FormControl("",[Validators.required, validateEmail]),
                password: new FormControl("",Validators.required)
            });
        }

        signin() {
            this.auth.signin(this.loginForm.value)
            .then((data) => {
                this.storage.set('uid', data.uid);
                this.proceed(data.uid,status=>{
                    if(status==0){
                        this.nav.push(TutorialPage);
                    }else{
                        this.nav.push(ContributionPage);
                    }
                });

            }, (error) => {
                let toast = this.toastCtrl.create({
                    message: 'An error occured. Please try again!',
                    duration: 3000
                });
                toast.present();
            });
        };

        proceed(uid,callback){

            let userRef = firebase.database().ref('/users/'+uid);
            userRef.once('value', function(snapshot) {
                let user=snapshot.val();
                callback(user.status)
                userRef.update({
                    status:1
                })
            });

            this.userProvider.getDeviceToken().then((device_token)=>{
                userRef.update({
                    device_token:device_token
                })
            });
        }

        gotoSignUp(){
            this.navCtrl.push(SignupPage)
        }

        createAccount() {
            let credentials = this.loginForm.value;
            this.auth.createAccount(credentials)
            .then((data) => {
                this.storage.set('uid', data.uid);
                this.userProvider.createUser(credentials, data.uid);
            }, (error) => {
                let toast = this.toastCtrl.create({
                    message: 'An error occured. Please try again!',
                    duration: 3000
                });
                toast.present();
            });
        };
    }
