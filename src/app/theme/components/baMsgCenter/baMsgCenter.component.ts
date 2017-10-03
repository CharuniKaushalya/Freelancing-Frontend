import {Component} from '@angular/core';

import { AuthService } from '../../../providers/auth.service';
import { MyService } from "../../services/backend/service";
import {BaMsgCenterService} from './baMsgCenter.service';

@Component({
  selector: 'ba-msg-center',
  providers: [BaMsgCenterService],
  styleUrls: ['./baMsgCenter.scss'],
  templateUrl: './baMsgCenter.html'
})
export class BaMsgCenter {

  public notifications:Array<Object>;
  public messages:Array<Object>;
  private auth: any;
  userStream: string = "Users";
  userType: string = "";

  constructor(private _baMsgCenterService:BaMsgCenterService, public authService: AuthService,private _service: MyService ) {
    this.notifications = this._baMsgCenterService.getNotifications();
    this.messages = this._baMsgCenterService.getMessages();
    this.authService.getAuth().authState.subscribe(user => {
      this.auth = user;
      
      if (this.auth != null) {
        this._service.listStreamKeyItems(this.userStream, this.auth.email).then(data => {
          if(data[data.length-1]){
            let user = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
            let array = null;
            localStorage.setItem("userType", user.type);
            this.userType = user.type;
            localStorage.setItem("userId", data[data.length-1].txid);
          }
        });
      }else{
        localStorage.setItem("userType", "");
        localStorage.setItem("userId", "");
      }
    });
    console.log(localStorage.getItem("userType"));
  }

}
