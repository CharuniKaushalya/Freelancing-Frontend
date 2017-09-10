import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { Project } from "../../../../theme/models/project";
import { Bid } from "../../../../theme/models/bid";

import { TreeModel } from 'ng2-tree';
import { Router, Params, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'project_details',
    templateUrl: './project_details.html',
    providers: [MyService],
})

export class ProjectDetails implements OnInit {

    project: Project;
    bid: Bid;
    projctsStream: string = "projects";
    bidStream: string = "bid";
    decodedFiles = [];

    constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router) {
        this._route.params.forEach((params: Params) => {
            if (params['project_id'] !== undefined) {
                let project_id = params['project_id'];
                this._service.gettxoutdata(project_id.toString()).then(data => {
                    this.project = JSON.parse(this._service.Hex2String(data.toString()));
                    this.project.project_id = project_id;
                });

                let bid_key = project_id + "/" + localStorage.getItem("user");

            } else {

            }
        });
    }

    ngOnInit() {
    }

    downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
