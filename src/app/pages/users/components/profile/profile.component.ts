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
import { SkillModel } from "../../../../theme/models/skillmodel";
import { Education } from "../../../../theme/models/education";

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
    skills = [];
    educations: Education[] = [];


    constructor(private _service: MyService,
        private _route: ActivatedRoute, private _router: Router, private modalService: NgbModal) {

        _service.getinfo().then(data => {
            console.log(data);
            this.ChainInfo = data;
        });

        _service.getpeerinfo().then(data => {
            console.log(data);
            this.PeerInfo = data;
        });
    }


    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            if (params['user_id'] !== undefined) {
                let user_id = params['user_id'];
                this._service.getstreamitem(this.userStream, user_id.toString())
                .then(data => {
                    if (!data.error) {
                        this._service.listStreamKeyItems(this.skillsStream, data.key).then(data => {
                            data.forEach(element => {
                                console.log(element);
                                console.log(element.key);
                                let skill = JSON.parse(this._service.Hex2String(element.data.toString()));
                                skill.forEach(element => {
                                    this.skills.push(element);
                                });
                            });

                        });
                        this._service.listStreamKeyItems(this.eduStream, data.key).then(data => {
                            data.forEach(element => {
                                console.log(element);
                                console.log(element.key);
                                let edu: Education = JSON.parse(this._service.Hex2String(element.data.toString()));
                                console.log(edu);
                                edu.edu_id = element.txid;
                                this.educations.push(edu);
                            });

                        });
                        console.log("loaded  user skills");
                        console.log(this.skills);
                        this.userkey = data.key;
                        console.log(this.userkey);
                        this.user = JSON.parse(this._service.Hex2String(data.data.toString()));

                    }
                    else{
                        this.goToDash();
                    }
                        
                });
            }else {
            }
        });
    }

    valuechange() {

    }

    smModalShow(): void {
        const activeModal = this.modalService.open(SkillModal, { size: 'sm' });
        activeModal.componentInstance.modalHeader = 'Add Skill';
        activeModal.componentInstance.userkey = this.userkey;
    }

    eduModalShow(): void {
        const activeModal = this.modalService.open(EducationModal, { size: 'lg' });
        activeModal.componentInstance.modalHeader = 'Add Education';
        activeModal.componentInstance.userkey = this.userkey;
    }

    goToDash() {
    let link = ['/dashboard'];
    this._router.navigate(link);
  }


}
