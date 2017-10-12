import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import {Contract} from "../../../../theme/models/contract";
import {Project} from "../../../../theme/models/project";
import {User} from "../../../../theme/models/user";
import {ContractStatus} from "../../../../theme/models/contractStatus";

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

    contract_types = ['Freelancer', 'QA', 'Consultant'];
    no_of_milestone = ['0', '1', '2', '3', '4', '5'];
    assets = ['USD', 'BTC'];
    milestone_init_values = ['50', '35', '25', '20', '15'];
    milestone_values = [];
    final_payment = '100%';
    qa_final_payment = '100%';

    freelancer_username = '';
    qa_username = '';
    available_balance = 0;
    primary_balance = 0;
    project_id;

    redo_request = '';
    inEdit = false;
    hasRedoRequestMsg = false;

    public freelancerMilestones = [
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

    public qaMilestones = [
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

    constructor(private _router: Router, private _route: ActivatedRoute, private _service: MyService, private modalService: NgbModal) {
        this._route.params.forEach((params: Params) => {
            if (params['fBid'] !== undefined) {
                let fBid = params['fBid'];

                this.project_id = fBid.split("/")[0];
                let f_email = fBid.split("/")[1];

                this.contract = new Contract();
                this.qa_contract = new Contract();

                if (f_email == '0') {
                    this.inEdit = true;
                    _service.gettxoutdata(this.project_id).then(largedata => {
                        this.contract = JSON.parse(this._service.Hex2String(largedata.toString()));

                        _service.listStreamKeyItems(this.contractStatusStream, this.project_id).then(element => {
                            this.contract.status = JSON.parse(this._service.Hex2String((element[element.length - 1]).data.toString()));

                            this.primary_balance = this.contract.amount;
                            this.redo_request = this.contract.status.milestone_state;

                            if(this.redo_request != null)
                                this.hasRedoRequestMsg = true;

                            console.log("Editing contract");
                            console.log(this.contract);

                            _service.listStreamKeyItems(this.userstream, this.contract.freelancer_email).then(data => {
                                let user: User;
                                user = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                                this.freelancer_username = user.name;

                                this.setMilestones();
                            });
                        });
                    });

                } else {

                    this.contract.milestones = 0;
                    this.qa_contract.milestones = 0;

                    _service.gettxoutdata(this.project_id).then(largedata => {
                        let project = JSON.parse(this._service.Hex2String(largedata.toString()));
                        this.contract.projectName = project.projectName;
                        this.contract.type = "Freelancer";
                        this.contract.description = project.description;
                        this.contract.asset = project.budget.type;

                        this.qa_contract.projectName = project.projectName;
                        this.qa_contract.type = "QA";
                        this.qa_contract.description = project.description;
                        this.qa_contract.asset = project.budget.type;
                    });

                    _service.listStreamKeyItems(this.userstream, f_email.toString()).then(data => {
                        let user: User;
                        user = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                        this.contract.freelancer = user.address;
                        this.contract.freelancer_email = f_email.toString();
                        this.freelancer_username = user.name;
                    });

                    if (params['qaBid'] != 0) {
                        this.hasQA = true;
                        let qaBid = params['qaBid'];
                        let qa_email = qaBid.split("/")[1];
                        _service.listStreamKeyItems(this.userstream, qa_email.toString()).then(data => {
                            let user: User;
                            user = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                            this.qa_contract.freelancer = user.address;
                            this.qa_contract.freelancer_email = qa_email.toString();
                            this.qa_username = user.name;
                        });
                    }
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
        this.getAvailableBalance();
    }

    ngOnInit() {
    }

    setMilestones(): void {

        for (let i = 0; i < this.contract.milestones; i++) {
            this.freelancerMilestones[i].edit = true;
            this.freelancerMilestones[i].value = this.contract.milestoneValues[i].value;
            this.freelancerMilestones[i].deadline = this.contract.milestoneValues[i].deadline;
            this.freelancerMilestones[i].task = this.contract.milestoneValues[i].task;
        }

        this.updateMilestonesSelectedValue(this.contract.milestones);
    }

    getAvailableBalance(): void {

        let user = new User();
        this._service.listStreamKeyItems(this.userstream, localStorage.getItem('email')).then(data => {
            user = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));

            this._service.getAddressBalances(user.address, 'False').then(balances => {

                console.log(balances);
                if (balances.length == 1) {
                    this.available_balance = balances[0].qty;
                }
            });
            this.contract.client = user.address;
            this.qa_contract.client = user.address;

            this.contract.client_email = user.email;
            this.qa_contract.client_email = user.email;
        });
    }

    updateSelectedValue(event: string): void {

        let val = JSON.parse(event);
        this.updateMilestonesSelectedValue(val);
        this.updateMilestonesSelectedValue_QA(val);
    }

    updateMilestonesSelectedValue(val: number): void {

        let sum = 0;
        let percentage1 = String(Number(this.milestone_init_values[val - 1]) - 5);
        let percentage2 = String(this.milestone_init_values[val - 1]);
        let percentage3 = String(Number(this.milestone_init_values[val - 1]) + 5);
        this.milestone_values = [percentage1, percentage2, percentage3];
        this.contract.milestones = val;

        for (let num = 0; num < 5; num++) {
            if (num >= val) {
                this.freelancerMilestones[num].edit = false;
                this.freelancerMilestones[num].value = 0;
            }
            else {
                if (this.freelancerMilestones[num].value != Number(percentage1) && this.freelancerMilestones[num].value != Number(percentage2)
                    && this.freelancerMilestones[num].value != Number(percentage3)) {
                    this.freelancerMilestones[num].value = 0;
                }
                this.freelancerMilestones[num].edit = true;
            }
            sum += Number(this.freelancerMilestones[num].value);
        }
        sum = 100 - sum;
        this.final_payment = String(sum + '%');
    }

    updateMilestonesSelectedValue_QA(val: number): void {

        let sum = 0;
        let percentage1 = String(Number(this.milestone_init_values[val - 1]) - 5);
        let percentage2 = String(this.milestone_init_values[val - 1]);
        let percentage3 = String(Number(this.milestone_init_values[val - 1]) + 5);
        this.milestone_values = [percentage1, percentage2, percentage3];
        this.qa_contract.milestones = val;

        for (let num = 0; num < 5; num++) {
            if (num >= val) {
                this.qaMilestones[num].edit = false;
                this.qaMilestones[num].value = 0;
            }
            else {
                if (this.qaMilestones[num].value != Number(percentage1) && this.qaMilestones[num].value != Number(percentage2)
                    && this.qaMilestones[num].value != Number(percentage3)) {
                    this.qaMilestones[num].value = 0;
                }
                this.qaMilestones[num].edit = true;
            }
            sum += Number(this.qaMilestones[num].value);
        }
        sum = 100 - sum;
        this.qa_final_payment = String(sum + '%');
    }

    updateFinalPayment(event: string): void {
        let sum = 0;

        for (let num = 0; num < 5; num++) {
            sum += Number(this.freelancerMilestones[num].value);
        }
        sum = 100 - sum;
        this.final_payment = String(sum + '%');
    }

    updateFinalPayment_QA(event: string): void {
        let sum = 0;

        for (let num = 0; num < 5; num++) {
            sum += Number(this.qaMilestones[num].value);
        }
        sum = 100 - sum;
        this.qa_final_payment = String(sum + '%');
    }

    updatePreviousContractStatus() {

        let prevContractStatus = this.contract.status;
        prevContractStatus.status = "PreviousVersion";
        prevContractStatus.milestone_state = null;
        let prev_data_hex = this._service.String2Hex(JSON.stringify(prevContractStatus));

        this._service.publishToStream(this.contractStatusStream, prevContractStatus.contract_id, prev_data_hex).then(data => {
            console.log(data);
            console.log(prevContractStatus);
            console.log("Previous Contract Status Updated");
        });
    }

    updateLinkedContractStatus(key: string, newId: string) {

        this._service.listStreamKeyItems(this.contractStatusStream, key).then(element => {
            let linkedContractLastStatus = JSON.parse(this._service.Hex2String((element[element.length - 1]).data.toString()));
            linkedContractLastStatus.contract_link = newId;

            let data_hex = this._service.String2Hex(JSON.stringify(linkedContractLastStatus));

            this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
                console.log(data);
                console.log(linkedContractLastStatus);
                console.log("Linked Contract Status Updated");
            });
        });
    }

    saveContract() {

        if (this.inEdit) {
            this.updatePreviousContractStatus();
        }

        let key = this.contract.projectName;
        this.contract.milestoneValues = this.freelancerMilestones.filter(function (attr) {
            delete attr.edit;
            return true;
        }).slice(0, this.contract.milestones);

        let contractJSON = JSON.stringify(this.contract);
        let data_hex = this._service.String2Hex(contractJSON);

        let qa_data_hex;
        if (this.hasQA) {
            this.qa_contract.milestoneValues = this.qaMilestones.filter(function (attr) {
                delete attr.edit;
                return true;
            }).slice(0, this.qa_contract.milestones);

            let qa_contractJSON = JSON.stringify(this.qa_contract);
            qa_data_hex = this._service.String2Hex(qa_contractJSON);
        }

        let hasEnoughAssets = false;
        let requested_amount = Number(this.contract.amount);

        if (this.hasQA) {
            requested_amount += Number(this.qa_contract.amount);
        }

        if (requested_amount <= this.available_balance)
            hasEnoughAssets = true;

        if (this.inEdit && requested_amount <= (this.available_balance + this.primary_balance))
            hasEnoughAssets = true;

        if (hasEnoughAssets) {

            let prevContractStatus = this.contract.status;
            this.contract.status = null;

            this._service.publishToStream(this.contractStream, key, data_hex).then(f_data => {
                console.log("Freelancer Contract Saved");
                console.log(this.contract);
                console.log(f_data);

                if (this.inEdit) {
                    if(prevContractStatus.contract_link != null)
                        this.updateLinkedContractStatus(prevContractStatus.contract_link, f_data);

                    this.saveContractStatus(f_data, prevContractStatus.contract_link);

                    if (this.primary_balance < requested_amount) {
                        let lock_amount = requested_amount - this.primary_balance;

                        this._service.lockAssetsFrom(this.contract.client, this.contract.asset, lock_amount.toString()).then(data => {
                            console.log("Assets Locked");
                            console.log(data);
                        });

                    } else if (this.primary_balance > requested_amount) {
                        let locked_amount_usd = 0;

                        this._service.getAddressBalances(this.contract.client, 'True').then(total_balances => {

                            if (total_balances.length == 1)
                                locked_amount_usd = total_balances[0].qty;

                            this._service.getAddressBalances(this.contract.client, 'False').then(unlocked_balances => {

                                if (unlocked_balances.length == 1) {
                                    locked_amount_usd = locked_amount_usd - unlocked_balances[0].qty;
                                }
                                locked_amount_usd -= this.primary_balance;
                                locked_amount_usd += requested_amount;

                                this._service.unlockAllAssets().then(data => {
                                    console.log(data);
                                    console.log("Assets Unlocked");

                                    this._service.lockAssetsFrom(this.contract.client, this.contract.asset, locked_amount_usd.toString()).then(data => {
                                        console.log(data);
                                        console.log("Assets Locked = " + locked_amount_usd);
                                    });
                                });
                            });
                        });
                    }

                } else {
                    if (this.hasQA) {
                        this._service.publishToStream(this.contractStream, key, qa_data_hex).then(qa_data => {
                            console.log("QA Contract Saved");
                            console.log(qa_data);

                            this.saveContractStatus(f_data, qa_data);
                            this.saveContractStatus(qa_data, f_data);
                        });

                    } else {
                        this.saveContractStatus(f_data, null);
                    }
                    this._service.lockAssetsFrom(this.contract.client, this.contract.asset, requested_amount.toString()).then(data => {
                        console.log("Assets Locked");
                        console.log(data);
                    });
                }
                this._router.navigate(['/pages/contract/contract_view'])
            });
        } else {
            $('#myModal').modal('show');
        }

    }

    saveContractStatus(key_id: string, link_id: string) {
        let key = key_id;
        let contractStatus = new ContractStatus();

        /* setting the contract state attributes */
        contractStatus.contract_id = key;
        contractStatus.status = "Pending";

        if(link_id != null)
            contractStatus.contract_link = link_id;

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        console.log(contractStatus);

        let data_hex = this._service.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log(data);
            console.log("Contract Status Saved");
        });
    }
}
