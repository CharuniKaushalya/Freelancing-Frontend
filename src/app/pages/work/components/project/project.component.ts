import { Component, OnInit } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidModelComponent } from '../bid-model/bid-model.component';
import { Project } from "../../../../theme/models/project";

@Component({
    selector: 'my-projects',
    templateUrl: './project.html',
    styleUrls: ['./basicTables.scss'],
    providers: [MyService],
})

export class MyProjects implements OnInit {
    custom_search = false;
    projctsStream: string = "projects";
    bidStream:string = "bid";
    projects: Project[] = [];

    constructor(private _router: Router, private _service: MyService, private modalService: NgbModal) {
        _service.listStreamItems(this.projctsStream).then(data => {
            data.forEach(element => {
                let project: Project;
                _service.gettxoutdata(element.txid).then(largedata => {
                    project = JSON.parse(this._service.Hex2String(largedata.toString()));
                    project.project_id = element.txid;
                    project.client = element.publishers[0];
                    this.projects.push(project);
                })
            });
        });
    }

    ngOnInit() {
    }

    bidModalShow(project_id): void {
        const activeModal = this.modalService.open(BidModelComponent, { size: 'sm' });
        activeModal.componentInstance.modalHeader = 'Place  a Bid';
        activeModal.componentInstance.key = project_id;
    }

    goToProject(id: string) {
        let link = ['/pages/work/project_details', id];
        this._router.navigate(link);
    }
}
