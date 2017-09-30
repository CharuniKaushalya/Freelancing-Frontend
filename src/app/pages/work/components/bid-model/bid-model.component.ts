import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../providers/auth.service';

import { MyService } from "../../../../theme/services/backend/service";

import { Bid } from "../../../../theme/models/bid";

@Component({
  selector: 'app-bid-model',
  templateUrl: './bid-model.component.html',
  styleUrls: ['./bid-model.component.scss'],
  providers: [MyService, AuthService]
})
export class BidModelComponent implements OnInit {

  key: string;

  public form: FormGroup;
  public bid_amount: AbstractControl;
  public deliver_time: AbstractControl;

  public submitted: boolean = false;

  @Input() bid: Bid;
  bidStream: string = "bid";

  constructor(private activeModal: NgbActiveModal, fb: FormBuilder, public authService: AuthService,
    private _service: MyService, private _router: Router) {
    this.bid = new Bid();

    this.form = fb.group({
      'bid_amount': ['', Validators.compose([Validators.required])],
      'deliver_time': ['', Validators.compose([Validators.required])]
    });

    this.bid_amount = this.form.controls['bid_amount'];
    this.deliver_time = this.form.controls['deliver_time'];

    this.authService.getAuth().authState.subscribe(user => {
      this.bid.user_email = user.email;
    });

  }

  ngOnInit() {

  }

  closeModal() {
    this.activeModal.close();
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {

      this.bid.project_id = this.key;
      this.bid.bid_id = this.key + "/" + this.bid.user_email;

      let bidJSON = JSON.stringify(this.bid);

      let data_hex = this._service.String2Hex(bidJSON);

      this._service.publishToStream(this.bidStream, this.bid.bid_id, data_hex).then(data => {
        this.activeModal.close();
        this._router.navigate(['/pages/work/my_work'])
      }).catch(error => {
        console.log(error.message);
      });

    }

  }

}
