import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ContributePage } from '../contribute/contribute';
import { LoginPage } from '../login/login';
import { ForumTopicsPage } from '../forum-topics/forum-topics';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = HomePage;
  tab2Root: any = LoginPage;
  tab3Root: any = ForumTopicsPage;

  constructor() {

  }
}
