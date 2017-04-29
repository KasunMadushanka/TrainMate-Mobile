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
                date: 'April 20, 2017',
                image: 'assets/images/forum/1.jpg',
                content: 'Sri Lanka is a fabulous place - safe, friendly and remarkably hassle-free.  Taking the train is a great & inexpensive way to get around, the train journeys are real cultural experiences and the most scenic routes will be highlights of your visit.',
            },
            {
                user: {
                    avatar: 'assets/images/profiles/3.jpg',
                    name: 'Sarah Connor'
                },
                date: 'April 17, 2017',
                image: 'assets/images/forum/2.jpg',
                content: 'In particular the wonderful journey from Colombo to Kandy and up into Tea Country and the coastal train ride from Colombo to Dutch colonial Galle.'
            },
            {
                user: {
                    avatar: 'assets/images/profiles/1.jpg',
                    name: 'Dr. Ian Malcolm'
                },
                date: 'April 8, 2017',
                image: 'assets/images/forum/3.JPG',
                content: ' British visitors will find the stations, signal boxes and old red semaphore signals very familiar!  On this page you will find a beginners guide to taking the train around Sri Lanka.'
            },
            {
                user: {
                    avatar: 'assets/images/profiles/5.jpg',
                    name: 'Dr. Ian Malcolm'
                },
                date: 'April 5, 2017',
                image: 'assets/images/forum/4.jpg',
                content: 'Many important longer-distance trains have a designated 2nd class reserved car and sometimes a 3rd class reserved car, in addition to the many unreserved cars.  Some trains have a 1st class car and 1st class seats are always reserved. '
            },
            {
                user: {
                    avatar: 'assets/images/profiles/1.jpg',
                    name: 'Dr. Ian Malcolm'
                },
                date: 'April 3, 2017',
                image: 'assets/images/forum/5.jpg',
                content: 'If you buy a ticket for a reserved car you are guaranteed a seat, and a specific seat number will be printed on your ticket.  The reserved cars are jealously guarded by an attendant.'
            }
        ];

    }

    gotoComment(){

        this.navCtrl.push(ChatViewPage);

    }
}
