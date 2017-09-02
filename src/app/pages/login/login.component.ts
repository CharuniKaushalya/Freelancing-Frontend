import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  
  error="";

  constructor(fb: FormBuilder, public authService: AuthService, private _router: Router) {
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
      this.authService.signIn(this.email.value,this.password.value).then((data) => {
        this._router.navigate(['']);
      }).catch(error=>{
        this.error = error.message;
        this.form.reset();
      })
    }
  }

  loginWithGoogle(){
    this.authService.signInWithGoogle().then((data) => {
        this._router.navigate(['']);
      }).catch(error=>{
        this.error = error.message;
      })
  }

  loginWithFacebook(){
    this.authService.signInWithFacebook().then((data) => {
        this._router.navigate(['']);
      }).catch(error=>{
        // this.error = error.message;
      })
  }

  loginWithTwitter(){
    this.authService.signInWithTwitter().then((data) => {
        this._router.navigate(['']);
      }).catch(error=>{
        // this.error = error.message;
      })
  }
}
