import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Contract } from "../../../../theme/models/contract";
import { Project } from "../../../../theme/models/project";
import { User } from "../../../../theme/models/user";
import { ContractStatus } from "../../../../theme/models/contractStatus";

@Component({
    selector: 'my-contract',
    templateUrl: './contract.html',
    providers: [MyService],
})

export class MyContract implements OnInit {

    @Input() contract: Contract;
    @Input() qa_contract: Contract;
    @Output() close = new EventEmitter();
    contractStream: string = "Contracts";
    contractStatusStream: string = "ContractStatus";
    projctsStream: string = "Projects";
    userstream: string = "Users";

    hasQA = false; 

    fromAddresses = null;
    toAddresses = null;
    balances = null;
    permissions = "receive";
    projects: Project[] = [];

    assets = ['USD', 'BTC'];
    contract_types = ['Developer', 'QA', 'Consultant'];
    no_of_milestone = ['0', '1', '2', '3', '4', '5'];
    milestone_init_values = ['50', '35', '25', '20', '15'];
    milestone_values = [];
    final_payment = '100%';

    public listOfObjects = [
        {
            id: 1,
            name: 'Milestone_1',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 2,
            name: 'Milestone_2',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 3,
            name: 'Milestone_3',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 4,
            name: 'Milestone_4',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 5,
            name: 'Milestone_5',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        }
    ];

    constructor(private _router: Router, private _route: ActivatedRoute, private _service: MyService) {
        this._route.params.forEach((params: Params) => {
            if (params['fBid'] !== undefined) {
                let fBid = params['fBid'];
                let project_id = fBid.split("/")[0];
                let f_email = fBid.split("/")[1];

                this.contract = new Contract();
                this.contract.milestones = 0;

                this.qa_contract = new Contract();
                this.qa_contract.milestones = 0;

                _service.gettxoutdata(project_id).then(largedata => {
                    let project = JSON.parse(this._service.Hex2String(largedata.toString()));
                    this.contract.projectName = project.projectName;
                    this.contract.type = "Developer";
                    this.contract.description = project.description;
                    this.contract.asset = project.budget.type;

                    this.qa_contract.projectName = project.projectName;
                    this.qa_contract.type = "QA";
                    this.qa_contract.description = project.description;
                    this.qa_contract.asset = project.budget.type;
                });

                _service.listStreamKeyItems(this.userstream, f_email.toString()).then(data => {
                    let user: User;
                    user = JSON.parse(this._service.Hex2String(data[0].data.toString()));
                    this.contract.freelancer = user.address;
                });

                if (params['qaBid'] !== undefined && params['qaBid'] !== 1) {
                    this.hasQA=true
                    let qaBid = params['qaBid'];
                    let qa_email = qaBid.split("/")[1];
                    _service.listStreamKeyItems(this.userstream, qa_email.toString()).then(data => {
                        let user: User;
                        user = JSON.parse(this._service.Hex2String(data[0].data.toString()));
                        this.qa_contract.freelancer = user.address;
                    });

                }
            }
            else {
                _service.getaddresses().then(data => {
                    console.log(data);
                    this.fromAddresses = data;
                    this._service.getaddressbalances(this.fromAddresses[0].address).then(data => {
                        this.balances = data;
                    });
                });

                _service.listpermissions(this.permissions, null).then(data => {
                    console.log(data);
                    this.toAddresses = data;
                });

                _service.listStreamItems(this.projctsStream).then(data => {
                    data.forEach(element => {
                        let project: Project;
                        _service.gettxoutdata(element.data.txid).then(largedata => {
                            project = JSON.parse(this._service.Hex2String(largedata.toString()));
                            project.project_id = element.txid;
                            project.client = element.publishers[0];
                            this.projects.push(project);
                        });
                    });
                });

            }
        });
    }

    ngOnInit() {
    }

    onClickFromAddress(address: string) {
        this._service.getaddressbalances(address).then(data => {
            this.balances = data;
        });
    }

    updateSelectedValue(event: string): void {

        let sum = 0;
        let val = JSON.parse(event);
        let percentage1 = String(Number(this.milestone_init_values[val - 1]) - 5);
        let percentage2 = String(this.milestone_init_values[val - 1]);
        let percentage3 = String(Number(this.milestone_init_values[val - 1]) + 5);
        this.milestone_values = [percentage1, percentage2, percentage3];
        this.contract.milestones = val;

        for (let num = 0; num < 5; num++) {
            if (num >= val) {
                this.listOfObjects[num].edit = false;
                this.listOfObjects[num].value = 0;
            }
            else {
                if (this.listOfObjects[num].value != Number(percentage1) && this.listOfObjects[num].value != Number(percentage2)
                    && this.listOfObjects[num].value != Number(percentage3)) {
                    this.listOfObjects[num].value = 0;
                }
                this.listOfObjects[num].edit = true;
            }
            sum += Number(this.listOfObjects[num].value);
        }
        sum = 100 - sum;
        this.final_payment = String(sum + '%');
    }

    updateFinalPayment(event: string): void {
        let sum = 0;

        for (let num = 0; num < 5; num++) {
            sum += Number(this.listOfObjects[num].value);
        }
        sum = 100 - sum;
        this.final_payment = String(sum + '%');
    }

    saveContract() {

        let key = this.contract.projectName;
        this.contract.milestoneValues = this.listOfObjects.filter(function (attr) {
            delete attr.edit;
            return true;
        }).slice(0, this.contract.milestones);

        let contractJSON = JSON.stringify(this.contract);
        console.log(contractJSON);


        let data_hex = this._service.String2Hex(contractJSON);


        this._service.publishToStream(this.contractStream, key, data_hex).then(data => {
            console.log("Contract saved");
            console.log(data);

            this.saveContractStatus(data);
            this._router.navigate(['/pages/contract/contract_view'])
        });
    }

    saveContractStatus(id: string) {
        let key = id;
        let contractStatus = new ContractStatus();

        /* setting the contract state attributes */
        contractStatus.contract_id = key;
        contractStatus.current_milestone = 1;
        contractStatus.milestone_state = 'W';

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        console.log(contractStatusJSON);

        let data_hex = this._service.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log("Contract status saved");
            console.log(data);
        });
    }

}
