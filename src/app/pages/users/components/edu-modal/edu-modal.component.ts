import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../../../theme/validators';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';
import { CountryPickerService } from 'angular2-countrypicker';
import { ICountry } from './country.interface';
import * as _ from 'lodash';

import { Education } from "../../../../theme/models/education";


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./edu-modal.component.scss')],
  templateUrl: './edu-modal.component.html',
  providers: [MyService]
})

export class EducationModal implements OnInit {

  //public countries: any[];

  modalHeader: string;
  modalContent: string = "";
  public form: FormGroup;
  public uniname: AbstractControl;
  public degree: AbstractControl;

  public submitted: boolean = false;

  @Input() education: Education;
  @Input() setValue: string = 'cca3';
  @Input() setName: string = 'name.common';
  @Input() modelName: string = "country";

  public countries: ICountry[];
  eduStream: string = "user-edu";


  items = [];
  myitems = ['mysql', 'Java', 'erlang', 'Python', 'JS'];
  years = null;
  titles = null;
  country: string;
  userkey: string;


  constructor(fb: FormBuilder, private _service: MyService, private activeModal: NgbActiveModal,
    private countryPickerService: CountryPickerService) {

    this.countryPickerService.getCountries().subscribe(countries => {
      this.countries = countries.sort((a: ICountry, b: ICountry) => {
        let na = this.getName(a);
        let nb = this.getName(b);
        if (na > nb) {
          return 1;
        }
        if (na < nb) {
          return -1;
        }
        return 0;
      });
    });

    this.years = [2013, 2014, 2015, 2016, 2017, 2018];
    this.titles = ["Associate", 'Certificate', "B.A.", "BArch", "BFA", "B.Sc.", "M.A.", "M.B.A.", "MFA", "M.Sc.", 
                    "J.D.","M.D.", "Ph.D", "LLB", "LLM"];
    this.education = new Education();

    this.form = fb.group({
      'uniname': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'degree': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.uniname = this.form.controls['uniname'];
    this.degree = this.form.controls['degree'];
  }

  ngOnInit() { }

  closeModal() {

    this.activeModal.close();
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    this.activeModal.close();
    // your code goes here
    console.log(this.education);
    console.log(this.userkey);
    let key = this.userkey;
    let eduJSON = JSON.stringify(this.education);
    console.log(eduJSON);

    let data_hex = this._service.String2Hex(eduJSON);
    console.log(data_hex);
    // console.log(this.Hex2String(data_hex));  

    this._service.publishToStream(this.eduStream, key, data_hex).then(data => {
      console.log(data);
    });
    location.reload();
  }

  public getValue(obj: ICountry) {
    return _.get(obj, this.setValue);
  }

  public getName(obj: ICountry) {
    return _.get(obj, this.setName);
  }

}
