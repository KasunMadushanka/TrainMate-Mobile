import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content,AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import firebase from 'firebase';

@Component({
    templateUrl: 'chat-view.html',
})
export class ChatViewPage {

    message: string;
    uid:string;
    interlocutor:string;
    name:string;
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
            this.name=params.data.name;

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

        sendPicture(picture){
            let chat = {
                from: this.uid,
                picture: picture,
                type: 'picture'
            };
            this.chats.push(chat);
        }

        setPicture(option){
            this.userProvider.takePicture(option).then(picture => {
                this.savePicture(picture);
            });
        }

        savePicture(picture){
            if (picture != null) {
                firebase.storage().ref('chats')
                .child(3+'.jpg')
                .putString(picture, 'base64', {contentType: 'image/jpg'})
                .then((savedPicture) => {
                    this.sendPicture(savedPicture.downloadURL);
                });
            }
        }

    }
