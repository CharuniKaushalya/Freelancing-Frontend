import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {MyService} from  "../../../../theme/services/backend/service";

import {TreeModel} from 'ng2-tree';
import {Router} from '@angular/router';

import {Contract} from "../../../../theme/models/contract";

@Component({
    selector: 'my-contract',
    templateUrl: './contract.html',
    providers: [MyService],
})

export class MyContract {

    public form: FormGroup;
    public projectName: AbstractControl;
    public type: AbstractControl;
    // public client: AbstractControl;
    // public freelancer: AbstractControl;
    public deadline: AbstractControl;
    public amount: AbstractControl;
    public asset: AbstractControl;
    // public milestones: AbstractControl;
    public description: AbstractControl;

    public submitted: boolean = false;

    @Input() contract: Contract;
    contractStream: string = "contracts";

    fromAddresses = null;
    toAddresses = null;
    selectedFromAddress = null;
    balances = null;
    permissions = "receive";

    assets = ['USD', 'BTC'];
    contract_types = ['Developer', 'QA', 'Consultant'];
    no_of_milestone = ['0', '1', '2', '3', '4', '5'];
    milestone_init_values = ['50', '35', '25', '20', '15'];
    milestone_values = [];
    final_payment = '100%';

    public listOfObjects = [
        {
            name: 'Milestone_1',
            value: 0,
            edit: false
        },
        {
            name: 'Milestone_2',
            value: 0,
            edit: false
        },
        {
            name: 'Milestone_3',
            value: 0,
            edit: false
        },
        {
            name: 'Milestone_4',
            value: 0,
            edit: false
        },
        {
            name: 'Milestone_5',
            value: 0,
            edit: false
        }
    ];

    constructor(fb: FormBuilder, private _service: MyService) {

        _service.getaddresses().then(data => {
            console.log(data);
            this.fromAddresses = data;
            this._service.getaddressbalances(this.fromAddresses[0].address).then(data => {
                this.balances = data;
            });
        });
        _service.listpermissions(this.permissions, null).then(data => {
            console.log(data);
            this.toAddresses = data;
        });

        this.contract = new Contract();

        this.form = new FormGroup({
            milestones: new FormControl()
        });

        this.form = fb.group({
            'projectName': ['', Validators.compose([Validators.required])],
            'type': ['', Validators.compose([Validators.required])],
            // 'freelancer': ['', Validators.compose([Validators.required])],
            'deadline': ['', Validators.compose([Validators.required])],
            'amount': ['', Validators.compose([Validators.required])],
            'asset': ['', Validators.compose([Validators.required])],
            // 'milestones': ['', Validators.compose([Validators.required])],
            'description': ['', Validators.compose([Validators.required])]
        });

        this.projectName = this.form.controls['projectName'];
        this.type = this.form.controls['type'];
        // this.client = this.form.controls['freelancer'];
        // this.freelancer = this.form.controls['freelancer'];
        this.deadline = this.form.controls['deadline'];
        this.amount = this.form.controls['amount'];
        this.asset = this.form.controls['asset'];
        // this.milestones = this.form.controls['milestones'];
        this.description = this.form.controls['description'];
    }

    onClickFromAddress(address: string) {
        this._service.getaddressbalances(address).then(data => {
            this.balances = data;
        });
    }

    updateSelectedValue(event: string): void {

        let sum = 0;
        let val = JSON.parse(event);
        let percentage1 = String(Number(this.milestone_init_values[val - 1]) - 5);
        let percentage2 = String(this.milestone_init_values[val - 1]);
        let percentage3 = String(Number(this.milestone_init_values[val - 1]) + 5);
        this.milestone_values = [percentage1, percentage2, percentage3];

        for (let num = 0; num < 5; num++) {
            if (num >= val) {
                this.listOfObjects[num].edit = false;
                this.listOfObjects[num].value = 0;
            }
            else {
                if (this.listOfObjects[num].value != Number(percentage1) && this.listOfObjects[num].value != Number(percentage2)
                    && this.listOfObjects[num].value != Number(percentage3)) {
                    this.listOfObjects[num].value = 0;
                }
                this.listOfObjects[num].edit = true;
            }
            sum += Number(this.listOfObjects[num].value);
            console.log(num);
        }
        sum = 100 - sum;
        this.final_payment = String(sum + '%');
    }

    updateFinalPayment(event: string): void {
        let sum = 0;

        for (let num = 0; num < 5; num++) {

            sum += Number(this.listOfObjects[num].value);
            console.log(num);
        }
        sum = 100 - sum;
        this.final_payment = String(sum + '%');
    }

    public onSubmit(values: Object): void {
        this.submitted = true;
        console.log(values);

        let key = this.contract.projectName;
        let contractJSON = JSON.stringify(this.contract);
        console.log(contractJSON);

        let data_hex = this.String2Hex(contractJSON);
        console.log(data_hex);
        console.log(this.Hex2String(data_hex));

        this._service.publishToStream(this.contractStream, key, data_hex).then(data => {
            console.log("saved");
            console.log(data);

            // this._router.navigate(['projects'])
        });

    }

    String2Hex(str: string) {
        let hex, i;
        let result = "";
        for (i = 0; i < str.length; i++) {
            hex = str.charCodeAt(i).toString(16);
            result += ("000" + hex).slice(-4);
        }
        return result;
    }

    Hex2String(hex_str: string) {
        let j;
        let hexes = hex_str.match(/.{1,4}/g) || [];
        let result_back = "";
        for (j = 0; j < hexes.length; j++) {
            result_back += String.fromCharCode(parseInt(hexes[j], 16));
        }
        return result_back;
    }
}
