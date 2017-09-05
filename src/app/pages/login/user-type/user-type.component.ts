import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from "../../../theme/models/user";
import { MyService } from "../../../theme/services/backend/service";

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss']
})
export class UserTypeComponent implements OnInit {

  @Input() user: User;
  usersStream: string = "Users";
  user_types = ['Client', 'Freelancer', 'QA', 'Consultant'];
  userStream: string = "Users";

  constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router) {
    this.user = new User();
  }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      if (params['email'] !== undefined) {
        let email = params['email'];
        this._service.listStreamItems(this.usersStream).then(data => {
          data.forEach(element => {
            if (element.key == email) {
              this._router.navigate([''])
            }
          });
        });

        this.user.email = email;
      }

      if (params['name'] !== undefined) {
        let name = params['name'];
        this.user.name = name;
        this.user.username = name.split(" ")[0];
      }
    });
  }

  saveUserToBlockchain() {
    let key = this.user.email;
    let userJSON = JSON.stringify(this.user);

    let data_hex = this._service.String2Hex(userJSON);

    this._service.publishToStream(this.userStream, key, data_hex).then(data => {
      console.log("saved");
      console.log(data);

      this._router.navigate([''])
    });

  }

}
