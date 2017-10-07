import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { AuthService } from '../providers/auth.service';
import { MyService } from "../theme/services/backend/service";
import { privilegeService } from "./privileges.service";

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="http://akveo.com" translate>{{'general.akveo'}}</a> 2016</div>
        <ul class="al-share clearfix">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {
  
  private auth: any;
  userStream: string = "Users";
  previleges = null;


      
  constructor(public _pri: privilegeService, private _menuService: BaMenuService, public authService: AuthService, private _service: MyService, ) {  
    this.authService.getAuth().authState.subscribe(user => {
      this.auth = user;
      
      if (this.auth != null) {
        this._service.listStreamKeyItems(this.userStream, this.auth.email).then(data => {
          if(data[data.length-1]){
            let user = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
            let array = null;
            console.log(user);
            localStorage.setItem("userType", user.type);
            localStorage.setItem("address", user.address);
            this.addUserProfile(data[data.length-1].txid);
            this._pri.getData().then((data) => {
              this.previleges = data;

 
              array = this.getPrivileges(user.type);
              array.forEach(element => {
                console.log(element);
                let component = {
                path: element.type,
                data: {
                  menu: {
                    title: element.title,
                    icon: element.icon,
                    selected: false,
                    expanded: false,
                    order: 0
                  }
                },
                children:[]
              };
           
              element.data.forEach(item => {
                component.children.push({
                  path: item.type,
                  data: {
                    menu: {
                      title: item.title,
                    }
                  }
                });
              });
              PAGES_MENU[0].children.push(component);
            
              });
            
              this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
         });

        }

        });
      }

    });
      
  }

  ngOnInit() {
    //this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }

  getPrivileges(usertype: string){
    switch(usertype) {
      case 'Freelancer':
          return this.previleges.Freelancer;
      case 'Client':
          return this.previleges.Client;
      case 'QA':
          return this.previleges.Consultant;
      case 'Consultant':
          return this.previleges.Consultant;
      default:
          return 0;
    }
  }

  addUserProfile(userid: string){
      let component = {
        path: 'users',
        data: {
          menu: {
            title: 'Profile',
            icon: 'fa fa-user',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          {
            path: ['users/profile/'+userid],
            data: {
              menu: {
                title: 'My Profile',
              }
            }
          },
          {
            path: ['users/wallet/'+userid],
            data: {
              menu: {
                title: 'My Wallet',
              }
            }
          },
        ]
      };
      PAGES_MENU[0].children.push(component);

  }
}
