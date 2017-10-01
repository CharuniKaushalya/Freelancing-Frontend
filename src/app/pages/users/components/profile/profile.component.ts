import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MyService } from "../../../../theme/services/backend/service";
import { User } from "../../../../theme/models/user";
import { Router, Params, ActivatedRoute } from '@angular/router';
declare var require: any;
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SkillModal } from '../skill-modal/skill-modal.component';
import { EducationModal } from '../edu-modal/edu-modal.component';
import { PortfolioModal } from '../proj-modal/proj-modal.component';
import { WorkModal } from '../work-modal/work-modal.component';
import { SkillModel } from "../../../../theme/models/skillmodel";
import { Education } from "../../../../theme/models/education";
import { Employment } from "../../../../theme/models/employment";
import { Portfolio } from "../../../../theme/models/portfolio";

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    providers: [MyService],
    styleUrls: ['./profile.scss']
})

export class Profile implements OnInit {

    ChainInfo = null;
    PeerInfo = null;
    user: User;
    userStream: string = "Users";
    userkey = "";
    skillsStream = "user-skill";
    eduStream = "user-edu";
    workStream = "user-work";
    projStream = "user-portfolio";
    skills = [];
    educations: Education[] = [];
    employments: Employment[] = [];
    portfolios: Portfolio[] = [];
    useremail: string;


    constructor(private _service: MyService,
        private _route: ActivatedRoute, private _router: Router, private modalService: NgbModal) {

        _service.getinfo().then(data => {
            console.log(data);
            this.ChainInfo = data;
        }).catch(error => {
            console.log(error.message);
        });

        _service.getpeerinfo().then(data => {
            console.log(data);
            this.PeerInfo = data;
        }).catch(error => {
            console.log(error.message);
        });

        this.useremail = localStorage.getItem("user");
    }


    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            if (params['user_id'] !== undefined) {
                let user_id = params['user_id'];
                this._service.getstreamitem(this.userStream, user_id.toString()).then(data => {
                    if (data.error == undefined || !data.error) {
                        this._service.listStreamKeyItems(this.skillsStream, data.key).then(data => {
                            data.forEach(element => {
                                let skill = JSON.parse(this._service.Hex2String(element.data.toString()));
                                skill.forEach(element => {
                                    this.skills.push(element);
                                });
                            });

                        }).catch(error => {
                            console.log(error.message);
                        });
                        this._service.listStreamKeyItems(this.eduStream, data.key).then(data => {
                            data.forEach(element => {
                                let edu: Education = JSON.parse(this._service.Hex2String(element.data.toString()));
                                edu.edu_id = element.txid;
                                this.educations.push(edu);
                            });

                        }).catch(error => {
                            console.log(error.message);
                        });
                        this._service.listStreamKeyItems(this.projStream, data.key).then(data => {
                            data.forEach(element => {
                                let protfolio: Portfolio = JSON.parse(this._service.Hex2String(element.data.toString()));
                                protfolio.item_id = element.txid;
                                this.portfolios.push(protfolio);
                            });

                        }).catch(error => {
                            console.log(error.message);
                        });
                        this._service.listStreamKeyItems(this.workStream, data.key).then(data => {
                            data.forEach(element => {
                                let work: Employment = JSON.parse(this._service.Hex2String(element.data.toString()));
                                work.emp_id = element.txid;
                                this.employments.push(work);
                            });

                        }).catch(error => {
                            console.log(error.message);
                        });
                        console.log(this.portfolios);
                        this.userkey = data.key;
                        console.log(this.userkey);
                        this.user = JSON.parse(this._service.Hex2String(data.data.toString()));

                    }
                    else {
                        this.goToDash();
                    }

                }).catch(error => {
                    console.log(error.message);
                });
            } else {
            }
        });
    }

    valuechange() {

    }

    smModalShow(): void {
        const activeModal = this.modalService.open(SkillModal, { size: 'sm' });
        activeModal.componentInstance.modalHeader = 'Add Skill';
        activeModal.componentInstance.userkey = this.userkey;
        activeModal.result
        .then((d) => {
            this.loadSkills(this.userkey);
        });
    }

    eduModalShow(): void {
        const activeModal = this.modalService.open(EducationModal, { size: 'lg' });
        activeModal.componentInstance.modalHeader = 'Add Education';
        activeModal.componentInstance.userkey = this.userkey;
        activeModal.result
        .then((d) => {
            this.loadEdu(this.userkey);
        });

    }
    projModalShow(): void {
        const activeModal = this.modalService.open(PortfolioModal, { size: 'lg' });
        activeModal.componentInstance.modalHeader = 'Add Item';
        activeModal.componentInstance.userkey = this.userkey;
        activeModal.result
        .then((d) => {
            this.loadProj(this.userkey);
        });
    }
    workModalShow(): void {
        const activeModal = this.modalService.open(WorkModal, { size: 'lg' });
        activeModal.componentInstance.modalHeader = 'Add Employeement';
        activeModal.componentInstance.userkey = this.userkey;
        activeModal.result
        .then((d) => {
            this.loadWork(this.userkey);
        });
       // .then((r) => { console.log(r);  }, (error) => { console.log("eeee"); });
    }

    goToDash() {
        let link = ['/dashboard'];
        this._router.navigate(link);
    }

    public loadSkills(userkey: string) {
        this._service.listStreamKeyItems(this.skillsStream, userkey).then(data => {
            console.log(data);
            let skill = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
            skill.forEach(element => {
                console.log(element);
                this.skills.push(element);
            });

        });
    }

    loadEdu(userkey: string) {
        this._service.listStreamKeyItems(this.eduStream, userkey).then(data => {
            let edu: Education = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
            edu.edu_id = data[data.length-1].txid;
            this.educations.push(edu);

        });
    }

    loadProj(userkey: string) {
        this._service.listStreamKeyItems(this.projStream, userkey).then(data => {
            let protfolio: Portfolio = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
            protfolio.item_id= data[data.length-1].txid;
            this.portfolios.push(protfolio);

        });
    }
  
    loadWork(userkey: string) {
        this._service.listStreamKeyItems(this.workStream, userkey).then(data => {
            let work: Employment = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
            work.emp_id = data[data.length-1].txid;
            this.employments.push(work);

        });
    }
}
