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

    contractStatusStream: string = "ContractStatus";

    constructor(private _service: MyService, private data: DataService, private _route: ActivatedRoute, private _router: Router) {
        this.contract = data.getData();

        if (this.contract.milestones > 0 || !this.isContractCompleted()) {
            this.hasMilestones = true;
        }

        if (!this.isContractCompleted()) {
            this.addFinalStep();
            this.isCompleted = false;
        }
        this.setMilestoneStatus();
    }

    isContractCompleted(): boolean {
        let completed = false;

        if (this.contract.status.current_milestone == this.contract.milestones + 1 && this.contract.status.milestone_state == 'C') {
            completed = true;
        }
        return completed;
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

            } else {
                this.contract.milestoneValues[i]["state"] = 'Not Completed';

            }
        }
    }

    getStateName(stateID: string): string {
        let stateName = '';
        switch (stateID) {
            case 'W':
                stateName = 'Working';
                break;
            case 'R':
                stateName = 'Reviewing';
                break;
            case 'P':
                stateName = 'Paid';
                break;
            case 'C':
                stateName = 'Completed';
                break;
        }
        return stateName;
    }

    stateBtnClicked(nextSate: string) {
        this.contract.status.milestone_state = nextSate;

        if (nextSate == 'C' && this.contract.milestones + 1 != this.contract.status.current_milestone) {
            this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName(nextSate);

            this.contract.status.current_milestone += 1;
            this.contract.status.milestone_state = 'W';

            this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName('W');

        } else {
            this.contract.milestoneValues[this.contract.status.current_milestone - 1].state = this.getStateName(nextSate);

        }
        this.saveContractStatus();
    }

    saveContractStatus() {
        let key = this.contract.contract_id;
        let contractStatus = new ContractStatus();

        /* setting the contract state attributes */
        contractStatus.contract_id = this.contract.contract_id;
        contractStatus.current_milestone = this.contract.status.current_milestone;
        contractStatus.milestone_state = this.contract.status.milestone_state;

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        let data_hex = this._service.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log("Contract status saved");
        });
    }

    goBack() {
        console.log('Back called');
        let link = ['/pages/contract/contract_view'];
        this._router.navigate(link);
    }
}
