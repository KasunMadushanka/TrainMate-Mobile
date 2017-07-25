import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';
import { Push} from '@ionic-native/push';
import { Camera} from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';

import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { ContributionPage } from '../pages/contribution/contribution';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { HistoryPage } from '../pages/history/history';
import { TrackingPage } from '../pages/tracking/tracking';
import { TabsPage } from '../pages/tabs/tabs';
import { TrainsPage } from '../pages/trains/trains';
import { TimeTablePage } from '../pages/time-table/time-table';
import { DetailsPage } from '../pages/details/details';
import { ForumPage } from '../pages/forum/forum';
import { ForumTopicsPage } from '../pages/forum-topics/forum-topics';
import { PostPage } from '../pages/post/post';
import { OptionsPage } from '../pages/options/options';
import { SettingsPage } from '../pages/settings/settings';
import { UsersPage } from '../pages/users/users';
import { ChatsPage } from '../pages/chats/chats';
import { AccountPage } from '../pages/account/account';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { MapPage } from '../pages/map/map';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import {PopoverPage} from '../pages/popover/popover';

import {NavbarComponent} from '../components/navbar/navbar';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { LocationTracker } from '../providers/location-tracker';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Badge } from '@ionic-native/badge';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { ChatsProvider } from '../providers/chats-provider/chats-provider';
import { UserProvider } from '../providers/user-provider/user-provider';
import { UtilProvider } from '../providers/utils';
import { NotificationProvider } from '../providers/notification-provider';

import { Ionic2RatingModule } from 'ionic2-rating';

export const firebaseConfig = {
    apiKey: "AIzaSyAcHi7drcrx1xTTwCxzTvMRg60cOn_ZvUY",
    authDomain: "trainmate07.firebaseapp.com",
    databaseURL: "https://trainmate07.firebaseio.com",
    projectId: "trainmate07",
    storageBucket: "trainmate07.appspot.com",
    messagingSenderId: "405567674998"
};

const myFirebaseAuthConfig = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
}

@NgModule({
    declarations: [
        MyApp,
        WelcomePage,
        LoginPage,
        SignupPage,
        HomePage,
        TabsPage,
        TutorialPage ,
        ContributionPage,
        TrackingPage,
        LeaderboardPage,
        HistoryPage,
        TrainsPage,
        TimeTablePage,
        DetailsPage,
        ForumPage,
        ForumTopicsPage,
        PostPage,
        UsersPage,
        ChatsPage,
        AccountPage,
        OptionsPage,
        SettingsPage,
        ChatViewPage,
        MapPage,
        NotificationsPage,
        ProfilePage,
        PopoverPage,
        NavbarComponent

    ],
    imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
         Ionic2RatingModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        WelcomePage,
        LoginPage,
        SignupPage,
        HomePage,
        TabsPage,
        TutorialPage,
        ContributionPage,
        TrackingPage,
        LeaderboardPage,
        HistoryPage,
        TrainsPage,
        TimeTablePage,
        DetailsPage,
        ForumPage,
        ForumTopicsPage,
        PostPage,
        UsersPage,
        ChatsPage,
        AccountPage,
        SettingsPage,
        ChatViewPage,
        SettingsPage,
        MapPage,
        NotificationsPage,
        ProfilePage,
        PopoverPage

    ],
    providers: [LocationTracker,AuthService,BackgroundMode,Badge,AuthProvider, ChatsProvider, UserProvider, UtilProvider,NotificationProvider, Storage,Push,Camera,CallNumber]
})
export class AppModule {}
