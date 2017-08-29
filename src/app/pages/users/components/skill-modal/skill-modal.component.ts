import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { MyService } from "../../../../theme/services/backend/service";

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
  myitems = ['mysql', 'Java', 'erlang','Python','JS', "AngularJS", "C"];
  skillsStream = "user-skill";


  constructor(private _service: MyService, private activeModal: NgbActiveModal) {
  }

  ngOnInit() {}

  closeModal() {
    this.activeModal.close();
    console.log(this.userkey);
    let key = this.userkey;
    let skillJSON = JSON.stringify(this.items);
    console.log(skillJSON);

    let data_hex = this.String2Hex(skillJSON);
    console.log(data_hex);
    // console.log(this.Hex2String(data_hex));  

    this._service.publishToStream(this.skillsStream, key, data_hex).then(data => {
      console.log(data);
    });
    location.reload();
  }

  onItemAdded(item) {
        this.items.push(item.value);
    }

  String2Hex(str: string) {
    let hex, i;

    let result = "";
    for (i = 0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += ("000" + hex).slice(-4);
    }
    return result;
  }

  Hex2String(hex_str: string) {
    let j;
    let hexes = hex_str.match(/.{1,4}/g) || [];
    let result_back = "";
    for (j = 0; j < hexes.length; j++) {
      result_back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return result_back;
  }
}
