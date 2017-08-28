import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {DataService} from "../../../../theme/services/data/data.service";
import {Router, Params, ActivatedRoute} from '@angular/router';

import {Contract} from "../../../../theme/models/contract";

@Component({
    selector: 'contract_details',
    templateUrl: './contract_details.html',
    providers: [MyService]
})

export class ContractDetails {

    contract: Contract;
    listOfMilestones = [];
    hasMilestones = false;

    constructor(private _route: ActivatedRoute, private _router: Router, private data: DataService) {
        this.contract = data.getData();
        this.listOfMilestones = this.contract.milestoneValues;

        if (this.contract.milestones > 0) {
            this.hasMilestones = true;

            for (let i = 0; i < this.contract.milestones; i++) {
                // TODO
                // check if each milestone is completed by retrieving ContractStatus data for this contract
                this.contract.milestoneValues[i]["completed"] = false;
            }
        }
        console.log(this.contract.milestoneValues);
    }

    updateStatus(id: string): void {
        console.log(id);
    }

    goBack() {
        console.log('Back called');
        let link = ['/pages/contract/contract_view'];
        this._router.navigate(link);
    }
}
