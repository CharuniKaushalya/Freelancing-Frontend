import { Component } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { AuthService } from '../../../../providers/auth.service';

import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidModelComponent } from '../bid-model/bid-model.component';
import { Project } from "../../../../theme/models/project";

@Component({
    selector: 'my-work',
    templateUrl: './work.html',
    providers: [MyService],
})

export class MyWork {

    custom_search = false;
    bidStream: string = "bid";
    projectsStream: string = "projects";
    bid_projects: Project[] = [];

    constructor(private _router: Router, private _service: MyService, public authService: AuthService, ) {

        _service.listStreamKeys(this.bidStream).then(data => {
            data.forEach(element => {
                let bid_key = element.key;

                if (localStorage.getItem("user") == bid_key.split("/")[1]) {
                    let project_id = bid_key.split("/")[0];
                    _service.getstreamitem(this.projectsStream, project_id).then(projectdata => {
                        let project: Project;

                        _service.gettxoutdata(projectdata.txid).then(largedata => {
                            project = JSON.parse(this._service.Hex2String(largedata.toString()));
                            project.project_id = projectdata.txid;
                            project.client = projectdata.publishers[0];
                            this.bid_projects.push(project);
                        })


                    })
                }
            });

        });
    }

    ngOnInit() {
    }

    goToProject(id: string) {
        let link = ['/pages/work/project_details', id];
        this._router.navigate(link);
    }

}

