import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { TreeModel } from 'ng2-tree';
import { Router } from '@angular/router';

import { Project } from "../../../../theme/models/project";
import { TimePeriod } from "../../../../theme/models/timeperiod";
import { Budget } from "../../../../theme/models/budget";
// import { Skill } from "../../../../theme/models/skill";

@Component({
    selector: 'project_new',
    templateUrl: './project_new.html',
    providers: [MyService],
})

export class ProjectNew implements OnInit {

    @Input() project: Project;
    @Input() time_period: TimePeriod;
    @Input() budget: Budget;
    @Input() skills = [];

    @Output() close = new EventEmitter();
    addtionalFiles: FileList;
    encodedFiles: string[] = [];
    projctsStream: string = "projects";

    selectedItems = [];
    dropdownList = [];
    dropdownSettings = {};

    constructor(private _router: Router, private _service: MyService) {

        this.project = new Project();
        this.time_period = new TimePeriod();
        this.budget = new Budget();
        this.project.time_period = this.time_period;
        this.project.budget = this.budget;

    }

    ngOnInit() {
        this.dropdownList = [
            { "id": 1, "itemName": "Java" },
            { "id": 2, "itemName": "Maven" },
            { "id": 3, "itemName": "JavaSript" },
            { "id": 4, "itemName": "Angular2" },
            { "id": 5, "itemName": "Spring" },
            { "id": 6, "itemName": "JQuery" },
            { "id": 7, "itemName": "MySQL" },
            { "id": 8, "itemName": "MongoDB" },
            { "id": 9, "itemName": "ElasticSearch" },
            { "id": 10, "itemName": "Blockchain" },
            { "id": 11, "itemName": "C" },
            { "id": 12, "itemName": "C++" },
            { "id": 13, "itemName": "C#" },
            { "id": 14, "itemName": "Bootstrap" },
            { "id": 15, "itemName": "HTML5" },
            { "id": 16, "itemName": "CSS" },
            { "id": 17, "itemName": "PHP" },
            { "id": 18, "itemName": "Wordpress" },
            { "id": 19, "itemName": "Symfony2" },
            { "id": 20, "itemName": "XNA" }
        ];
        this.selectedItems  = [
            { "id": 3, "itemName": "C#" },
            { "id": 4, "itemName": "Angular2" },
            { "id": 5, "itemName": "Spring" },
            { "id": 14, "itemName": "Bootstrap" },
            { "id": 15, "itemName": "HTML5" }
        ];
        this.dropdownSettings = {
            singleSelection: false,
            text: "Select Skills",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class",
            searchPlaceholderText: "Enter a character to search skills"
        };
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
        this.project.skills = this.selectedItems ;
        let key = this.project.projectName;
        let projectJSON = JSON.stringify(this.project)
        // console.log(projectJSON);

        let data_hex = this.String2Hex(projectJSON)
        // console.log(data_hex);
        // console.log(this.Hex2String(data_hex));  

        this._service.publishToStream(this.projctsStream, key, data_hex).then(data => {
            console.log("saved");
            // console.log(data);

            this._router.navigate(['/pages/work/projects'])
        });
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

    onItemSelect(item: any) {
        console.log(item);
        console.log(this.skills);
    }
    OnItemDeSelect(item: any) {
        console.log(item);
        console.log(this.skills);
    }
    onSelectAll(items: any) {
        console.log(items);
    }
    onDeSelectAll(items: any) {
        console.log(items);
    }
}

