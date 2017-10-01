import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { MyService } from "../../../../theme/services/backend/service";
import { Skill } from "../../../../theme/models/skill";
import { Profile } from '../profile/profile.component';

@Component({
  selector: 'add-service-modal',
  styleUrls: [('./skill-modal.component.scss')],
  templateUrl: './skill-modal.component.html',
  providers: [MyService],
})

export class SkillModal implements OnInit {

  modalHeader: string;
  modalContent: string = "";
  userkey: string;
  items = [];
  myitems = [];
  skillsStream = "skills";
  userSkillsStream = "user-skill";



  constructor(private _service: MyService, private activeModal: NgbActiveModal) {
    _service.listStreamItems(this.skillsStream).then(data => {
      data.forEach(element => {
        console.log(element);
        console.log(element.key);
        let skill:Skill = JSON.parse(this._service.Hex2String(element.data.toString()));
        this.myitems.push(skill.name);

      });
      console.log(this.myitems);
    });
  }

  ngOnInit() {}

  closeModal() {
    this.activeModal.close();
    console.log(this.userkey);
    let key = this.userkey;
    let skillJSON = JSON.stringify(this.items);

    let data_hex = this._service.String2Hex(skillJSON);
    // console.log(this.Hex2String(data_hex));  

    this._service.publishToStream(this.userSkillsStream, key, data_hex).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error.message);
    });
    //location.reload();
  }

  onItemAdded(item) {
        this.items.push(item.value);
    }
}
