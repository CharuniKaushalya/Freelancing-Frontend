import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AF} from '../../../../providers/af';

import {Contract} from "../../../../theme/models/contract";
import {ContractStatus} from "../../../../theme/models/contractStatus";
import {ProjectStatus} from "../../../../theme/models/projectStatus";
import {User} from "../../../../theme/models/user";

@Component({
    selector: 'contract_details',
    templateUrl: './contract_details.html',
    providers: [MyService]
})

export class ContractDetails implements OnInit {

    @Input() contract: Contract;
    @Input() linkedContract: Contract;
    @Output() close = new EventEmitter();

    hasMilestones = false;
    isCompleted = true;
    hasLinkedContract = false;
    max_redos = 3;
    cancel_payment_percentage;

    contractRulesStream: string = "ContractRules";
    contractStatusStream: string = "ContractStatus";
    projectStream: string = "projects";
    projectStatusStream: string = "ProjectStatus";
    userstream: string = "Users";
    userType = '';
    redo_msg;

    constructor(private _service: MyService, private _route: ActivatedRoute, private _router: Router, public afService: AF) {
        this.userType = localStorage.getItem("userType");

        _service.listStreamItems(this.contractRulesStream).then(data => {
            let contractRulesModel = JSON.parse(this._service.Hex2String(data[data.length - 1].data));
            this.max_redos = contractRulesModel.redo;
        });

        this._route.params.forEach((params: Params) => {

            if (params['contract_id'] !== undefined) {
                let contract_id = params['contract_id'];

                _service.gettxoutdata(contract_id).then(largedata => {
                    this.contract = JSON.parse(this._service.Hex2String(largedata.toString()));
                    this.contract.contract_id = contract_id;

                    this._service.listStreamKeyItems(this.userstream, this.contract.client_email).then(data => {
                        if (data[data.length - 1] != undefined)
                            this.contract.client = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));

                        this._service.listStreamKeyItems(this.userstream, this.contract.freelancer_email).then(data => {
                            if (data[data.length - 1] != undefined)
                                this.contract.freelancer = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                        });
                    });

                    this._service.listStreamKeyItems(this.contractStatusStream, contract_id).then(element => {
                        let lastStatus = element[element.length - 1];
                        this.contract.status = JSON.parse(this._service.Hex2String(lastStatus.data.toString()));

                        if (this.contract.status.contract_link != null) {
                            this.hasLinkedContract = true;

                            _service.gettxoutdata(this.contract.status.contract_link).then(largedata => {
                                this.linkedContract = JSON.parse(this._service.Hex2String(largedata.toString()));

                                this._service.listStreamKeyItems(this.userstream, this.linkedContract.client_email).then(data => {
                                    if (data[data.length - 1] != undefined)
                                        this.linkedContract.client = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));

                                    this._service.listStreamKeyItems(this.userstream, this.linkedContract.freelancer_email).then(data => {
                                        if (data[data.length - 1] != undefined)
                                            this.linkedContract.freelancer = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                                    });
                                });

                                this._service.listStreamKeyItems(this.contractStatusStream, this.contract.status.contract_link).then(element => {
                                    let LinkedContractLastStatus = element[element.length - 1];
                                    this.linkedContract.status = JSON.parse(this._service.Hex2String(LinkedContractLastStatus.data.toString()));

                                    console.log("Linked contract");
                                    console.log(this.linkedContract);
                                });
                            });
                        }

                        console.log("Contract");
                        console.log(this.contract);

                        if (this.contract.milestones > 0 || (this.contract.status.status != "Completed")) {
                            this.hasMilestones = true;
                        }

                        if (this.contract.status.status != "Completed") {
                            this.addFinalStep();
                            this.isCompleted = false;
                        }
                        this.setMilestoneStatus();
                    });
                });
            }
        });
    }

    ngOnInit() {
        this.contract = new Contract();
        this.contract.client = new User();
        this.contract.freelancer = new User();
        this.contract.status = new ContractStatus();

        this.linkedContract = new Contract();
        this.linkedContract.client = new User();
        this.linkedContract.freelancer = new User();
        this.linkedContract.status = new ContractStatus();
    }

    addFinalStep() {
        let finalValue = 0;

        for (let i = 0; i < this.contract.milestones; i++) {
            finalValue += Number(this.contract.milestoneValues[i].value);
        }
        finalValue = 100 - finalValue;
        let final = {
            id: this.contract.milestones + 1,
            name: 'Final Step',
            value: finalValue,
            deadline: this.contract.deadline,
            task: 'Final Task',
            state: ''
        };
        if (this.contract.milestones == 0) {
            final.name = 'Project';
            final.task = 'All Tasks';
        }
        this.contract.milestoneValues.push(final);
    }

    setMilestoneStatus() {

        for (let i = 0; i < this.contract.milestoneValues.length; i++) {

            if (i + 1 < this.contract.status.current_milestone) {
                this.contract.milestoneValues[i]["state"] = 'Completed';

            } else if (i + 1 == this.contract.status.current_milestone) {
                this.contract.milestoneValues[i]["state"] = this.getStateName(this.contract.status.milestone_state);
                console.log(this.getStateName(this.contract.status.status))

            } else {
                this.contract.milestoneValues[i]["state"] = 'Not Completed';

            }
        }
    }

    getStateName(stateID: string): string {
        let stateName = '';
        switch (stateID) {
            case 'Uncompleted':
                stateName = 'Work Not Started';
                break;
            case 'Working':
                stateName = 'Development In Progress';
                break;
            case 'Reviewing':
                stateName = 'QA In Progress';
                break;
            case 'Completed':
                stateName = 'Completed';
                break;
        }
        return stateName;
    }

    stateBtnClicked(nextState: string) {

        if (nextState == 'QA_Failed' && this.max_redos == this.contract.status.redo) {
            $('#myModal2').modal('show');

        } else if(nextState == 'Reject_Work') {
            this.cancel_payment_percentage = 100;
            this.cancelActiveContract();

        } else {

            if (nextState == 'QA_Failed') {
                nextState = 'Working';
                this.contract.status.redo = this.contract.status.redo + 1;
            }

            this.contract.status.milestone_state = nextState;

            this.sendNotification(nextState);

            if (nextState == 'Completed' && this.contract.milestones + 1 != this.contract.status.current_milestone) {
                this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName(nextState);

                this.contract.status.current_milestone += 1;
                this.contract.status.milestone_state = 'Uncompleted';
                this.contract.status.redo = 0;

                this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName('Uncompleted');

                this.pay(false);

            } else {
                this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName(nextState);

                if (nextState == 'Completed' && this.contract.milestones + 1 == this.contract.status.current_milestone) {
                    this.contract.status.status = "Completed";
                    this.pay(true);
                }
            }

            this.saveContractStatus();

            if (this.hasLinkedContract)
                this.saveLinkedContractStatus();
        }
    }

    sendNotification(nextState: string) {

        let msg = '';
        let project = this.contract.projectName;

        if (nextState == 'Working') {
            if (this.contract.milestones == 0) {
                msg = "Work started";

            } else if (this.contract.milestones + 1 == this.contract.status.current_milestone) {
                msg = "Started working on final task";

            } else {
                msg = "Started working on milestone " + this.contract.status.current_milestone;
            }

        } else if (nextState == 'Reviewing') {
            if (this.contract.milestones == 0) {
                msg = "Start reviewing";

            } else if (this.contract.milestones + 1 == this.contract.status.current_milestone) {
                msg = "Start reviewing final task";

            } else {
                msg = "Start reviewing milestone " + this.contract.status.current_milestone;
            }

        } else if (nextState == 'Completed') {
            if (this.contract.milestones == 0) {
                msg = "Project completed";

            } else if (this.contract.milestones + 1 == this.contract.status.current_milestone) {
                msg = "Project completed";

            } else {
                msg = "Milestone " + this.contract.status.current_milestone + " completed";
            }
        }

        this.afService.sendNotification(msg, project, this.contract.client.address);

        if (nextState != 'Working' && this.hasLinkedContract) {
            this.afService.sendNotification(msg, project, this.linkedContract.freelancer.address);
        }
    }

    saveContractStatus() {

        let key = this.contract.contract_id;
        let contractStatus = this.contract.status;

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        let data_hex = this._service.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log(data);
            console.log("Contract status saved");
        });
    }

    saveLinkedContractStatus() {

        let linkedContractStatus = new ContractStatus();

        let key = this.contract.status.contract_link;

        linkedContractStatus.contract_id = this.contract.status.contract_link;
        linkedContractStatus.contract_link = this.contract.status.contract_id;
        linkedContractStatus.current_milestone = this.contract.status.current_milestone;
        linkedContractStatus.milestone_state = this.contract.status.milestone_state;
        linkedContractStatus.status = this.contract.status.status;
        linkedContractStatus.redo = this.contract.status.redo;

        /* saving contract state to the blockchain */
        let linkedContractStatusJSON = JSON.stringify(linkedContractStatus);
        let data_hex = this._service.String2Hex(linkedContractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log(data);
            console.log("Linked contract status saved");
        });
    }

    pay(finalStep: boolean): void {

        let locked_amount_usd = 0;

        this._service.getAddressBalances(this.contract.client.address, 'True').then(total_balances => {

            if (total_balances.length == 1) {
                locked_amount_usd = total_balances[0].qty;
            }

            this._service.getAddressBalances(this.contract.client.address, 'False').then(unlocked_balances => {

                if (unlocked_balances.length == 1) {
                    locked_amount_usd = locked_amount_usd - unlocked_balances[0].qty;
                }

                console.log("Locked USD = " + locked_amount_usd);

                this._service.unlockAllAssets().then(data => {
                    console.log(data);
                    console.log("Assets unlocked");

                    let payment1 = this.getMilestonePayment(this.contract, finalStep);

                    locked_amount_usd = locked_amount_usd - payment1;
                    console.log("locked_amount_usd -1 = " + locked_amount_usd);

                    this._service.sendAssetFrom(this.contract.client.address, this.contract.freelancer.address, this.contract.asset, payment1.toString()).then(data => {

                        console.log(data);
                        console.log("Paid " + this.contract.type + " " + payment1);

                        if (this.hasLinkedContract) {

                            let payment2 = this.getMilestonePayment(this.linkedContract, finalStep);
                            locked_amount_usd = locked_amount_usd - payment2;
                            console.log("locked_amount_usd -2 = " + locked_amount_usd);

                            this._service.sendAssetFrom(this.linkedContract.client.address, this.linkedContract.freelancer.address, this.linkedContract.asset, payment2.toString()).then(data => {

                                console.log(data);
                                console.log("Paid " + this.linkedContract.type + " " + payment2);

                                console.log("Lock amount = " + locked_amount_usd);

                                this._service.lockAssetsFrom(this.contract.client.address, this.contract.asset, locked_amount_usd.toString()).then(data => {
                                    console.log(data);
                                    console.log("Assets Locked");
                                });
                            });

                        } else {
                            this._service.lockAssetsFrom(this.contract.client.address, this.contract.asset, locked_amount_usd.toString()).then(data => {
                                console.log("Assets Locked");
                                console.log(data);
                            });
                            console.log("Else")
                        }
                    });
                });
            });
        });
    }

    getMilestonePayment(contract: Contract, finalStep: boolean): number {

        let payment;
        let percentage;

        if (finalStep) {
            percentage = 100;
            for (let i = 0; i < this.contract.milestones; i++) {
                percentage -= Number(contract.milestoneValues[i].value);
            }

        } else {
            let current_milestone = this.contract.status.current_milestone - 1;
            percentage = Number(contract.milestoneValues[current_milestone - 1].value);
        }
        payment = Math.round(Number(contract.amount) * percentage / 100);
        return payment;
    }

    changeContractStatus(id: string, linkedId: string, state: string): ContractStatus {
        let key = id;
        let contractStatus = new ContractStatus();

        /* setting the contract state attributes */
        contractStatus.contract_id = id;
        if (linkedId != null)
            contractStatus.contract_link = linkedId;
        contractStatus.status = state;

        if (state == "Active") {
            contractStatus.current_milestone = 1;
            contractStatus.milestone_state = "Uncompleted";
            contractStatus.redo = 0;
        }

        if (state == "RedoPending") {
            contractStatus.milestone_state = this.redo_msg;
        }

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        console.log(contractStatusJSON);

        let data_hex = this._service.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log("Contract status saved");
            console.log(data);
        });

        return contractStatus;
    }

    updateProjectStatus(id: string, status: string) {
        let projectStatus: ProjectStatus = new ProjectStatus();
        projectStatus.project_id = id;
        projectStatus.status = status;
        projectStatus.user_email = localStorage.getItem("email");

        let statusJSON = JSON.stringify(projectStatus);
        let data_hex = this._service.String2Hex(statusJSON);

        this._service.publishToStream(this.projectStatusStream, projectStatus.project_id, data_hex).then(data => {
            console.log(projectStatus.status + "saved");
        }).catch(error => {
            console.log(error.message);
        });
    }

    cancelContract(): void {

        let locked_amount_usd = 0;

        this._service.getAddressBalances(this.contract.client.address, 'True').then(total_balances => {

            if (total_balances.length == 1) {
                locked_amount_usd = total_balances[0].qty;
            }

            this._service.getAddressBalances(this.contract.client.address, 'False').then(unlocked_balances => {

                if (unlocked_balances.length == 1) {
                    locked_amount_usd = locked_amount_usd - unlocked_balances[0].qty;
                }

                console.log("Locked USD = " + locked_amount_usd);

                this._service.unlockAllAssets().then(data => {
                    console.log(data);
                    console.log("Assets unlocked");

                    if (this.hasLinkedContract) {
                        this.contract.status = this.changeContractStatus(this.contract.contract_id, this.contract.status.contract_link, "Cancelled");

                    } else {
                        this.contract.status = this.changeContractStatus(this.contract.contract_id, null, "Cancelled");
                    }
                    console.log("Contract Cancelled");

                    let payment1 = this.contract.amount;
                    locked_amount_usd = locked_amount_usd - Number(payment1);

                    if (this.hasLinkedContract) {

                        this.linkedContract.status = this.changeContractStatus(this.contract.status.contract_link, this.contract.contract_id, "Cancelled");
                        console.log("Linked Contract Cancelled");

                        let payment2 = this.linkedContract.amount;
                        locked_amount_usd = locked_amount_usd - Number(payment2);

                        this._service.lockAssetsFrom(this.contract.client.address, this.contract.asset, locked_amount_usd.toString()).then(data => {
                            console.log("Assets Locked");
                            console.log(data);
                        });

                        if (this.userType == "Client")
                            $('#myModal').modal('show');

                    } else {
                        this._service.lockAssetsFrom(this.contract.client.address, this.contract.asset, locked_amount_usd.toString()).then(data => {
                            console.log("Assets Locked");
                            console.log(data);
                        });
                    }
                });
            });
        });
    }

    cancelConformation(): void {
        if (this.userType == "QA") {
            $('#myModal3').modal('show');

        } else {
            this.cancel_payment_percentage = 50;
            this.cancelActiveContract();
        }
    }

    cancelActiveContract(): void {
        console.log(this.cancel_payment_percentage);
        // let cs = this.linkedContract.status;
        // cs.contract_id = this.contract.status.contract_id;
        // cs.contract_link = this.contract.status.contract_link;
        //
        // let contractStatusJSON = JSON.stringify(cs);
        // console.log(contractStatusJSON);
        //
        // let data_hex = this._service.String2Hex(contractStatusJSON);
        //
        // this._service.publishToStream(this.contractStatusStream, cs.contract_id, data_hex).then(data => {
        //     console.log("Contract status saved");
        //     console.log(data);
        // });

        if (this.cancel_payment_percentage <= 100 || this.cancel_payment_percentage >= 0) {
            let locked_amount_usd = 0;
            let finalStep = false;

            if (this.contract.milestones + 1 == this.contract.status.current_milestone)
                finalStep = true;
            else
                this.contract.status.current_milestone += 1;

            this._service.getAddressBalances(this.contract.client.address, 'True').then(total_balances => {

                if (total_balances.length == 1) {
                    locked_amount_usd = total_balances[0].qty;
                }

                this._service.getAddressBalances(this.contract.client.address, 'False').then(unlocked_balances => {

                    if (unlocked_balances.length == 1) {
                        locked_amount_usd = locked_amount_usd - unlocked_balances[0].qty;
                    }

                    console.log("Locked USD = " + locked_amount_usd);

                    this._service.unlockAllAssets().then(data => {
                        console.log(data);
                        console.log("Assets unlocked");

                        if (this.hasLinkedContract) {

                            let payment1 = this.getMilestonePayment(this.contract, finalStep);

                            this._service.sendAssetFrom(this.contract.client.address, this.contract.freelancer.address, this.contract.asset, payment1.toString()).then(data => {

                                console.log(data);
                                console.log("Paid " + this.contract.type + " -" + payment1);

                                let payment2 = Math.round((this.getMilestonePayment(this.linkedContract, finalStep)) * this.cancel_payment_percentage / 100);

                                this._service.sendAssetFrom(this.linkedContract.client.address, this.linkedContract.freelancer.address, this.linkedContract.asset, payment2.toString()).then(data => {

                                    console.log(data);
                                    console.log("Paid " + this.linkedContract.type + " -" + payment2);
                                    this.linkedContract.status = this.changeContractStatus(this.contract.status.contract_link, this.contract.contract_id, "Cancelled");
                                    this.contract.status = this.changeContractStatus(this.contract.contract_id, this.contract.status.contract_link, "Cancelled");
                                });
                            });

                        } else {
                            let payment1 = Math.round((this.getMilestonePayment(this.contract, finalStep)) * this.cancel_payment_percentage / 100);

                            this._service.sendAssetFrom(this.contract.client.address, this.contract.freelancer.address, this.contract.asset, payment1.toString()).then(data => {

                                console.log(data);
                                console.log("Paid " + this.contract.type + " " + payment1);
                                this.contract.status = this.changeContractStatus(this.contract.contract_id, null, "Cancelled");
                            });
                        }
                    });
                });
            });

        } else {
            console.log("Error")
        }
    }

    confirmContract(): void {

        this._service.listStreamKeyItems(this.projectStream, this.contract.projectName).then(p => {

            if (p[p.length - 1] != undefined) {
                let project_id = p[p.length - 1].txid;

                if (this.hasLinkedContract) {

                    if (this.linkedContract.status.status == "Pending") {
                        this.contract.status = this.changeContractStatus(this.contract.contract_id, this.contract.status.contract_link, "Confirmed");

                    } else if (this.linkedContract.status.status == "Confirmed") {
                        this.contract.status = this.changeContractStatus(this.contract.contract_id, this.contract.status.contract_link, "Active");
                        this.linkedContract.status = this.changeContractStatus(this.contract.status.contract_link, this.contract.contract_id, "Active");
                        this.updateProjectStatus(project_id, "Closed");
                    }

                } else {
                    this.contract.status = this.changeContractStatus(this.contract.contract_id, null, "Active");
                    this.updateProjectStatus(project_id, "Closed");
                }
            }
        });
    }

    /* Show redo request message box */
    showMsgBox(): void {
        let redoDiv = document.getElementById("divRedo");
        if (redoDiv.style.display === "none")
            $('#divRedo').show();
        else
            $('#divRedo').hide();
    }

    /* Request a redo from a client */
    requestRedo(): void {
        if (this.hasLinkedContract == true)
            this.contract.status = this.changeContractStatus(this.contract.contract_id, this.contract.status.contract_link, "RedoPending");
        else
            this.contract.status = this.changeContractStatus(this.contract.contract_id, null, "RedoPending");

        $('#requestBtn').hide();
    }

    /* Client redo a contract*/
    redoContract(): void {
        console.log('Go to create contract');
        let bid = this.contract.contract_id.toString() + "/0";
        let link = ['/pages/contract/mycontract', bid, 0];
        this._router.navigate(link);
    }

    goToDiscussion(id1: string, id2: string, id3: string): void {
        let id = id1 + id2 + id3;

        console.log(id);
        let link = ['/pages/chat/chat_view', id];
        this._router.navigate(link);
    }

    contact(id1: string, id2: string): void {

        let id = id1 + id2;
        console.log(id);
        let link = ['/pages/chat/chat_view', id];
        this._router.navigate(link);
    }

    goToRules() {
        console.log('Go to rules');
        let link = ['/pages/contract/contract_rules'];
        this._router.navigate(link);
    }

    goBack() {
        console.log('Back called');
        let link = ['/pages/contract/contract_view'];
        this._router.navigate(link);
    }
}
