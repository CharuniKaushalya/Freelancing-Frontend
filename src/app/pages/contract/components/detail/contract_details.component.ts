import {Component} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {DataService} from "../../../../theme/services/data/data.service";
import {Router, ActivatedRoute} from '@angular/router';

import {Contract} from "../../../../theme/models/contract";
import {ContractStatus} from "../../../../theme/models/contractStatus";

@Component({
    selector: 'contract_details',
    templateUrl: './contract_details.html',
    providers: [MyService]
})

export class ContractDetails {

    contract: Contract;
    hasMilestones = false;
    isCompleted = true;
    hasLinkedContract = false;
    linkedContract: Contract;
    contractStatusStream: string = "ContractStatus";
    userType;

    constructor(private _service: MyService, private data: DataService, private _route: ActivatedRoute, private _router: Router) {
        this.userType = localStorage.getItem("user_type");
        this.contract = data.getData();

        delete this.contract.status.current_milestone_name;
        delete this.contract.status.progress;

        if (this.contract.status.contract_link != null) {
            this.hasLinkedContract = true;

            _service.gettxoutdata(this.contract.status.contract_link).then(largedata => {
                this.linkedContract = JSON.parse(this._service.Hex2String(largedata.toString()));
                console.log("Linked contract");
                console.log(this.linkedContract);
            })
        }

        if (this.contract.milestones > 0 || (this.contract.status.status != "Completed")) {
            this.hasMilestones = true;
        }

        if (this.contract.status.status != "Completed") {
            this.addFinalStep();
            this.isCompleted = false;
        }
        this.setMilestoneStatus();
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

        console.log(this.contract);
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
        this.contract.status.milestone_state = nextState;

        // if (nextState == 'Completed') {
        //     this.pay();
        // }

        if (nextState == 'Completed' && this.contract.milestones + 1 != this.contract.status.current_milestone) {
            this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName(nextState);

            this.contract.status.current_milestone += 1;
            this.contract.status.milestone_state = 'Uncompleted';

            this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName('Uncompleted');

        } else {
            this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName(nextState);

            if (nextState == 'Completed' && this.contract.milestones + 1 == this.contract.status.current_milestone) {
                this.contract.status.status = "Completed";
            }
        }
        this.saveContractStatus();

        if (this.hasLinkedContract)
            this.saveLinkedContractStatus();
    }

    saveContractStatus() {
        let key = this.contract.contract_id;
        let contractStatus = this.contract.status;

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        let data_hex = this._service.String2Hex(contractStatusJSON);

        console.log("Free");
        console.log(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log(data);
            console.log("Contract status saved");
        });
    }

    saveLinkedContractStatus() {

        let contractStatus = this.contract.status;
        let key = contractStatus.contract_link;

        contractStatus.contract_link = this.contract.contract_id;
        contractStatus.contract_id = key;

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        let data_hex = this._service.String2Hex(contractStatusJSON);

        console.log("QA");
        console.log(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log(data);
            console.log("Linked contract status saved");
        });
    }

    pay(): void {

        let locked_amount_usd = 0;
        let locked_amount_btc = 0;
        this._service.getAddressBalances(this.contract.client.address, 'True').then(total_balances => {

            if (total_balances[0].name == "USD") {
                locked_amount_usd = total_balances[0].qty;
                locked_amount_btc = total_balances[1].qty;

            } else {
                locked_amount_usd = total_balances[1].qty;
                locked_amount_btc = total_balances[0].qty;
            }

            this._service.getAddressBalances(this.contract.client.address, 'False').then(unlocked_balances => {

                if (total_balances[0].name == "USD") {
                    locked_amount_usd = locked_amount_usd - unlocked_balances[0].qty;
                    locked_amount_btc = locked_amount_btc - unlocked_balances[1].qty;

                } else {
                    locked_amount_usd = locked_amount_usd - unlocked_balances[1].qty;
                    locked_amount_btc = locked_amount_btc - unlocked_balances[0].qty;
                }
                console.log("Locked USD = " + locked_amount_usd);
                console.log("Locked BTC = " + locked_amount_btc);

                // this._service.unlockAllAssets().then(data => {
                //     console.log(data);
                    console.log("Assets unlocked");

                    let payment1 = this.getMilestonePayment(this.contract);

                    if (this.contract.asset == "USD") {
                        locked_amount_usd -= payment1;

                    } else {
                        locked_amount_btc -= payment1;
                    }

                    this._service.sendAssetFrom(this.contract.client.address, this.contract.freelancer.address, this.contract.asset, payment1.toString()).then(data => {

                        console.log(data);
                        console.log("Paid " + this.contract.type);

                        if (this.hasLinkedContract) {
                            let payment2 = this.getMilestonePayment(this.linkedContract);

                            if (this.contract.asset == "USD") {
                                locked_amount_usd -= payment2;

                            } else {
                                locked_amount_btc -= payment2;
                            }

                            this._service.sendAssetFrom(this.linkedContract.client, this.linkedContract.freelancer, this.linkedContract.asset, payment2.toString()).then(data => {

                                console.log(data);
                                console.log("Paid " + this.contract.type);

                                let lock_amount;

                                if (this.contract.asset == "USD") {
                                    lock_amount = locked_amount_usd;

                                } else {
                                    lock_amount = locked_amount_btc;
                                }
                                console.log("Lock amount = " + lock_amount);

                                this._service.lockAssetsFrom(this.contract.client, this.contract.asset, lock_amount.toString()).then(data => {
                                    console.log("Assets Locked");
                                    console.log(data);
                                });
                            });
                        }
                    });
                // });
            });
        });
    }

    getMilestonePayment(contract: Contract): number {

        let payment;
        let percentage;

        if (this.contract.milestones + 1 != this.contract.status.current_milestone) {
            percentage = Number(contract.milestoneValues[this.contract.status.current_milestone - 1].value);

        } else {
            percentage = 100;
            for (let i = 0; i < this.contract.milestones; i++) {
                percentage -= Number(contract.milestoneValues[i].value);
            }
        }
        payment = Math.round(Number(contract.amount) * percentage / 100);
        console.log("Payment = " + payment);
        return payment;
    }

    goBack() {
        console.log('Back called');
        let link = ['/pages/contract/contract_view'];
        this._router.navigate(link);
    }
}
