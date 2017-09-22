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
    bids: Bid[] = [];
    public bidcount: number = 0;

    constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router) {
        this._route.params.forEach((params: Params) => {
            if (params['project_id'] !== undefined) {
                let project_id = params['project_id'];
                this._service.gettxoutdata(project_id.toString()).then(data => {
                    this.project = JSON.parse(this._service.Hex2String(data.toString()));
                    this.project.project_id = project_id;
                });

                let bid_key = project_id + "/" + localStorage.getItem("user");

                _service.listStreamItems(this.bidStream).then(data => {
                    data.forEach(element => {
                        let bid_key = element.key;

                        if (project_id == bid_key.split("/")[0]) {

                            let bid: Bid;
                            this.bidcount = 8;
                            bid = JSON.parse(this._service.Hex2String(element.data.toString()));
                            _service.listStreamKeyItems(this.userstream, bid.user_email.toString()).then(data => {
                                let user: User;
                                user = JSON.parse(this._service.Hex2String(data[0].data.toString()));
                                console.log(user);
                                bid.user_type = user.type;
                                bid.user_name = user.name;
                                bid.user_id  = data[0].txid;

                            });
                            this.bids.push(bid);
                            
                            
                           
                        }
                    });

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
}
