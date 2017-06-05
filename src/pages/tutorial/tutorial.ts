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
            description: "<b>This is a short guideline about how you can become a contributor.</b>",
            image: "assets/images/tutorial/logo.png",
        },
        {
            title: "What is TrainMate contributing?",
            description: "<b>TrainMate is a platform build for the train passengers to keep up-to date about the train arrivals and departures by tracking train locations. To achieve that you can give your contribution by enable your GPS tracking of your mobile device.</b>",
            image: "assets/images/tutorial/contribute.png",
        },
        {
            title: "How can I contribute?",
            description: "<b>You can get started by creating a free TrainMate account. Then you can start contribution at any station by selecting the train you're travelling and then enable GPS tracking.</b>",
            image: "assets/images/tutorial/gps.png",
        },
        {
            title: "What benefits I get?",
            description: "<b>For your valuable contribution you'll be given TrainMate contribution points. Based on your points we offer you free mobile data. At the end of the month you can be on the top of our leaderboard to be selected and rewarded as the best contributor as well.<b>",
            image: "assets/images/tutorial/awards.png",
        }
    ];

    gotoContribution(){
        this.navCtrl.push(ContributionPage);
    }
}
