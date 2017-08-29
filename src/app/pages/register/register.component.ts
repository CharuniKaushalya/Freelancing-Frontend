import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';

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

  @Input() user: User;
  projctsStream: string = "Users";

  userTypes = ['Freelancer', 'Client', 'QA', 'Consultant'];

  constructor(private _router:Router,fb: FormBuilder, private _service: MyService) {

    this.user = new User();

    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
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
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      console.log(values);
      this.user.usertype = 1;
      console.log(this.user);

      let key = this.user.username;
      let userJSON = JSON.stringify(this.user);
      console.log(userJSON);

      let data_hex = this.String2Hex(userJSON);
      console.log(data_hex);
      // console.log(this.Hex2String(data_hex));  

      this._service.publishToStream(this.projctsStream, key, data_hex).then(data => {
        console.log("saved");
        console.log(data);

        this._router.navigate([''])
      });
    }
  }

  String2Hex(str: string) {
    let hex, i;

    let result = "";
    for (i = 0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += ("000" + hex).slice(-4);
    }
    return result;
  }

  Hex2String(hex_str: string) {
    let j;
    let hexes = hex_str.match(/.{1,4}/g) || [];
    let result_back = "";
    for (j = 0; j < hexes.length; j++) {
      result_back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return result_back;
  }
}
