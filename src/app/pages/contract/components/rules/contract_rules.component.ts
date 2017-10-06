import {Component, OnInit} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {Router} from '@angular/router';

import {Contract} from "../../../../theme/models/contract";
import {ContractStatus} from "../../../../theme/models/contractStatus";
import {User} from "../../../../theme/models/user";

@Component({
    selector: 'contract_rules',
    templateUrl: './contract_rules.html',
    providers: [MyService]
})

export class ContractRules implements OnInit {

    redos = [3, 4, 5];
    redo = 3;

    freelancer_pay_reduce_percentage = 5;
    qa_pay_reduce_percentage = 5;

    freelancer_contract_cancel_days_high = 10;
    qa_contract_cancel_days_high = 5;
    freelancer_contract_cancel_days_low = 5;
    qa_contract_cancel_days_low = 3;
    freelancer_rf_payment_percentage = 50;

    project_worth_mark = 500;

    constructor(private _router: Router, private _service: MyService) {


    }

    ngOnInit() {
    }
}
