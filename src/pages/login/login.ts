import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Http} from '@angular/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  private login_form: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: Http) {
    this.login_form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    let data = JSON.stringify(String(this.login_form.value));

    let link = "http://trainmate16.azurewebsites.net:80";

    this.http.post(link, data)
      .subscribe(data => {
        console.log("success");
      }, error => {
        console.log("error");
      });
  }
}
