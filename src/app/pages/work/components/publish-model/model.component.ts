import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../providers/auth.service';

import { MyService } from "../../../../theme/services/backend/service";

import { ProjectUserType } from "../../../../theme/models/projectUserType";

@Component({
  selector: 'app-publish-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  providers: [MyService, AuthService]
})
export class PublishModelComponent implements OnInit {

  key: string;
  modalHeader: string;

  public form: FormGroup;
  public bid_amount: AbstractControl;
  public deliver_time: AbstractControl;

  public submitted: boolean = false;

  @Input() project_utype: ProjectUserType;
  bidStream: string = "project_user_type";
  user_types = [{name: "Need a Consultant", value: "Consultant"},{name: "Need a Freelancer", value: "Freelancer"}];

  public checkboxModel = [{
    name: 'Need a Consultant',
    checked: false,
    class: 'col-md-4',
    value: "Consultant",
    id: 0,
    disabled: false
  }, {
    name: 'Need a Freelancer',
    checked: false,
    class: 'col-md-4',
    value: "Freelancer",
    disabled: false
  }, {
    name: 'Need a QA',
    checked: false,
    class: 'col-md-4',
    value: "QA",
    disabled: false
  }];

  isDisabled: boolean = false;

  public checkboxPropertiesMapping = {
    model: 'checked',
    value: 'name',
    label: 'name',
    baCheckboxClass: 'class'
  };

  constructor(private activeModal: NgbActiveModal, fb: FormBuilder, public authService: AuthService,
    private _service: MyService, private _router: Router) {
    this.project_utype = new ProjectUserType();


    this.authService.getAuth().authState.subscribe(user => {
      this.project_utype.user_email = user.email;
    });

  }

  ngOnInit() {
    this._service.listStreamKeyItems(this.bidStream, this.key).then(data => {
      data.forEach(element => {
        let project_utype: ProjectUserType
        project_utype = JSON.parse(this._service.Hex2String(element.data.toString()));
        console.log(project_utype.publish_utype);
        if(project_utype.publish_utype == "Freelancer"){
          this.checkboxModel[1].disabled = true;
        }else if(project_utype.publish_utype == "Consultant"){
          this.checkboxModel[0].disabled = true;
        }else if(project_utype.publish_utype == "QA"){
          this.checkboxModel[2].disabled = true;
        }
      });
    }).catch(error => {
        console.log(error.message);
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  public onSubmit() {
    this.submitted = true;

    this.project_utype.project_id = this.key;
    this.project_utype.putype_id = this.key;
    this.checkboxModel.forEach(element => {
      if(element.checked){
        this.project_utype.publish_utype = element.value;
        let projectJSON = JSON.stringify(this.project_utype);
        
            console.log(this.project_utype);
            let data_hex = this._service.String2Hex(projectJSON);
        
            this._service.publishToStream(this.bidStream, this.project_utype.putype_id, data_hex).then(data => {
              this.activeModal.close();
              //this._router.navigate(['/pages/work/my_work'])
            }).catch(error => {
                console.log(error.message);
            });
      }
      
    });
  }

}
