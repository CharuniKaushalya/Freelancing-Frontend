import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'add-service-modal',
  styleUrls: [('./skill-modal.component.scss')],
  templateUrl: './skill-modal.component.html'
})

export class SkillModal implements OnInit {

  modalHeader: string;
  modalContent: string = ``;

  items = [];
  myitems = ['mysql', 'Java', 'erlang','Python','JS'];


  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {}

  closeModal() {
    this.activeModal.close();
  }

  onItemAdded(item) {
        this.items.push(item.value);
        console.log(this.items);
    }
}
