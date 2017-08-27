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
    items = ['Pizza', 'Pasta', 'Parmesan'];
    userkey = "";
    skillsStream = "user-skill";
    skills =  [];


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
        console.log(this.items);
    }


    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            if (params['user_id'] !== undefined) {
                let user_id = params['user_id'];
                this._service.getstreamitem(this.userStream, user_id.toString())
                    .then(data => {
                        this._service.listStreamKeyItems(this.skillsStream,data.key).then(data => {
                          data.forEach(element => {
                            console.log(element);
                            console.log(element.key);
                            let skill = JSON.parse(this.Hex2String(element.data.toString()));
                            skill.forEach(element => {
                                this.skills.push(element);
                            });
                          });
                          
                        });
                        console.log("loaded  user skills");
                          console.log(this.skills);
                        this.userkey = data.key;
                        this.user = JSON.parse(this.Hex2String(data.data.toString()));
                    });
            } else {

            }
        });
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

    valuechange() {


    }
    onItemAdded(item) {
        this.items.push(item.value);
    }

    smModalShow(): void {
        const activeModal = this.modalService.open(SkillModal, { size: 'sm' });
        activeModal.componentInstance.modalHeader = 'Add Skill';
        activeModal.componentInstance.userkey = this.userkey;
    }

    eduModalShow(): void {
        const activeModal = this.modalService.open(EducationModal, { size: 'sm' });
        activeModal.componentInstance.modalHeader = 'Add Education';
    }


}
