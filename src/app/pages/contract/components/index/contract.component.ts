import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

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

    error = false;
    error_msg = '';
    today = '';

    public form: FormGroup;
    public projectName: AbstractControl;
    public contract_type: AbstractControl;
    public freelancer: AbstractControl;
    public deadline: AbstractControl;
    public amount: AbstractControl;
    public asset: AbstractControl;
    public description: AbstractControl;

    public qa_projectName: AbstractControl;
    public qa_contract_type: AbstractControl;
    public qa_freelancer: AbstractControl;
    public qa_deadline: AbstractControl;
    public qa_amount: AbstractControl;
    public qa_asset: AbstractControl;
    public qa_description: AbstractControl;

    public freelancerMilestones = [
        {
            id: 1,
            name: 'Milestone 1',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 2,
            name: 'Milestone 2',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 3,
            name: 'Milestone 3',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 4,
            name: 'Milestone 4',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 5,
            name: 'Milestone 5',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        }
    ];

    public qaMilestones = [
        {
            id: 1,
            name: 'Milestone 1',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 2,
            name: 'Milestone 2',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 3,
            name: 'Milestone 3',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 4,
            name: 'Milestone 4',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        },
        {
            id: 5,
            name: 'Milestone 5',
            value: 0,
            deadline: '',
            task: '',
            edit: false
        }
    ];

    constructor(private _router: Router, private _route: ActivatedRoute, private _service: MyService, fb: FormBuilder) {

        this._route.params.forEach((params: Params) => {

            if (params['qaBid'] != 0) {
                this.form = fb.group({
                    'projectName': ['', Validators.compose([Validators.required])],
                    'contract_type': ['', Validators.compose([Validators.required])],
                    'freelancer': ['', Validators.compose([Validators.required])],
                    'deadline': ['', Validators.compose([Validators.required])],
                    'amount': ['', Validators.compose([Validators.required])],
                    'asset': ['', Validators.compose([Validators.required])],
                    'description': ['', Validators.compose([Validators.required])],
                    'qa_projectName': ['', Validators.compose([Validators.required])],
                    'qa_contract_type': ['', Validators.compose([Validators.required])],
                    'qa_freelancer': ['', Validators.compose([Validators.required])],
                    'qa_deadline': ['', Validators.compose([Validators.required])],
                    'qa_amount': ['', Validators.compose([Validators.required])],
                    'qa_asset': ['', Validators.compose([Validators.required])],
                    'qa_description': ['', Validators.compose([Validators.required])]
                });
            } else {
                this.form = fb.group({
                    'projectName': ['', Validators.compose([Validators.required])],
                    'contract_type': ['', Validators.compose([Validators.required])],
                    'freelancer': ['', Validators.compose([Validators.required])],
                    'deadline': ['', Validators.compose([Validators.required])],
                    'amount': ['', Validators.compose([Validators.required])],
                    'asset': ['', Validators.compose([Validators.required])],
                    'description': ['', Validators.compose([Validators.required])]
                });
            }

            this.projectName = this.form.controls['projectName'];
            this.contract_type = this.form.controls['contract_type'];
            this.freelancer = this.form.controls['freelancer'];
            this.deadline = this.form.controls['deadline'];
            this.amount = this.form.controls['amount'];
            this.asset = this.form.controls['asset'];
            this.description = this.form.controls['description'];
            this.qa_projectName = this.form.controls['qa_projectName'];
            this.qa_contract_type = this.form.controls['qa_contract_type'];
            this.qa_freelancer = this.form.controls['qa_freelancer'];
            this.qa_deadline = this.form.controls['qa_deadline'];
            this.qa_amount = this.form.controls['qa_amount'];
            this.qa_asset = this.form.controls['qa_asset'];
            this.qa_description = this.form.controls['qa_description'];

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

                            if (this.redo_request != null)
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

    getDate(): void {
        let todayDate = new Date();
        let dd = todayDate.getDate();
        let mm = todayDate.getMonth() + 1; //January is 0!
        let yyyy = todayDate.getFullYear();

        let sdd = dd.toString();
        let smm = mm.toString();

        if (dd < 10) {
            sdd = '0' + dd.toString();
        }
        if (mm < 10) {
            smm = '0' + mm.toString();
        }
        this.today = yyyy + '-' + smm + '-' + sdd;
        console.log(this.today);
    }

    ngOnInit() {
        this.getDate();
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

    validate(): void {

        this.error = false;

        for (let i = 0; i < this.contract.milestones; i++) {
            if (this.freelancerMilestones[i].value == 0) {
                this.error = true;
                this.error_msg = "Please add a payment percentage to the Freelancer milestone " + this.freelancerMilestones[i].id;
                break;
            }
            if (this.freelancerMilestones[i].deadline.length == 0) {
                this.error = true;
                this.error_msg = "Please add a deadline to Freelancer milestone " + this.freelancerMilestones[i].id;
                break;

            } else if (Date.parse(this.contract.deadline) < Date.parse(this.freelancerMilestones[i].deadline)) {
                this.error = true;
                this.error_msg = "Milestone " + this.freelancerMilestones[i].id + " deadline should be lesser than Freelancer contract deadline";
                break;
            }
        }

        if (this.hasQA) {
            for (let i = 0; i < this.qa_contract.milestones; i++) {
                if (this.qaMilestones[i].value == 0) {
                    this.error = true;
                    this.error_msg = "Please add a payment percentage to the QA milestone " + this.freelancerMilestones[i].id;
                    break;
                }
                if (this.qaMilestones[i].deadline.length == 0) {
                    this.error = true;
                    this.error_msg = "Please add a deadline to QA milestone " + this.qaMilestones[i].id;
                    break;

                } else if (Date.parse(this.qa_contract.deadline) < Date.parse(this.qaMilestones[i].deadline)) {
                    this.error = true;
                    this.error_msg = "Milestone " + this.qaMilestones[i].id + " deadline should be lesser than QA contract deadline";
                    break;
                }
            }
        }
    }

    onSubmit(values: Object): void {

        this.validate();

        if (this.form.valid && !this.error) {

            this.error_msg = '';

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
                        if (prevContractStatus.contract_link != null)
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

        } else {
            console.log("Error");
        }
    }

    saveContractStatus(key_id: string, link_id: string) {
        let key = key_id;
        let contractStatus = new ContractStatus();

        /* setting the contract state attributes */
        contractStatus.contract_id = key;
        contractStatus.status = "Pending";

        if (link_id != null)
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

    showRules(): void {
        this._router.navigate(['/pages/contract/contract_rules']);
    }
}
