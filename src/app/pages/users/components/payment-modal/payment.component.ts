import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';

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



  constructor(fb: FormBuilder, private _service: MyService, private activeModal: NgbActiveModal) {
    this.useremail = localStorage.getItem("user");
  }

  ngOnInit() { }

  closeModal() {

    this.activeModal.close();
  }

  public onSubmit(values: Object): void {

  }


}
