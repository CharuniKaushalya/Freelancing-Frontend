import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';
import { MyService } from "../../theme/services/backend/service";

import { User } from "../../theme/models/user";

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [MyService]
})
export class Login {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  userStream: string = "Users";

  error = "";

  constructor(private _service: MyService, fb: FormBuilder, public authService: AuthService, private _router: Router) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.signIn(this.email.value, this.password.value).then((data) => {
        this._service.listStreamKeyItems(this.userStream, this.email.value).then(data => {
          let u: User = JSON.parse(this._service.Hex2String(data[0].data.toString()));
          localStorage.setItem("userType", u.usertype);
        });
        this._router.navigate(['']);
      }).catch(error => {
        this.error = error.message;
        this.form.reset();
      })
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
}
