import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidModelComponent } from '../bid-model/bid-model.component';
import { Project } from "../../../../theme/models/project";
import { ProjectUserType } from "../../../../theme/models/projectUserType";

@Component({
    selector: 'my-projects',
    templateUrl: './project.html',
    styleUrls: ['./basicTables.scss'],
    providers: [MyService, DatePipe],
})

export class MyProjects implements OnInit {
    custom_search = false;
    projctsStream: string = "projects";
    bidStream:string = "bid";
    projects: Project[] = [];
    projctUtypeStream: string = "project_user_type";
    today: number = Date.now();

    constructor(private _router: Router, private _service: MyService, private modalService: NgbModal, private datePipe: DatePipe,) {
        _service.listStreamItems(this.projctsStream).then(data => {
            data.forEach(element => {
                let project: Project;
                _service.gettxoutdata(element.txid).then(largedata => {
                    project = JSON.parse(this._service.Hex2String(largedata.toString()));
                    project.project_id = element.txid;
                    project.client = element.publishers[0];
                    //this.projects.push(project);
                    this._service.listStreamKeyItems(this.projctUtypeStream, project.project_id).then(data => {
                        console.log(data);
                        data.forEach(element => {
                            console.log(element);
                            let putype: ProjectUserType = JSON.parse(this._service.Hex2String(element.data.toString()));
                            console.log( putype.publish_utype);
                            if(localStorage.getItem("user_type") == putype.publish_utype){
                                if(putype.deadline && 
                                    this.datePipe.transform(putype.deadline, 'yyyy-MM-dd') >= this.datePipe.transform(this.today, 'yyyy-MM-dd')){
                                    console.log("selected");
                                    this.projects.push(project);
                                }
                              
                            }
                            //edu.edu_id = element.txid;
                            //this.educations.push(edu);
                        });
    
                    });
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
