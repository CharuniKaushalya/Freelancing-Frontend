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

    constructor(private _route: ActivatedRoute, private _router: Router, private data: DataService) {
        this.contract = data.getData();
    }

    goBack() {
        console.log('Back called');
        let link = ['/pages/contract/contract_view'];
        this._router.navigate(link);
    }
}
