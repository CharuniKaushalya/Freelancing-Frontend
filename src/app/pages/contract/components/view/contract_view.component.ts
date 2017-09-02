import {Component, OnInit} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {DataService} from "../../../../theme/services/data/data.service";
import {Router} from '@angular/router';

import {Contract} from "../../../../theme/models/contract";

@Component({
    selector: 'contract_view',
    templateUrl: './contract_view.html',
    providers: [MyService]
})

export class ContractView implements OnInit {

    contractStream: string = "Contracts";
    contracts: Contract[] = [];

    constructor(private _router: Router, private _service: MyService, private data: DataService) {
        _service.listStreamItems(this.contractStream).then(data => {
            data.forEach(element => {
                let contract: Contract;
                if (element.data.txid == null) {
                    contract = JSON.parse(this._service.Hex2String(element.data.toString()));
                    contract.contract_id = element.txid;
                    contract.client = element.publishers[0];
                    contract.status = 0;
                    this.contracts.push(contract);
                } else {
                    _service.gettxoutdata(element.data.txid).then(largedata => {
                        console.log(element);
                        contract = JSON.parse(this._service.Hex2String(largedata.toString()));
                        contract.contract_id = element.txid;
                        contract.client = element.publishers[0];
                        contract.status = 0;
                        this.contracts.push(contract);
                    })
                }

            });
            this.contracts = this.contracts.reverse();
            console.log(this.contracts);
        });
    }

    ngOnInit() {}

    getSelectedContract(id: string): Contract {
        return this.contracts.find(x => x.contract_id === id);
    }

    updateStatus(id: string): void {
        let contract = this.getSelectedContract(id);
        let milestones = contract.milestoneValues;
        contract.status = Number(contract.status) + 20;
    }

    goToContract(id: string) {
        let contract = this.getSelectedContract(id);
        this.data.saveData(contract);
        let link = ['/pages/contract/contract_details', id];
        this._router.navigate(link);
    }
}
