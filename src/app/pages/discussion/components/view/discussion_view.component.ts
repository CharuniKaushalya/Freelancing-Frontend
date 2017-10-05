import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {DataService} from "../../../../theme/services/data/data.service";
import { Router, Params, ActivatedRoute } from '@angular/router';

import {Contract} from "../../../../theme/models/contract";
import {ContractStatus} from "../../../../theme/models/contractStatus";

import { Discussion } from "../../../../theme/models/discussion";
import { AuthService } from '../../../../providers/auth.service';

@Component({
    selector: 'discussion_view',
    templateUrl: './discussion_view.html',
    providers: [MyService]
})

export class DiscussionView implements OnInit {

    @Input() discussion: Discussion;
    

    @Output() close = new EventEmitter();
    
    discussionStream: string = "discussion";

    contract: Contract;

    user_email: string;
    contract_id: string;
    discussions: Discussion[] = [];

    

    /*constructor(private _router: Router, private _service: MyService, public authService: AuthService) {

        this.discussion = new Discussion();
        

        this.authService.getAuth().authState.subscribe(user => {
            console.log(user);
            if (user == null) {
              this.user_email = '';
            } else {
              this.user_email = user.email;
            }
        });

        _service.listStreamItems(this.discussionStream).then(data => {
            data.forEach(element => {
                let discussion: Discussion;
                let key = this.contract.contract_id;
                _service.gettxoutdata(element.txid).then(largedata => {
                    discussion = JSON.parse(this._service.Hex2String(largedata.toString()));
                    if (discussion.user && discussion.user == localStorage.getItem("email")) {
                        discussion.discussion_id = element.txid;
                       
                        this.discussions.push(discussion);
                    }

                }).catch(error => {
                    console.log(error.message);
                });
            });
        }).catch(error => {
            console.log(error.message);
        });

        

    }*/


    constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router, public authService: AuthService) {
        let discussion: Discussion;
                this.discussion = new Discussion();

        this._route.params.forEach((params: Params) => {
            if (params['contract_id'] !== undefined) {
                this.contract_id = params['contract_id'];

                console.log(this.contract_id);
                /*this._service.gettxoutdata(contract_id.toString()).then(data => {
                    this.discussion = JSON.parse(this._service.Hex2String(data.toString()));
                    this.discussion.discussion_id = contract_id;
                    this.discussions.push(discussion);
                    console.log(this.discussion.title);
                }).catch(error => {
                    console.log(error.message);
                });*/

                this.authService.getAuth().authState.subscribe(user => {
            console.log(user);
            if (user == null) {
              this.user_email = '';
            } else {
              this.user_email = user.email;
            }
        });

        _service.listStreamItems(this.discussionStream).then(data => {
            data.forEach(element => {
                let discussion: Discussion;
                let key = this.contract_id;
                console.log("hi");
                console.log(element.txid);
                _service.gettxoutdata(element.txid).then(largedata => {
                    discussion = JSON.parse(this._service.Hex2String(largedata.toString()));
                    if (discussion.user && discussion.user == localStorage.getItem("email")) {
                        discussion.discussion_id = element.txid;
                       
                        this.discussions.push(discussion);
                    }

                }).catch(error => {
                    console.log(error.message);
                });
            });
        }).catch(error => {
            console.log(error.message);
        });


               


            } else {

            }
        });
    }

    ngOnInit() {
    }

   
    // onChangeBudgetType(value: any) {
    //     this.project.budget.type = value;
    // }

    save() {
        
        this.discussion.user = this.user_email;
        let key =this.contract_id;
        let contract_id= this.contract_id;
        
        let projectJSON = JSON.stringify(this.discussion)

        let data_hex = this._service.String2Hex(projectJSON)

        this._service.publishToStream(this.discussionStream, key, data_hex).then(data => {
            console.log("saved");
            
            console.log(this.discussion.title);
            console.log(contract_id);


        

        
        let link = ['/pages/discussion/discussion_view', contract_id];
        this._router.navigate(link);

        }).catch(error => {
            console.log(error.message);
        });
    }

   
}
