import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { ContributionPage } from '../contribution/contribution';

@Component({
    templateUrl: 'tutorial.html'
})
export class TutorialPage {

    constructor(public navCtrl:NavController){

    }

    slides = [
        {
            title: "Welcome to TrainMate Community!",
            description: "This is a short guideline about how you can become a contributor.",
            image: "assets/images/logo.png",
        },
        {
            title: "What is TrainMate contributing?",
            description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
            image: "assets/img/ica-slidebox-img-2.png",
        },
        {
            title: "How can I contribute?",
            description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
            image: "assets/img/ica-slidebox-img-3.png",
        },
        {
            title: "What benefits I get?",
            description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
            image: "assets/img/ica-slidebox-img-3.png",
        }
    ];

    gotoContribution(){
        this.navCtrl.push(ContributionPage);
    }
}
