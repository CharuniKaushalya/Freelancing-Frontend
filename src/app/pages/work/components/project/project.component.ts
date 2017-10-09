import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidModelComponent } from '../bid-model/bid-model.component';
import { Project } from "../../../../theme/models/project";
import { ProjectUserType } from "../../../../theme/models/projectUserType";
import { ProjectStatus } from "../../../../theme/models/projectStatus";
import { Skill } from "../../../../theme/models/skill";

@Component({
    selector: 'my-projects',
    templateUrl: './project.html',
    styleUrls: ['./basicTables.scss'],
    providers: [MyService, DatePipe],
})

export class MyProjects implements OnInit {
    custom_search = false;
    projctsStream: string = "projects";
    bidStream: string = "bid";
    projects: Project[] = [];
    sprojects: Project[] = [];    
    projctUtypeStream: string = "project_user_type";
    projectStatusStream: string = "ProjectStatus";
    today: number = Date.now();

    skill_items = [];
    skillsStream = "skills";
    userSkillsStream = "user-skill";
    skills = [];
    query:string;

    constructor(private _router: Router, private _service: MyService, private modalService: NgbModal, private datePipe: DatePipe, ) {
        _service.listStreamItems(this.skillsStream).then(data => {
            data.forEach(element => {
                let skill: Skill = JSON.parse(this._service.Hex2String(element.data.toString()));
                this.skill_items.push(skill.name);
            });
        }).catch(error => {
            console.log(error.message);
        });

        _service.listStreamItems(this.projctsStream).then(data => {
            data.forEach(element => {
                let project: Project;
                _service.gettxoutdata(element.txid).then(largedata => {

                    project = JSON.parse(this._service.Hex2String(largedata.toString()));

                    _service.listStreamKeyItems(this.projectStatusStream, element.txid).then(pstatus => {

                        if (pstatus[pstatus.length - 1] != undefined) {
                            let projectStatus: ProjectStatus = JSON.parse(this._service.Hex2String(pstatus[pstatus.length - 1].data.toString()));
                            if (projectStatus.status == "Open") {
                                project.project_id = element.txid;
                                project.client = element.publishers[0];
                                this._service.listStreamKeyItems(this.projctUtypeStream, project.project_id).then(data => {
                                    console.log(data);
                                    data.forEach(element => {
                                        console.log(element);
                                        let putype: ProjectUserType = JSON.parse(this._service.Hex2String(element.data.toString()));
                                        console.log(putype.publish_utype);
                                        if (localStorage.getItem("userType") == putype.publish_utype) {
                                            if (putype.deadline &&
                                                this.datePipe.transform(putype.deadline, 'yyyy-MM-dd') >= this.datePipe.transform(this.today, 'yyyy-MM-dd')) {
                                                console.log("selected");
                                                this.projects.push(project);
                                            }
                                        }
                                        //edu.edu_id = element.txid;
                                        //this.educations.push(edu);
                                    });

                                }).catch(error => {
                                    console.log(error.message);
                                });
                            }
                        }
                    });

                }).catch(error => {
                    console.log(error.message);
                });
            });
        }).catch(error => {
            console.log(error.message);
        });

        this._service.listStreamKeyItems(this.userSkillsStream, localStorage.getItem("email")).then(data => {
            data.forEach(element => {
                let skill = JSON.parse(this._service.Hex2String(element.data.toString()));
                skill.forEach(element => {
                    this.skills.push(element);
                });
            });

        }).catch(error => {
            console.log(error.message);
        });
        this.sprojects = this.projects;
    }

    ngOnInit() {
    }

    bidModalShow(project_id): void {
        let bid_id = project_id + "/" + localStorage.getItem("email");
        this._service.listStreamKeyItems(this.bidStream, bid_id).then(bidded => {
            if (bidded[bidded.length - 1] != undefined) {
                console.log("bidded");
                $('#modal').modal('show');
            } else {
                console.log("not bidded");
                const activeModal = this.modalService.open(BidModelComponent, { size: 'sm' });
                activeModal.componentInstance.modalHeader = 'Place  a Bid';
                activeModal.componentInstance.key = project_id;
            }
        });

    }

    searchByName(){
        this.performSearch();
    }

    onItemAdded(item) {
        this.skills.push(item.value);
        this.performSearch();
    }

    onItemRemoved(item) {
        this.skills = this.skills.filter(i => i !== item);
        this.performSearch();
    }

    performSearch(){
        this.projects = this.sprojects;
        if(this.skills.length != 0){
            this.projects =  this.projects.filter(x => x.skills.some(r=> this.skills.includes(r)));
        }
        this.projects =  this.projects.filter(function(el){
            return el.projectName.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
    }

    goToProject(id: string) {
        let link = ['/pages/work/project_details', id];
        this._router.navigate(link);
    }
}
