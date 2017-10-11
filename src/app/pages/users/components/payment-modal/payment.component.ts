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
import { EmailValidator, EqualPasswordsValidator } from '../../../../theme/validators';


@Component({
  selector: 'add-payment-modal',
  styleUrls: [('./payment.component.scss')],
  templateUrl: './payment.component.html',
  providers: [MyService]
})

export class PaymentModal implements OnInit {


  modalHeader: string;
  modalContent: string = "";
  balance: number = 0;
  public form: FormGroup;
  public useremail: string;
  public name: string;
  public address: string;
  

  public submitted: boolean = false;

  @Input() education: Education;
  userStream: string = "Users";
  user = new User();

  public email: AbstractControl;
  public qty: AbstractControl;



  constructor(fb: FormBuilder, private _service: MyService, private activeModal: NgbActiveModal) {
    this.useremail = localStorage.getItem("email");
    this._service.listStreamKeyItems(this.userStream, localStorage.getItem('email')).then(data => {
      this.user = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
      console.log(this.user);
      this.address = this.user.address;
      console.log(this.address);
    });

    this.form = fb.group({
      'qty': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])]
    });

    this.qty = this.form.controls['qty'];
    this.email = this.form.controls['email'];

  }

  ngOnInit() {

   }

  closeModal() {

    this.activeModal.close();
  }



  public onSubmit(values: Object): void {
    this.submitted = true;

    this.activeModal.close();
    if (this.form.valid && values['qty'] <= this.balance) {
    this._service.moneyTrasfer(values['email'], values['qty']).then(data => {
      console.log("Money transfer call");
      console.log(data);
      console.log(data.output);
      if(data.output == 'success'){
        this._service.sendAssetFrom(localStorage.getItem('address'),'1WSz5nyX9z2zHuSv4hveqisVnKxMjx23vTtBs5' , 'USD', values['qty']).then(data => {
          console.log(data);
      });
      }
      

    });
    }
  }


}
