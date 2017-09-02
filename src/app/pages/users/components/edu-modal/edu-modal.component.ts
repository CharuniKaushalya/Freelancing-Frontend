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
import { CountryPickerComponent } from './country-picker.component';

import { Education } from "../../../../theme/models/education";


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./edu-modal.component.scss')],
  templateUrl: './edu-modal.component.html',
  providers: [MyService]
})

export class EducationModal implements OnInit {

  public countries: any[];

  modalHeader: string;
  modalContent: string = "";
  public form: FormGroup;
  public uniname: AbstractControl;
  public degree: AbstractControl;
  public myCountryPicker: CountryPickerComponent;

  public submitted: boolean = false;

  @Input() education: Education;
  eduStream: string = "user-edu";


  items = [];
  myitems = ['mysql', 'Java', 'erlang', 'Python', 'JS'];
  years = null;
  titles = null;
  country: string;
  userkey: string;


  constructor(fb: FormBuilder, private _service: MyService, private activeModal: NgbActiveModal,
    private countryPickerService: CountryPickerService) {

    this.countryPickerService.getCountries().subscribe(countries => this.countries = countries);

    this.years = [2013, 2014, 2015, 2016, 2017, 2018];
    this.titles = ["Associate", 'Certificate', "B.A.", "BArch", "BFA", "B.Sc.", "M.A.", "M.B.A.", "MFA", "M.Sc.", "J.D.",
      "M.D.", "Ph.D", "LLB", "LLM"];
    console.log(this.years);
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
    console.log("submitted");
    // your code goes here
    this.education.country = "Sri Lanka";
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

}
