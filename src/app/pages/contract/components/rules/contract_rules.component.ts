import {Component, OnInit} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {Router} from '@angular/router';

import {ContractRulesModel} from "../../../../theme/models/contractRulesModel";

@Component({
    selector: 'contract_rules',
    templateUrl: './contract_rules.html',
    providers: [MyService]
})

export class ContractRules implements OnInit {

    contractRulesStream: string = "ContractRules";
    contractRulesModel = new ContractRulesModel();
    redos = [3, 4, 5];

    constructor(private _router: Router, private _service: MyService) {
        _service.listStreamItems(this.contractRulesStream).then(data => {

            this.contractRulesModel = JSON.parse(this._service.Hex2String(data[data.length -1].data));
        });
    }

    ngOnInit() {
    }

    saveRules(): void {
        let key = localStorage.getItem("email");

        let contractRulesJSON = JSON.stringify(this.contractRulesModel);
        console.log(this.contractRulesModel);

        let data_hex = this._service.String2Hex(contractRulesJSON);
        this._service.publishToStream(this.contractRulesStream, key, data_hex).then(data => {
            console.log(data);
            console.log("Contract Rules Saved");
        });
    }
}
