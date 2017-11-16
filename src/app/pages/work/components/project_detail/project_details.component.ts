import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { Project } from "../../../../theme/models/project";
import { Bid } from "../../../../theme/models/bid";
import { User } from "../../../../theme/models/user";
import { BidValues } from "../../../../theme/models/bidValues";

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
    myBid;

    isClient;
    message:string;

    constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router) {
        this._route.params.forEach((params: Params) => {
            if (params['project_id'] !== undefined) {

                if(localStorage.getItem("userType")=="Client"){
                    this.isClient = true;
                }
                let project_id = params['project_id'];
                this._service.gettxoutdata(project_id.toString()).then(data => {
                    this.project = JSON.parse(this._service.Hex2String(data.toString()));
                    this.project.project_id = project_id;
                }).catch(error => {
                    console.log(error.message);
                });

                let my_bid_key = project_id + "/" + localStorage.getItem("email");

                let bid_data: BidValues;
                _service.listStreamItems(this.bidStream).then(data => {
                    data.forEach(element => {
                        let bid_key = element.key;

                        if (bid_key == my_bid_key ){
                            this.myBid = JSON.parse(this._service.Hex2String(element.data.toString()));
                            console.log(this.myBid)
                        }

                        if (project_id == bid_key.split("/")[0]) {
                            let bid: Bid;
                            let client : string ="";
                            let bid_data: BidValues;
                            bid = JSON.parse(this._service.Hex2String(element.data.toString()));
                            console.log(bid);
                            this._service.listStreamKeyItems("Users", this.project.user).then(data => {
                                if(data[data.length-1]){
                                  let user: User = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
                                  client = user.address;
                                  if(bid.data && client && client == localStorage.getItem("address")){
                                    this._service.decrypt(client, bid.data).then(decrptdata => {
                                        if(decrptdata.data){
                                            bid_data = JSON.parse(decrptdata.data);
                                            bid.bid_amount = bid_data.bid_amount
                                            bid.deliver_time = bid_data.deliver_time;
                                        }
                                        _service.listStreamKeyItems(this.userstream, bid.user_email.toString()).then(data => {
                                            let user: User;
                                            user = JSON.parse(this._service.Hex2String(data[data.length-1].data.toString()));
                                            bid.user_type = user.type;
                                            bid.user_name = user.name;
                                            bid.user_id = data[0].txid;
                                            if(bid.signature){
                                                this._service.verify(user.address, bid.signature,JSON.stringify(bid_data)).then(data => {
                                                    if(data.verified){
                                                        console.log("Data Verified : " , data.verified, "add bid sum here");
                                                    }
                                                }).catch(error => {
                                                    console.log(error.message);
                                                });
                                            }
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
                                    }).catch(error => {
                                        console.log(error.message);
                                    });
                                }
                                 
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
        if(this.fBid == undefined) {
            this.message = "Please select a freelancer for create a new contract..";
            $('#modal1').modal('show');
        }else{
            if(this.qaBid == undefined) {
                this.message = "Are you sure want to proceed without a QA?";
                $('#modal2').modal('show');
            }else{
                console.log(this.fBid)  //key of freelancer bid ----> project_id/user_email
                console.log(this.qaBid) // key of QA bid------> project_id/user_email
                let link = ['/pages/contract/mycontract', this.fBid, this.qaBid];
                this._router.navigate(link);
            }
        }
    }

    setYesQaBid(){
        this.qaBid = 0;
        let link = ['/pages/contract/mycontract', this.fBid, this.qaBid];
        this._router.navigate(link);
    }


}
