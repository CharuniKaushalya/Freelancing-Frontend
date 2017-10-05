import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';
import { User } from "../../../../theme/models/user";

import { Education } from "../../../../theme/models/education";


@Component({
  selector: 'add-payment-modal',
  styleUrls: [('./payment.component.scss')],
  templateUrl: './payment.component.html',
  providers: [MyService]
})

export class PaymentModal implements OnInit {


  modalHeader: string;
  modalContent: string = "";
  public form: FormGroup;
  public useremail: string;
  public name: string;
  public address: string;

  public submitted: boolean = false;

  @Input() education: Education;
  userStream: string = "Users";
  user = new User();



  constructor(fb: FormBuilder, private _service: MyService, private activeModal: NgbActiveModal) {
    this.useremail = localStorage.getItem("email");
    this._service.listStreamKeyItems(this.userStream, localStorage.getItem('email')).then(data => {
      this.user = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
      console.log(this.user);
      this.address = this.user.address;
      console.log(this.address);
    });
  }

  ngOnInit() {

   }

  closeModal() {

    this.activeModal.close();
  }

  public onSubmit(values: Object): void {

  }


}
