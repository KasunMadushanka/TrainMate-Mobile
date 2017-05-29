import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';
import { Push} from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { RegisterPage } from '../pages/register/register';
import { ContributionPage } from '../pages/contribution/contribution';
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
import { SettingsPage } from '../pages/settings/settings';
import { UsersPage } from '../pages/users/users';
import { ChatsPage } from '../pages/chats/chats';
import { AccountPage } from '../pages/account/account';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { MapPage } from '../pages/map/map';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { LocationTracker } from '../providers/location-tracker';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Badge } from '@ionic-native/badge';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { ChatsProvider } from '../providers/chats-provider/chats-provider';
import { UserProvider } from '../providers/user-provider/user-provider';
import { UtilProvider } from '../providers/utils';

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
        HomePage,
        RegisterPage,
        TabsPage,
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
        MapPage,
        NotificationsPage,
        ProfilePage

    ],
    imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        WelcomePage,
        LoginPage,
        HomePage,
        RegisterPage,
        TabsPage,
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
        ProfilePage

    ],
    providers: [LocationTracker,AuthService,BackgroundMode,Badge,AuthProvider, ChatsProvider, UserProvider, UtilProvider, Storage,Push]
})
export class AppModule {}
