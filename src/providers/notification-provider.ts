import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFire } from 'angularfire2';
import {PopoverPage} from '../popover/popover';
import { UserProvider } from './user-provider/user-provider';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificationProvider {

  constructor(public af:AngularFire,public userProvider:UserProvider) {

  }


  showNotifications(ev,type){
      return this.userProvider.getUid().then(uid => {
          return this.af.database.list('/users/'+uid+'/notifications');
      });

  }

}
