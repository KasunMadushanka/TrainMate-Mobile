import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content,AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';

@Component({
    templateUrl: 'chat-view.html',
})
export class ChatViewPage {
    message: string;
    uid:string;
    interlocutor:string;
    chats:FirebaseListObservable<any>;
    @ViewChild(Content) content: Content;

    constructor(public nav:NavController,
        params:NavParams,
        public chatsProvider:ChatsProvider,
        public af:AngularFire,
        public userProvider:UserProvider,
        public alertCtrl:AlertController) {

            this.uid = params.data.uid;
            this.interlocutor = params.data.interlocutor;

            // Get Chat Reference
            chatsProvider.getChatRef(this.uid, this.interlocutor)
            .then((chatRef:any) => {
                this.chats = this.af.database.list(chatRef);
            });
        }

        ionViewDidEnter() {
            this.content.scrollToBottom();
        }

        sendMessage() {
            if(this.message) {
                let chat = {
                    from: this.uid,
                    message: this.message,
                    type: 'message'
                };
                this.chats.push(chat);
                this.message = "";
            }
        };

        selectOption(){

            let alert = this.alertCtrl.create();
            //alert.setTitle('Select');

            alert.addInput({
                type: 'radio',
                label: 'Use Camera',
                value: '1',
                checked: true
            });

            alert.addInput({
                type: 'radio',
                label: 'Select Image',
                value: '2',
                checked: false
            });

            alert.addButton('Cancel');
            alert.addButton({
                text: 'OK',
                handler: option => {
                    this.setPicture(option);
                }
            });
            alert.present();
        }

        setPicture(option){
            this.userProvider.takePicture(option);
        }

    }
