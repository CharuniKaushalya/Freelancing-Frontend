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
                    contract = JSON.parse(this.Hex2String(element.data.toString()));
                    contract.contract_id = element.txid;
                    contract.client = element.publishers[0];
                    this.contracts.push(contract);
                } else {
                    _service.gettxoutdata(element.data.txid).then(largedata => {
                        console.log(element);
                        contract = JSON.parse(this.Hex2String(largedata.toString()));
                        contract.contract_id = element.txid;
                        contract.client = element.publishers[0];
                        this.contracts.push(contract);
                    })
                }

            });
            console.log(this.contracts);
        });
    }

    ngOnInit() {}

    Hex2String(hex_str: string) {
        let j;
        let hexes = hex_str.match(/.{1,4}/g) || [];
        let result_back = "";
        for (j = 0; j < hexes.length; j++) {
            result_back += String.fromCharCode(parseInt(hexes[j], 16));
        }
        return result_back;
    }

    getSelectedContract(id: string): Contract {
        return this.contracts.find(x => x.contract_id === id);
    }

    goToContract(id: string) {
        let contract = this.getSelectedContract(id);
        this.data.saveData(contract);
        let link = ['/pages/contract/contract_details', id];
        this._router.navigate(link);
    }
}
