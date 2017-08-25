import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { TreeModel } from 'ng2-tree';
import { Router } from '@angular/router';

import { Project } from "../../../../theme/models/project";
import { TimePeriod } from "../../../../theme/models/timeperiod";
import { Budget } from "../../../../theme/models/budget";

@Component({
    selector: 'project_new',
    templateUrl: './project_new.html',
    providers: [MyService],
})

export class ProjectNew implements OnInit{

    @Input() project: Project;
    @Input() time_period: TimePeriod;
    @Input() budget: Budget;

    @Output() close = new EventEmitter();
    addtionalFiles: FileList;
    encodedFiles: string[] = [];
    projctsStream: string = "projects";

    constructor(private _router: Router, private _service: MyService) {

        this.project = new Project();
        this.time_period = new TimePeriod();
        this.budget = new Budget();
        this.project.time_period = this.time_period;
        this.project.budget = this.budget;

    }

    ngOnInit() {
    }

    changeFiles(input: any) {
        this.addtionalFiles = input.files;

        Array.from(this.addtionalFiles).forEach(file => {
            let reader: any,
                target: EventTarget;
            reader = new FileReader();

            reader.onloadend = (e) => {
                this.encodedFiles.push(reader.result);
            }
            reader.readAsDataURL(file);
        });
    }

    onChangeBudgetType(value: any) {
        this.project.budget.type = value;
    }

    save() {
        this.project.files = this.encodedFiles;
        let key = this.project.projectName;
        let projectJSON = JSON.stringify(this.project)
        // console.log(projectJSON);

        let data_hex = this.String2Hex(projectJSON) 
        // console.log(data_hex);
        // console.log(this.Hex2String(data_hex));  

        this._service.publishToStream(this.projctsStream,key,data_hex).then(data => {
            console.log("saved");
            console.log(data);
            
            // this._router.navigate(['projects'])
        });
    }

    String2Hex(str:string) {
        let hex, i;

        let result = "";
        for (i = 0; i < str.length; i++) {
            hex = str.charCodeAt(i).toString(16);
            result += ("000"+hex).slice(-4);
        }
        return result;
    }

    Hex2String(hex_str:string) {
        let j;
        let hexes = hex_str.match(/.{1,4}/g) || [];
        let result_back = "";
        for (j = 0; j < hexes.length; j++) {
            result_back += String.fromCharCode(parseInt(hexes[j], 16));
        }

        return result_back;
    }

}
