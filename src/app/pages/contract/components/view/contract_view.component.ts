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

    contracts: Contract[] = [];
    contractStatusList: ContractStatus[] = [];
    completeBtn = true;
    redoBtn = false;
    paidBtn = false;
    paymentConfirmBtn = false;

    constructor(private _router: Router, private _service: MyService, private data: DataService) {

        _service.listStreamItems(this.contractStatusStream).then(data => {
            data.forEach(element => {
                let status = JSON.parse(this.Hex2String(element.data.toString()));
                this.contractStatusList.push(status);
            });
            console.log(this.contractStatusList);
        });

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
                contract.contract_id = element.txid;
                contract.client = element.publishers[0];

                // this._service.listStreamKeyItems(this.contractStatusStream, element.txid).then(data => {
                //     // let status = JSON.parse(this.Hex2String(data.toString()));
                //     console.log(data);
                // });

                contract.status = 0;
                this.contracts.push(contract);
            });
            this.contracts = this.contracts.reverse();
            console.log(this.contracts);
        });
    }

    ngOnInit() {
    }

    getSelectedContract(id: string): Contract {
        return this.contracts.find(x => x.contract_id === id);
    }

    // updateStatus(id: string): void {
    //     let contract = this.getSelectedContract(id);
    //     let milestones = contract.milestoneValues;
    //     contract.status = Number(contract.status) + 20;
    // }

    // getCurrentStatusOfContract(id: string): ContractStatus{
    //     let status = new ContractStatus();
    //     let key = id;
    //     let statusList = this.contractStatus.filter(x => x.contract_id === id);
    //     return status;
    // }

    saveContractStatus(id: string, ms: string) {
        let key = id;
        let contractStatus = new ContractStatus();

        /* setting the contract state attributes */
        contractStatus.contract_id = key;
        contractStatus.current_milestone = 1;
        contractStatus.milestone_state = ms;

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        console.log(contractStatusJSON);

        let data_hex = this.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log("Contract status saved");
            console.log(data);
        });
    }

    completeBtnClicked(id: string): void {
        this.completeBtn = false;
        this.redoBtn = true;
        this.paidBtn = true;
        this.saveContractStatus(id, 'W');
    }

    redoBtnClicked(id: string): void {
        this.completeBtn = true;
        this.redoBtn = false;
        this.paidBtn = false;
        this.saveContractStatus(id, 'W');
    }

    paidBtnClicked(id: string): void {
        this.redoBtn = false;
        this.paidBtn = false;
        this.paymentConfirmBtn = true;
        this.saveContractStatus(id, 'P');
    }

    paymentConfirmBtnClicked(id: string): void {
        this.paymentConfirmBtn = false;
        this.completeBtn = true;
    }

    goToContract(id: string) {
        let contract = this.getSelectedContract(id);
        this.data.saveData(contract);
        let link = ['/pages/contract/contract_details', id];
        this._router.navigate(link);
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

    String2Hex(str: string) {
        let hex, i;
        let result = "";
        for (i = 0; i < str.length; i++) {
            hex = str.charCodeAt(i).toString(16);
            result += ("000" + hex).slice(-4);
        }
        return result;
    }
}
