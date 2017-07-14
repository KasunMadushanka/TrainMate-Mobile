import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire,FirebaseListObservable } from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatViewPage } from '../chat-view/chat-view';

@Component({
    templateUrl: 'users.html'
})
export class UsersPage {

    admins:FirebaseListObservable<any[]>;
    users:FirebaseListObservable<any[]>;
    uid:string;
    contacts:string="admins";

    constructor(public nav: NavController, public userProvider: UserProvider,public af:AngularFire) {

    }

    ngOnInit() {
        this.userProvider.getUid()
        .then(uid => {
            this.uid = uid;
            this.users = this.userProvider.getAllUsers();
            this.admins=this.af.database.list('admins');
        });
    };

    openChat(key) {
        let param = {uid: this.uid, interlocutor: key};
        this.nav.push(ChatViewPage,param);
    }
}
