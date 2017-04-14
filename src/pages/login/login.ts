import { Component } from '@angular/core';
import { NavController,AlertController, LoadingController, Loading } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import {Http, Response} from '@angular/http';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { SignupPage } from '../signup/signup';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'

})

export class LoginPage {

    loading: Loading;
    registerCredentials = {email: '', password: ''};

    private login_form: FormGroup;

    constructor(public navCtrl: NavController,private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController,private formBuilder: FormBuilder, private http: Http) {

    }

    login(){
;
        this.showLoading()
        this.auth.login(this.registerCredentials).subscribe(allowed => {
            if (allowed) {
                setTimeout(() => {
                    this.loading.dismiss();
                    this.navCtrl.setRoot(TabsPage)
                });
            } else {
                this.showError("Access Denied");
            }
        },
        error => {
            this.showError(error);
        });
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    }

    showError(text) {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    }

    createAccount(){

        this.navCtrl.push(RegisterPage);

    }

}
