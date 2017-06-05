import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
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
        public storage:Storage) {
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
                if(this.next==null){
                    if(this.status==1){
                    this.nav.push(ContributionPage);
                }else{
                    this.nav.push(TutorialPage);
                }
                }else if(this.next=="post"){
                    this.nav.push(PostPage);
                }
            }, (error) => {
                let alert = this.util.doAlert("Error",error.message,"Ok");
                alert.present();
            });
        };

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
                let alert = this.util.doAlert("Error",error.message,"Ok");
                alert.present();
            });
        };
    }
