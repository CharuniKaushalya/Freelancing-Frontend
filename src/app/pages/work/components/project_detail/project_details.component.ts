import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { Project } from "../../../../theme/models/project";
import { Bid } from "../../../../theme/models/bid";
import { User } from "../../../../theme/models/user";

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
    userstream: string = "Users";
    decodedFiles = [];

    freelancer_bids: Bid[] = [];
    qa_bids: Bid[] = [];
    public freelancer_bidsum: number = 0;
    public qa_bidsum: number = 0;

    selectFreelnacer = false;
    selectQA = false;

    fBid;
    qaBid;

    constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router) {
        this._route.params.forEach((params: Params) => {
            if (params['project_id'] !== undefined) {
                let project_id = params['project_id'];
                this._service.gettxoutdata(project_id.toString()).then(data => {
                    this.project = JSON.parse(this._service.Hex2String(data.toString()));
                    this.project.project_id = project_id;
                }).catch(error => {
                    console.log(error.message);
                });

                let bid_key = project_id + "/" + localStorage.getItem("user");

                _service.listStreamItems(this.bidStream).then(data => {
                    data.forEach(element => {
                        let bid_key = element.key;

                        if (project_id == bid_key.split("/")[0]) {

                            let bid: Bid;
                            bid = JSON.parse(this._service.Hex2String(element.data.toString()));
                            _service.listStreamKeyItems(this.userstream, bid.user_email.toString()).then(data => {
                                let user: User;
                                user = JSON.parse(this._service.Hex2String(data[0].data.toString()));
                                bid.user_type = user.type;
                                bid.user_name = user.name;
                                bid.user_id = data[0].txid;
                                console.log(bid)
                                if (user.type == "Freelancer") {
                                    this.freelancer_bidsum += bid.bid_amount;
                                    this.freelancer_bids.push(bid);
                                }
                                else if (user.type == "QA") {
                                    this.qa_bidsum += bid.bid_amount;
                                    this.qa_bids.push(bid);
                                }
                            }).catch(error => {
                                console.log(error.message);
                            });
                        }
                    });
                    console.log(this.freelancer_bidsum);
                }).catch(error => {
                    console.log(error.message);
                });

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

    goToUser(id: string) {
        let link = ['/pages/users/profile', id];
        this._router.navigate(link);
    }

    goToContract() {
        console.log(this.fBid)  //key of freelancer bid ----> project_id/user_email
        console.log(this.qaBid) // key of QA bid------> project_id/user_email
        let link = ['/pages/contract/mycontract', this.fBid, this.qaBid];
        this._router.navigate(link);
    }
}
