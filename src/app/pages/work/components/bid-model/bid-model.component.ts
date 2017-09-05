import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-bid-model',
  templateUrl: './bid-model.component.html',
  styleUrls: ['./bid-model.component.scss'],
  providers:[MyService]
})
export class BidModelComponent implements OnInit {

  constructor( private activeModal: NgbActiveModal, private _service: MyService) { }

  ngOnInit() {
  }

  closeModal(){
     this.activeModal.close();
  }

}
