import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { TreeModel } from 'ng2-tree';
import { Router } from '@angular/router';
import { AuthService } from '../../../../providers/auth.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Project } from "../../../../theme/models/project";
import { TimePeriod } from "../../../../theme/models/timeperiod";
import { Budget } from "../../../../theme/models/budget";
import { DownloadFile } from "../../../../theme/models/downloadFile";
import { Skill } from "../../../../theme/models/skill";

@Component({
    selector: 'project_new',
    templateUrl: './project_new.html',
    styleUrls: ['./project_new.scss'],
    providers: [MyService],
})

export class ProjectNew implements OnInit {

    @Input() project: Project;
    @Input() time_period: TimePeriod;
    @Input() budget: Budget;
    skills = [];

    @Output() close = new EventEmitter();
    addtionalFiles: FileList;
    encodedFiles: DownloadFile[] = [];
    projctsStream: string = "projects";

    skill_items = [];
    skillsStream = "skills";
    user_email: string;

    cur_types = ['USD', 'BTC'];

    constructor(private _router: Router, private _service: MyService, public authService: AuthService) {

        this.project = new Project();
        this.time_period = new TimePeriod();
        this.budget = new Budget();
        this.project.time_period = this.time_period;
        this.project.budget = this.budget;

        this.authService.getAuth().authState.subscribe(user => {
            console.log(user);
            if (user == null) {
              this.user_email = '';
            } else {
              this.user_email = user.email;
            }
        });

        _service.listStreamItems(this.skillsStream).then(data => {
            data.forEach(element => {
                console.log(element);
                console.log(element.key);
                let skill: Skill = JSON.parse(this._service.Hex2String(element.data.toString()));
                this.skill_items.push(skill.name);
            });
        });

    }

    ngOnInit() {
    }

    changeFiles(input: any) {
        this.addtionalFiles = input.files;

        Array.from(this.addtionalFiles).forEach(file => {
            let dFile = new DownloadFile();
            dFile.name = file.name;

            let reader: any,
                target: EventTarget;
            reader = new FileReader();

            reader.onloadend = (e) => {
                dFile.data = reader.result;
                this.encodedFiles.push(dFile);
            }
            reader.readAsDataURL(file);
        });
    }

    // onChangeBudgetType(value: any) {
    //     this.project.budget.type = value;
    // }

    save() {
        this.project.files = this.encodedFiles;
        this.project.skills = this.skills;
        this.project.user = this.user_email;
        let key = this.project.projectName;
        let projectJSON = JSON.stringify(this.project)

        let data_hex = this._service.String2Hex(projectJSON)

        this._service.publishToStream(this.projctsStream, key, data_hex).then(data => {
            console.log("saved");
            // console.log(data);

            this._router.navigate(['/pages/work/posted_projects'])
        });
    }

    onItemAdded(item) {
        this.skills.push(item.value);
        console.log(this.skills);
    }
}

