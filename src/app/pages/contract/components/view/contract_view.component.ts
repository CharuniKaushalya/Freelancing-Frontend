import {Component, OnInit} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {DataService} from "../../../../theme/services/data/data.service";
import {Router} from '@angular/router';

import {Contract} from "../../../../theme/models/contract";
import {ContractStatus} from "../../../../theme/models/contractStatus";

@Component({
    selector: 'contract_view',
    templateUrl: './contract_view.html',
    providers: [MyService]
})

export class ContractView implements OnInit {

    contractStream: string = "Contracts";
    contractStatusStream: string = "ContractStatus";

    active_contracts: Contract[] = [];
    completed_contracts: Contract[] = [];

    constructor(private _router: Router, private _service: MyService, private data: DataService) {

        _service.listStreamItems(this.contractStream).then(data => {
            data.forEach(element => {
                let contract: Contract;
                if (element.data.txid == null) {
                    contract = JSON.parse(this._service.Hex2String(element.data.toString()));

                } else {
                    _service.gettxoutdata(element.data.txid).then(largedata => {
                        contract = JSON.parse(this._service.Hex2String(largedata.toString()));
                    })
                }
                contract.contract_id = element.txid;
                contract.client = element.publishers[0];
                contract.status = new ContractStatus();

                this._service.listStreamKeyItems(this.contractStatusStream, element.txid).then(element => {
                    let lastStatus = element[element.length - 1];
                    let status = JSON.parse(this._service.Hex2String(lastStatus.data.toString()));
                    contract.status = status;
                    contract.status.current_milestone_name = this.getCurrentMilestoneName(contract.milestones, status.current_milestone);
                    contract.status.progress = this.getProgress(contract.milestones, contract.milestoneValues, status);

                    if (contract.milestones + 1 == status.current_milestone && status.milestone_state == 'C') {
                        this.completed_contracts.unshift(contract);

                    } else {
                        this.active_contracts.unshift(contract);
                    }
                });
            });
        });
    }

    ngOnInit() {
    }

    getCurrentMilestoneName(milestones: number, currentMilestone: number): string {
        let name = 'Milestone_';

        if (currentMilestone == milestones + 1) {
            if (milestones == 0) {
                name = 'Working';

            } else {
                name = 'Finalizing';
            }
        } else {
            name = name + currentMilestone.toString();
        }
        return name;
    }

    getProgress(milestones: number, milestoneValues: any, status: ContractStatus): number {
        let progress = 0;

        if (milestones + 1 == status.current_milestone && status.milestone_state == 'C') {
            progress = 100;

        } else {
            for (let i = 0; i < status.current_milestone - 1; i++) {
                progress += Number(milestoneValues[i].value);
            }
        }
        return progress;
    }

    getSelectedContract(id: string): Contract {
        return (this.active_contracts.concat(this.completed_contracts)).find(x => x.contract_id === id);
    }

    goToContract(id: string) {
        let contract = this.getSelectedContract(id);
        this.data.saveData(contract);
        let link = ['/pages/contract/contract_details', id];
        this._router.navigate(link);
    }
}
