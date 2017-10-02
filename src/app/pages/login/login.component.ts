import { Component, Input, OnInit } from '@angular/core';
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
export class Login implements OnInit {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;

  @Input() ResetPassemail: string;

  public submitted: boolean = false;
  isResetPass = false;
  resetPassDisabled = false;

  userStream: string = "Users";

  error = "";
  success = "";

  constructor(private _service: MyService, fb: FormBuilder, public authService: AuthService, private _router: Router) {
    if (localStorage.getItem("user") == "" || localStorage.getItem("user") == undefined) {
      this.isResetPass = false;
      this.form = fb.group({
        'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      });

      this.email = this.form.controls['email'];
      this.password = this.form.controls['password'];  
    } else {
      this._router.navigate(['pages/dashboard']); 
    }
  }

  ngOnInit() {

  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.signIn(this.email.value, this.password.value).then((data) => {
        if (data.emailVerified) { 
          this._service.listStreamKeyItems(this.userStream, this.email.value).then(data => {
            let u: User = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
            localStorage.setItem("userType", u.type);
          }).catch(error => {
            console.log(error.message);
          });
          this._router.navigate(['pages/dashboard']);   
        } else {
          this.error = "Please verify your email address";
          setTimeout(() => {
            this.form.reset();
            this.authService.signOut();
          }, 250);
        }
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

  forgetPassword() {
    this.resetPassDisabled = true;
    this.authService.getAuth().auth.sendPasswordResetEmail(this.ResetPassemail).then((data) => {
      this.error = "";
      this.success = "Password Reset Email Sent Successfully to " + this.ResetPassemail;
      this.resetPassDisabled = true;
    }).catch(error => {
      this.resetPassDisabled = false;
      this.ResetPassemail = "";
      this.error = error.message;
    })
  }

  goToUserType(email: string, name: string) {
    let link = ['/login/user-type', email, name];
    this._router.navigate(link);
  }
}
