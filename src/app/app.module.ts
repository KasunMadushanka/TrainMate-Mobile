import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { RegisterPage } from '../pages/register/register';
import { ContributePage } from '../pages/contribute/contribute';
import { TabsPage } from '../pages/tabs/tabs';
import { TrainsPage } from '../pages/trains/trains';
import { DetailsPage } from '../pages/details/details';
import { SettingsPage } from '../pages/settings/settings';

import { LocationTracker } from '../providers/location-tracker';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Badge } from '@ionic-native/badge';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    HomePage,
    RegisterPage,
    TabsPage,
    ContributePage,
    TrainsPage,
    DetailsPage,
    SettingsPage

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    HomePage,
    RegisterPage,
    TabsPage,
    ContributePage,
    TrainsPage,
    DetailsPage,
    SettingsPage

  ],
  providers: [LocationTracker,AuthService,BackgroundMode,Badge]
})
export class AppModule {}
