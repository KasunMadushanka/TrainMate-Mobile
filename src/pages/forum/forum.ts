import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatViewPage } from '../chat-view/chat-view';

/*
Generated class for the Cards page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
    selector: 'page-forum',
    templateUrl: 'forum.html'
})
export class ForumPage {
    cardItems: any[];

    constructor(public navCtrl: NavController) {
        this.cardItems = [
            {
                user: {
                    avatar: 'assets/images/profiles/2.jpg',
                    name: 'Marty McFly'
                },
                date: 'November 5, 1955',
                image: 'assets/images/forum/1.jpg',
                content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
            },
            {
                user: {
                    avatar: 'assets/images/profiles/3.jpg',
                    name: 'Sarah Connor'
                },
                date: 'May 12, 1984',
                image: 'assets/images/forum/2.jpg',
                content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
            },
            {
                user: {
                    avatar: 'assets/images/profiles/4.jpg',
                    name: 'Dr. Ian Malcolm'
                },
                date: 'June 28, 1990',
                image: 'assets/images/forum/3.jpg',
                content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
            },
            {
                user: {
                    avatar: 'assets/images/profiles/5.jpg',
                    name: 'Dr. Ian Malcolm'
                },
                date: 'June 28, 1990',
                image: 'assets/images/forum/4.jpg',
                content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
            },
            {
                user: {
                    avatar: 'assets/images/profiles/1.jpg',
                    name: 'Dr. Ian Malcolm'
                },
                date: 'June 28, 1990',
                image: 'assets/images/forum/5.jpg',
                content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
            }
        ];

    }

    gotoComment(){

        this.navCtrl.push(ChatViewPage);

    }
}
