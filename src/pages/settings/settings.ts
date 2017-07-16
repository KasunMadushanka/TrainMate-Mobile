import { Component,ViewChild,ElementRef} from '@angular/core';
import { NavController, NavParams,PopoverController } from 'ionic-angular';
import {PopoverPage} from '../popover/popover';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

    @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
    @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl:PopoverController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  presentPopover(ev) {

      let popover = this.popoverCtrl.create(PopoverPage, {
          contentEle: this.content.nativeElement,
          textEle: this.text.nativeElement
      });

      popover.present({
          ev: ev
      });
  }

}
