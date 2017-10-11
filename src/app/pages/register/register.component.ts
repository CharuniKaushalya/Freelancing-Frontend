import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { AuthService } from '../../providers/auth.service';

import { MyService } from "../../theme/services/backend/service";
import { Router } from '@angular/router';

import { User } from "../../theme/models/user";

@Component({
  selector: 'register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  providers: [MyService]
})
export class Register {

  public form: FormGroup;
  public username: AbstractControl;
  public name: AbstractControl;
  public email: AbstractControl;
  public type: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;

  public submitted: boolean = false;

  public node_address: any;

  @Input() user: User;
  userStream: string = "Users";
  error: any;
  success: any;

  userTypes = ['Freelancer', 'Client', 'QA', 'Consultant'];

  constructor(private _router: Router, public authService: AuthService, fb: FormBuilder, private _service: MyService) {
    if (localStorage.getItem("email") == "" || localStorage.getItem("email") == undefined) {
      this.user = new User();

      this.form = fb.group({
        'username': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        'name': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
        'passwords': fb.group({
          'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
          'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
      });

      this.username = this.form.controls['username'];
      this.name = this.form.controls['name'];
      this.email = this.form.controls['email'];
      this.passwords = <FormGroup>this.form.controls['passwords'];
      this.password = this.passwords.controls['password'];
      this.repeatPassword = this.passwords.controls['repeatPassword'];
       
    } else {
      this._router.navigate(['pages/dashboard']);  
    }
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {

      this.authService.signUp(this.email.value, this.password.value).then((data) => {

        this.authService.getAuth().auth.currentUser.sendEmailVerification().then((data) => {

          this.error = "";
          this.success = "Please check your email " + this.user.email + " to verify your Account";

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

        }).catch(error => {
          this.error = error.message;
        });
      }).catch(error => {
        this.error = error.message;
      });
    }
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle().then((data) => {
      this.goToUserType(data.user.email, data.user.displayName);
    }).catch(error => {
      this.error = error.message;
    })
  }

  loginWithFacebook() {
    this.authService.signInWithFacebook().then((data) => {
      this.goToUserType(data.user.email, data.user.displayName);
    }).catch(error => {
      this.error = error.message;
    })
  }

  loginWithTwitter() {
    this.authService.signInWithTwitter().then((data) => {
      this.goToUserType(data.user.email, data.user.displayName);
    }).catch(error => {
      this.error = error.message;
    })
  }

  goToUserType(email: string, name: string) {
    let link = ['/login/user-type', email, name];
    this._router.navigate(link);
  }

  nodeAddressGrant(data_hex: string) {
    this._service.node().then(data => {
      this.node_address = data._body;

      let u: User = JSON.parse(this._service.Hex2String(data_hex.toString()));
      u.address = this.node_address;
      console.log(u);
      this._service.grantInRegister(u.address, this._service.String2Hex(JSON.stringify(u)), u.email).then(data => {
        console.log("successfully initiated blockchain");
        console.log(data);
      }).catch(error => {
        console.log(error.message);
      });
      this._service.keygenerate(this.node_address).then(data => {
        console.log("Key Generation " + data);
      }).catch(error => {
        console.log(error.message);
      });
    });
    setTimeout(() => {
      this.form.reset();
      this.authService.signOut();
    }, 250);
  }

  createAnotherUser(data_hex: string) {
    this._service.startchain().then(start => {
      console.log("chain started");

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

        this._service.keygenerate(address).then(data => {
          console.log("Key Generation " + data);
        }).catch(error => {
          console.log(error.message);
        });

        let u: User = JSON.parse(this._service.Hex2String(data_hex.toString()));
        u.address = address;

        this._service.publishToStream(this.userStream, u.email, this._service.String2Hex(JSON.stringify(u))).then(data => {
          localStorage.setItem("userType", this.user.type);
          console.log("saved");
          setTimeout(() => {
            this.form.reset();
            this.authService.signOut();
          }, 250);
        }).catch(error => {
          console.log(error.message);
        });

      });
    }).catch(error => {
      console.log(error.message);
    });
  }

}
