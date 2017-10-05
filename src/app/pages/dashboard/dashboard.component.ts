import { Component, OnInit } from '@angular/core';
import { MyService } from "../../theme/services/backend/service";
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidModelComponent } from '../work/components/bid-model/bid-model.component';
import { Project } from "../../theme/models/project";
import { ProjectUserType } from "../../theme/models/projectUserType";

@Component({
    selector: 'dashboard',
    styleUrls: ['./dashboard.scss', './basicTables.scss'],
    templateUrl: './dashboard.html',
    providers: [MyService],
})
export class Dashboard implements OnInit {

    custom_search = false;
    projctsStream: string = "projects";
    bidStream: string = "bid";
    projects: Project[] = [];
    projctUtypeStream: string = "project_user_type";

    constructor(private _router: Router, private _service: MyService, private modalService: NgbModal) {
        if (localStorage.getItem("email") == "" || localStorage.getItem("email") == undefined) {
            this._router.navigate(['login']);
        } else {
            console.log(localStorage.getItem("userType"));
            _service.listStreamItems(this.projctsStream).then(data => {
                data.forEach(element => {
                    let project: Project;
                    _service.gettxoutdata(element.txid).then(largedata => {
                        project = JSON.parse(this._service.Hex2String(largedata.toString()));
                        project.project_id = element.txid;
                        project.client = element.publishers[0];
                        this._service.listStreamKeyItems(this.projctUtypeStream, project.project_id).then(data => {
                            data.forEach(element => {
                                let putype: ProjectUserType = JSON.parse(this._service.Hex2String(element.data.toString()));
                                console.log(putype.publish_utype);
                                if (localStorage.getItem("userType") == putype.publish_utype) {
                                    this.projects.push(project);
                                }
                                //edu.edu_id = element.txid;
                                //this.educations.push(edu);
                            });

                        }).catch(error => {
                            console.log(error.message);
                        });

                    }).catch(error => {
                        console.log(error.message);
                    });
                });
            }).catch(error => {
                console.log(error.message);
            });
        }
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
