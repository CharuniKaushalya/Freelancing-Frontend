import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';
import { NgUploaderOptions } from 'ngx-uploader';

import { Portfolio } from "../../../../theme/models/portfolio";


@Component({
  selector: 'add-protfolio-modal',
  styleUrls: [('./proj-modal.component.scss')],
  templateUrl: './proj-modal.component.html',
  providers: [MyService]
})

export class PortfolioModal implements OnInit {


  modalHeader: string;
  modalContent: string = "";
  public form: FormGroup;
  public title: AbstractControl;

  public submitted: boolean = false;
  portfolioStream: string = "user-portfolio";

  @Input() portfolio: Portfolio;
  userkey: string;

  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile: any = {
    picture: 'assets/img/app/project/project-3.png'
  };
  public uploaderOptions: NgUploaderOptions = {
    // url: 'http://127.0.0.1:5000/upload'
    url: 'http://127.0.0.1:5000/upload',
  };


  constructor(fb: FormBuilder, private _service: MyService, private activeModal: NgbActiveModal) {

    this.portfolio = new Portfolio();

    this.form = fb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

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
    console.log(this.portfolio);
    console.log(this.userkey);
    console.log(this.profile);
    let key = this.userkey;
    let projJSON = JSON.stringify(this.portfolio);
    console.log(projJSON);

    let data_hex = this._service.String2Hex(projJSON);

    this._service.publishToStream(this.portfolioStream, key, data_hex).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error.message);
    });
  }


}
