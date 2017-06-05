import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
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

    constructor(public nav:NavController,
        public auth: AuthProvider,
        public userProvider: UserProvider,
        public util: UtilProvider,
        public navParams:NavParams,
            public navCtrl:NavController,
        public storage:Storage) {

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
                this.storage.set('uid', data.uid);
                this.userProvider.createUser(credentials, data.uid);
                this.navCtrl.push(LoginPage)
            }, (error) => {
                let alert = this.util.doAlert("Error",error.message,"Ok");
                alert.present();
            });
        };
    }
