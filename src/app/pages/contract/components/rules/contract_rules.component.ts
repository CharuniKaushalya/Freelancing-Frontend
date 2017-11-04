import {Component, OnInit} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {Router} from '@angular/router';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

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
    userType = '';

    error = false;
    error_msg = '';

    public form: FormGroup;
    public freelancer_rf_payment: AbstractControl;
    public freelancer_pay_reduce: AbstractControl;
    public qa_pay_reduce: AbstractControl;
    public project_worth_mark: AbstractControl;
    public freelancer_contract_cancel_high: AbstractControl;
    public freelancer_contract_cancel_low: AbstractControl;
    public qa_contract_cancel_high: AbstractControl;
    public qa_contract_cancel_low: AbstractControl;

    constructor(private _router: Router, private _service: MyService, fb: FormBuilder) {

        this.userType = localStorage.getItem("userType");

        _service.listStreamItems(this.contractRulesStream).then(data => {
            this.contractRulesModel = JSON.parse(this._service.Hex2String(data[data.length - 1].data));
        });

        this.form = fb.group({
            'freelancer_rf_payment': ['', Validators.compose([Validators.required])],
            'freelancer_pay_reduce': ['', Validators.compose([Validators.required])],
            'qa_pay_reduce': ['', Validators.compose([Validators.required])],
            'project_worth_mark': ['', Validators.compose([Validators.required])],
            'freelancer_contract_cancel_high': ['', Validators.compose([Validators.required])],
            'freelancer_contract_cancel_low': ['', Validators.compose([Validators.required])],
            'qa_contract_cancel_high': ['', Validators.compose([Validators.required])],
            'qa_contract_cancel_low': ['', Validators.compose([Validators.required])]
        });

        this.freelancer_rf_payment = this.form.controls['freelancer_rf_payment'];
        this.freelancer_pay_reduce = this.form.controls['freelancer_pay_reduce'];
        this.qa_pay_reduce = this.form.controls['qa_pay_reduce'];
        this.project_worth_mark = this.form.controls['project_worth_mark'];
        this.freelancer_contract_cancel_high = this.form.controls['freelancer_contract_cancel_high'];
        this.freelancer_contract_cancel_low = this.form.controls['freelancer_contract_cancel_low'];
        this.qa_contract_cancel_high = this.form.controls['qa_contract_cancel_high'];
        this.qa_contract_cancel_low = this.form.controls['qa_contract_cancel_low'];
    }

    ngOnInit() {
    }

    onSubmit(values: Object): void {

        this.validate();

        if (this.form.valid && !this.error) {
            let key = localStorage.getItem("email");

            let contractRulesJSON = JSON.stringify(this.contractRulesModel);
            console.log(this.contractRulesModel);

            let data_hex = this._service.String2Hex(contractRulesJSON);
            this._service.publishToStream(this.contractRulesStream, key, data_hex).then(data => {
                console.log(data);
                console.log("Contract Rules Saved");
                this.error_msg = '';
            });
        } else {
            console.log("Error");
        }
    }

    validate(): void {

        this.error = false;
        if ((this.contractRulesModel.freelancer_rf_payment_percentage > 60) || (this.contractRulesModel.freelancer_rf_payment_percentage < 40)) {
            this.error = true;
            this.error_msg = "Freelancer payment reduce percentage when all redo's fail, should be between 40 & 60 days";
        }

        if ((this.contractRulesModel.freelancer_pay_reduce_percentage > 8) || (this.contractRulesModel.freelancer_pay_reduce_percentage < 2)) {
            this.error = true;
            this.error_msg = "Freelancer payment reduce percentage when fail to meet a deadline, should be between 2% & 8%";
        }

        if ((this.contractRulesModel.qa_pay_reduce_percentage > 8) || (this.contractRulesModel.qa_pay_reduce_percentage < 2)) {
            this.error = true;
            this.error_msg = "QA payment reduce percentage when fail to meet a deadline, should be between 2% & 8%";
        }

        if ((this.contractRulesModel.project_worth_mark > 800) || (this.contractRulesModel.project_worth_mark < 200)) {
            this.error = true;
            this.error_msg = "Projects value boundary should be between $200 & $800";
        }

        if ((this.contractRulesModel.freelancer_contract_cancel_days_high > 20) || (this.contractRulesModel.freelancer_contract_cancel_days_high < 5)) {
            this.error = true;
            this.error_msg = "Days to wait before cancelling a high value freelancer contract should be between 5 & 20 days";
        }

        if ((this.contractRulesModel.freelancer_contract_cancel_days_low > 10) || (this.contractRulesModel.freelancer_contract_cancel_days_low < 2)) {
            this.error = true;
            this.error_msg = "Days to wait before cancelling a low value freelancer contract should be between 2 & 10 days";
        }

        if ((this.contractRulesModel.qa_contract_cancel_days_high > 10) || (this.contractRulesModel.qa_contract_cancel_days_high < 2)) {
            this.error = true;
            this.error_msg = "Days to wait before cancelling a high value QA contract should be between 2 & 10 days";
        }

        if ((this.contractRulesModel.qa_contract_cancel_days_low > 7) || (this.contractRulesModel.qa_contract_cancel_days_low < 1)) {
            this.error = true;
            this.error_msg = "Days to wait before cancelling a low value QA contract should be between 1 & 7 days";
        }
    }

    resetDefaults(): void {
        this.contractRulesModel.redo = 3;
        this.contractRulesModel.freelancer_rf_payment_percentage = 50;
        this.contractRulesModel.freelancer_pay_reduce_percentage = 5;
        this.contractRulesModel.qa_pay_reduce_percentage = 5;
        this.contractRulesModel.project_worth_mark = 500;
        this.contractRulesModel.freelancer_contract_cancel_days_high = 10;
        this.contractRulesModel.qa_contract_cancel_days_high = 5;
        this.contractRulesModel.freelancer_contract_cancel_days_low = 5;
        this.contractRulesModel.qa_contract_cancel_days_low = 3;

        this.error = false;
        this.error_msg = '';
    }

    goBack() {
        window.history.back();
    }
}
