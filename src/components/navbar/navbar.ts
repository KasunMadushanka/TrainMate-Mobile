import { Component,Input } from '@angular/core';
import { NavController, NavParams,PopoverController } from 'ionic-angular';
import {OptionsPage} from '../../pages/options/options';
import {PopoverPage} from '../../pages/popover/popover';
import { SettingsPage } from '../settings/settings';
import { UserProvider } from '../../providers/user-provider/user-provider';

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.html'
})
export class NavbarComponent {

    text: string;
    @Input() title: string;
    @Input() toggle: boolean;
    @Input() back: boolean;

    badge:number=0;
    logged:boolean;

    constructor(public popoverCtrl:PopoverController,public userProvider:UserProvider) {
        this.userProvider.getUid().then(uid=>{
            if(uid!=null){
                this.logged=true;
                console.log(uid)
            }
        });
    }

    getUid(){

    }

    setBadge(){
        this.userProvider.getBadge().then(badge=>{

        });
    }

    showPopup(ev,type){

        let popover = this.popoverCtrl.create(PopoverPage, {
            type:type
        });

        popover.present({
            ev: ev
        });
    }

    openSettings(ev){

        let popover = this.popoverCtrl.create(OptionsPage);

        popover.present({
            ev: ev
        });
    }

}
