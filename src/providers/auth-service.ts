import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

export class User {

    id:number;
    name: string;

    constructor(id:number,name: string) {
        this.id=id;
        this.name = name;

    }
}

@Injectable()
export class AuthService {

    currentUser: User;

    constructor(private http: Http) {

    }

    public login(credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            return Observable.create(observer => {

                let link = "http://trainmate16.azurewebsites.net/login";
                let data={email:credentials.email,password:credentials.password};

                let access=false;

                this.http.post(link, data)
                .subscribe(data => {

                    if (data.json()[0]!='invalid') {
                        access=true;
                        console.log(data.json()[0]);
                        this.currentUser = new User(data.json()[0].con_id,data.json()[0].first_name);
                        observer.next(access);
                        observer.complete();
                    }else{
                        observer.next(access);
                        observer.complete();
                    }

                },
                err => {
                    console.log('we got an error:', err);
                });



            });
        }
    }

    public register(credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {

            let link = "http://trainmate16.azurewebsites.net/register";
            let data={first_name:credentials.first_name,last_name:credentials.last_name,email:credentials.email,password:credentials.password};

            this.http.post(link, data)
            .subscribe(data => {
                console.log("success");

            },
            err => {
                console.log('we got an error:', err);
            });

            return Observable.create(observer => {
                observer.next(true);
                observer.complete();
            });
        }
    }

    public getUserInfo() : User {
        return this.currentUser;
    }

    public logout() {
        return Observable.create(observer => {
            this.currentUser = null;
            observer.next(true);
            observer.complete();
        });
    }

}
