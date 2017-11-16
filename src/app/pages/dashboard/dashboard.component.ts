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
    usertype = 'Client';
    address = '';

    constructor(private _router: Router, private _service: MyService, private modalService: NgbModal) {

        this.usertype = localStorage.getItem("userType");
        this.address = localStorage.getItem("address");

        if (localStorage.getItem("email") == "" || localStorage.getItem("email") == undefined) {
            this._router.navigate(['login']);
        } else {
            // if(localStorage.getItem("userType") == "Client" ){
            //     this._router.navigate(['pages/work/posted_projects']);
            // }else{
            //     this._router.navigate(['pages/work/my_projects']);
            // }
            console.log(this.usertype);
            // _service.listStreamItems(this.projctsStream).then(data => {
            //     data.forEach(element => {
            //         let project: Project;
            //         _service.gettxoutdata(element.txid).then(largedata => {
            //             project = JSON.parse(this._service.Hex2String(largedata.toString()));
            //             project.project_id = element.txid;
            //             project.client = element.publishers[0];
            //             this._service.listStreamKeyItems(this.projctUtypeStream, project.project_id).then(data => {
            //                 data.forEach(element => {
            //                     let putype: ProjectUserType = JSON.parse(this._service.Hex2String(element.data.toString()));
            //                     console.log(putype.publish_utype);
            //                     if (localStorage.getItem("userType") == putype.publish_utype) {
            //                         this.projects.push(project);
            //                     }
            //                     //edu.edu_id = element.txid;
            //                     //this.educations.push(edu);
            //                 });

            //             }).catch(error => {
            //                 console.log(error.message);
            //             });

            //         }).catch(error => {
            //             console.log(error.message);
            //         });
            //     });
            // }).catch(error => {
            //     console.log(error.message);
            // });
        }
    }

    ngOnInit() {
        console.log(localStorage.getItem("userType"));
        // this.usertype = 'Client';
    }

    // bidModalShow(project_id): void {
    //     const activeModal = this.modalService.open(BidModelComponent, { size: 'sm' });
    //     activeModal.componentInstance.modalHeader = 'Place  a Bid';
    //     activeModal.componentInstance.key = project_id;
    // }

    goToProject(id: string) {
        let link = ['/pages/work/project_details', id];
        this._router.navigate(link);
    }

    goToProjects() {
        if(this.usertype == "Client" ){
            this._router.navigate(['pages/work/posted_projects']);
        }else{
            this._router.navigate(['pages/work/my_projects']);
        }
    }

    goToContracts() {
        this._router.navigate(['pages/contract/contract_view']);
    }

    goToWallet() {
        let link = ['/pages/users/wallet', this.address];
        this._router.navigate(link);
    }
}
