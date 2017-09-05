import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';
import { CountryPickerService } from 'angular2-countrypicker';
import { ICountry } from './country.interface';
import * as _ from 'lodash';

import { Education } from "../../../../theme/models/education";
import { Employment } from "../../../../theme/models/employment";


@Component({
  selector: 'add-work-modal',
  styleUrls: [('./work-modal.component.scss')],
  templateUrl: './work-modal.component.html',
  providers: [MyService]
})

export class WorkModal implements OnInit {


  modalHeader: string;
  modalContent: string = "";
  public form: FormGroup;
  public company: AbstractControl;
  public city: AbstractControl;
  public title: AbstractControl;

  public submitted: boolean = false;
  @Input() setValue: string = 'cca3';
  @Input() setName: string = 'name.common';
  @Input() modelName: string = "country";

  public countries: ICountry[];
  workStream: string = "user-work";

  @Input() education: Education;
  @Input() employment: Employment;


  items = [];
  myitems = ['mysql', 'Java', 'erlang', 'Python', 'JS'];
  years = null;
  roles = null;
  months = null;
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


    this.years = this.getYears(0,20);
    this.months = ["January", 'February', "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.roles = ["Intern", 'Indivisual Contributer', "Lead", "Manager", "Executive", "Owner", "Director"];

    this.employment = new Employment();

    this.form = fb.group({
      'company': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'city': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'title': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.company = this.form.controls['company'];
    this.city = this.form.controls['city'];
    this.title = this.form.controls['title'];
  }

  ngOnInit() { }

  closeModal() {

    this.activeModal.close();
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    this.activeModal.close();
    // your code goes here
    console.log(this.employment);
    console.log(this.userkey);
    let key = this.userkey;
    let workJSON = JSON.stringify(this.employment);
    console.log(workJSON);

    let data_hex = this._service.String2Hex(workJSON);
    console.log(data_hex);
    // console.log(this.Hex2String(data_hex));  

    this._service.publishToStream(this.workStream, key, data_hex).then(data => {
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

    public getYears(offset, range){
        var currentYear = new Date().getFullYear();
        var years = [];
        for (var i = 0; i < range + 1; i++){
            years.push(currentYear - offset - i);
        }
        return years;
    }


}
