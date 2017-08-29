import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

import { ICountry } from './country.interface';
import { CountryPickerService } from 'angular2-countrypicker';

@Component({
  selector: 'myCountryPicker',
  template: `
  <select class="form-control form-control-sm"  [(ngModel)]="modelName" [ngModelOptions]="{standalone: true}">
                <option *ngFor="let c of countries; let i = index;" [ngValue]="getName(c)">{{getName(c)}}</option>
            </select>`
})
export class CountryPickerComponent {

  @Input() flag: boolean = false;
  @Input() setValue: string = 'cca3';
  @Input() setName: string = 'name.common';
  @Input() modelName: string = "country";

  public countries: ICountry[];
  public baseUrl: string = '';

  constructor(private countryPickerService: CountryPickerService) {
    console.log("model Name");
    console.log(this.modelName);

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
    this.baseUrl = countryPickerService.baseUrl + "data/";
  }

  public getValue(obj: ICountry) {
    return _.get(obj, this.setValue);
  }

  public getName(obj: ICountry) {
    return _.get(obj, this.setName);
  }

}
