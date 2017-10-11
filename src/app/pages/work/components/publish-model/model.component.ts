import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../providers/auth.service';

import { MyService } from "../../../../theme/services/backend/service";

import { ProjectStatus } from "../../../../theme/models/projectStatus";
import { ProjectUserType } from "../../../../theme/models/projectUserType";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publish-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  providers: [MyService, AuthService, DatePipe]
})
export class PublishModelComponent implements OnInit {

  key: string;
  modalHeader: string;

  public form: FormGroup;
  today: number = Date.now();

  public submitted: boolean = false;
  
  projectStatus: ProjectStatus; 
  projectStatusStream: string = "ProjectStatus";

  @Input() project_utype: ProjectUserType;
  bidStream: string = "project_user_type";
  user_types = [{name: "Need a Consultant", value: "Consultant"},{name: "Need a Freelancer", value: "Freelancer"}];

  public checkboxModel = [{
    name: 'Need a Consultant',
    checked: false,
    class: 'col-md-4',
    value: "Consultant",
    id: 0,
    disabled: false,
    deadline: this.datePipe.transform(this.today, 'yyyy-MM-dd').toString()
  }, {
    name: 'Need a Freelancer',
    checked: false,
    class: 'col-md-4',
    value: "Freelancer",
    disabled: false,
    deadline: this.datePipe.transform(this.today, 'yyyy-MM-dd').toString()
  }, {
    name: 'Need a QA',
    checked: false,
    class: 'col-md-4',
    value: "QA",
    disabled: false,
    deadline: this.datePipe.transform(this.today, 'yyyy-MM-dd').toString()
  }];

  isDisabled: boolean = false;

  public checkboxPropertiesMapping = {
    model: 'checked',
    value: 'name',
    label: 'name',
    baCheckboxClass: 'class'
  };


  constructor(private datePipe: DatePipe,private activeModal: NgbActiveModal, fb: FormBuilder, public authService: AuthService,
    private _service: MyService, private _router: Router) {

    this.projectStatus = new ProjectStatus();
    this.project_utype = new ProjectUserType();

    this.authService.getAuth().authState.subscribe(user => {
      this.project_utype.user_email = user.email;
      this.projectStatus.user_email = user.email;
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
        this.project_utype.deadline =element.deadline;
        let projectJSON = JSON.stringify(this.project_utype);
        
            //console.log(this.project_utype);
            let data_hex = this._service.String2Hex(projectJSON);
        
            this._service.publishToStream(this.bidStream, this.project_utype.putype_id, data_hex).then(data => {
              this.saveProjectStatus();
              //this._router.navigate(['/pages/work/my_work'])
            }).catch(error => {
                console.log(error.message);
            });
      }
      
    });
  }

  saveProjectStatus(){
    this.projectStatus.project_id = this.key;
    this.projectStatus.status = "Open";
    console.log(this.projectStatus);

    let statusJSON = JSON.stringify(this.projectStatus);
    let data_hex = this._service.String2Hex(statusJSON);

    this._service.publishToStream(this.projectStatusStream, this.projectStatus.project_id, data_hex).then(data => {
      this.activeModal.close();
    }).catch(error => {
        console.log(error.message);
    });
  }

}
