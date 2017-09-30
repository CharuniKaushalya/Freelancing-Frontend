import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { SkillModel } from "../../../../theme/models/skillmodel";
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';


@Component({
  selector: 'skill',
  templateUrl: './skill.html',
  providers: [MyService],
  styleUrls: ['./smartTables.scss'],
})

export class Skill {

  public submitted: boolean = false;
  public form: FormGroup;
  public name: AbstractControl;

  @Input() skill: SkillModel;
  skillsStream: string = "skills";

  query: string = '';

  settings = {
    actions: false,
    columns: {
      skill_id: {
        title: 'ID',
        type: 'number'
      },
      name: {
        title: 'Full Name',
        type: 'string'
      }
    },
    pager: {
      display: true,
      perPage: 5
    }
  };

  source: LocalDataSource = new LocalDataSource();

  custom_search = false;
  skills: SkillModel[] = [];


  constructor(fb: FormBuilder, private _service: MyService, private _router: Router) {
    this.skill = new SkillModel();
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.name = this.form.controls['name'];
    this.LoadSkills();

  }

  public onSkillSubmit(values: Object): void {
    this.submitted = true;
    console.log(values);
    console.log(this.skill);

    if (this.form.valid) {
      // your code goes here
      console.log(values);
      let key = this.skill.name;
      let skillJSON = JSON.stringify(this.skill);
      console.log(skillJSON);

      let data_hex = this._service.String2Hex(skillJSON);
      console.log(data_hex);
      // console.log(this.Hex2String(data_hex));  

      this._service.publishToStream(this.skillsStream, key, data_hex).then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error.message);
      });

      //this._router.navigate(['pages/admin/skill']);
      this.LoadSkills();
      location.reload();
    }
  }

  LoadSkills() {
    this._service.listStreamItems(this.skillsStream).then(data => {
      data.forEach(element => {
        let skill: SkillModel = JSON.parse(this._service.Hex2String(element.data.toString()));
        skill.skill_id = element.txid;
        this.skills.push(skill);
      });
      console.log(this.skills);
    }).catch(error => {
      console.log(error.message);
    });
    this.source.load(this.skills);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
