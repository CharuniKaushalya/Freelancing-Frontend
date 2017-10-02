import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from "../../../theme/models/user";
import { MyService } from "../../../theme/services/backend/service";
import { AuthService } from '../../../providers/auth.service';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss']
})
export class UserTypeComponent implements OnInit {

  @Input() user: User;
  userStream: string = "Users";
  user_types = ['Client', 'Freelancer', 'QA', 'Consultant'];

  constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router,
    public authService: AuthService) {
    this.user = new User();
  }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      if (params['email'] !== undefined) {
        let email = params['email'];
        this._service.listStreamItems(this.userStream).then(data => {
          data.forEach(element => {
            if (element.key == email) {
              let u: User;
              this._service.gettxoutdata(element.txid).then(largedata => {
                u = JSON.parse(this._service.Hex2String(largedata.toString()));
                localStorage.setItem("userType", u.usertype);
              })
              this._router.navigate([''])
            }
          });
        }).catch(error => {
          console.log(error.message);
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
    this._service.checkchain().then(check => {
      console.log(check._body)
      if (check._body == "no") {
        this.nodeAddressGrant(data_hex);
      }
      else {
        this.createAnotherUser(data_hex);
      }
    }).catch(error => {
      console.log(error.message);
    });
  }

  nodeAddressGrant(data_hex: string) {
    this._service.node().then(data => {
      let u: User = JSON.parse(this._service.Hex2String(data_hex.toString()));
      u.address = data._body;
      console.log(u);
      this._service.grantInRegister(u.address, this._service.String2Hex(JSON.stringify(u)), u.email).then(data => {
        console.log("successfully initiated blockchain");
        console.log(data);
      }).catch(error => {
        console.log(error.message);
      });
    });
    setTimeout(() => {
      this._router.navigate(['pages/dashboard'])
    }, 250);
  }

  createAnotherUser(data_hex: string) {
    this._service.getNewAddress().then(address => {
      console.log("new address - " + address);

      this._service.grantPermissions(address).then(data => {
        console.log("Granted permission " + data);

        // this._service.sendAsset(address, 'USD', '0').then(data => {
        //   console.log(data);
        // }).catch(error => {
        //   console.log(error.message);
        // });

        // this._service.sendAsset(address, 'BTC', '0').then(data => {
        //   console.log(data);
        // }).catch(error => {
        //   console.log(error.message);
        // });
      }).catch(error => {
        console.log(error.message);
      });

      let u: User = JSON.parse(this._service.Hex2String(data_hex.toString()));
      u.address = address;

      this._service.publishToStream(this.userStream, u.email, this._service.String2Hex(JSON.stringify(u))).then(data => {
        localStorage.setItem("userType", this.user.usertype);
        console.log("saved");
        setTimeout(() => {
          this._router.navigate(['pages/dashboard'])
        }, 250);
      }).catch(error => {
        console.log(error.message);
      });

    });

  }
}
