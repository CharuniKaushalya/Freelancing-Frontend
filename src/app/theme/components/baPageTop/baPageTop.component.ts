import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalState } from '../../../global.state';

import { AuthService } from '../../../providers/auth.service';

import { MyService } from "../../services/backend/service";

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
  providers: [MyService]
})
export class BaPageTop {

  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;

  private isLoggedIn: Boolean;
  user_displayName: string;
  user_email: string;
  private auth: any;
  userStream: string = "Users";
  userType: string = "";
  color: string = "";

  constructor(private _state: GlobalState, private _service: MyService, public authService: AuthService,private _router: Router) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

    this.authService.getAuth().authState.subscribe(user => {
      console.log(user);
      this.auth = user;
      if (this.auth == null) {
        console.log("Logged out");
        this.isLoggedIn = false;
        this.user_displayName = '';
        this.user_email = '';
        this._router.navigate(['login']);
      } else {
        this.isLoggedIn = true;
        this.user_displayName = this.auth.displayName;
        this.user_email = this.auth.email;
        this._service.listStreamKeyItems(this.userStream, this.auth.email).then(data => {
          if (data[data.length - 1]) {
              let user = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
              let array = null;
              localStorage.setItem("userType", user.type);
              this.userType = user.type;
          }
        });

        console.log("Logged in");
        console.log(this.user_email);


      }
    });



  }

  logout() {

      this.authService.signOut();

    this._router.navigate(['login']);
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
}
