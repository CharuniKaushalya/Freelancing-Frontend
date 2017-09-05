import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { TreeModel } from 'ng2-tree';
import { Router } from '@angular/router';
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

    constructor(private _router: Router, private _service: MyService) {

        this.project = new Project();
        this.time_period = new TimePeriod();
        this.budget = new Budget();
        this.project.time_period = this.time_period;
        this.project.budget = this.budget;

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

    onChangeBudgetType(value: any) {
        this.project.budget.type = value;
    }

    save() {
        this.project.files = this.encodedFiles;
        this.project.skills = this.skills;
        let key = this.project.projectName;
        let projectJSON = JSON.stringify(this.project)
        // console.log(projectJSON);

        let data_hex = this._service.String2Hex(projectJSON)
        // console.log(data_hex);
        // console.log(this.Hex2String(data_hex));  

        this._service.publishToStream(this.projctsStream, key, data_hex).then(data => {
            console.log("saved");
            // console.log(data);

            this._router.navigate(['/pages/work/my_projects'])
        });
    }

    onItemAdded(item) {
        this.skills.push(item.value);
        console.log(this.skills);
    }
}

