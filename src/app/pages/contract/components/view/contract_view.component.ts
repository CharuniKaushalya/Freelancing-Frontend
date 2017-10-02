import {Component, OnInit} from '@angular/core';
import {MyService} from "../../../../theme/services/backend/service";
import {DataService} from "../../../../theme/services/data/data.service";
import {Router} from '@angular/router';

import {Contract} from "../../../../theme/models/contract";
import {ContractStatus} from "../../../../theme/models/contractStatus";
import {User} from "../../../../theme/models/user";

@Component({
    selector: 'contract_view',
    templateUrl: './contract_view.html',
    providers: [MyService]
})

export class ContractView implements OnInit {

    contractStream: string = "contracts";
    contractStatusStream: string = "ContractStatus";
    userstream: string = "Users";

    pending_contracts: Contract[] = [];
    active_contracts: Contract[] = [];
    completed_contracts: Contract[] = [];

    userType;
    userEmail;

    constructor(private _router: Router, private _service: MyService, private data: DataService) {

        this.userType = localStorage.getItem("user_type");
        this.userEmail = localStorage.getItem("email");

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
                contract.status = new ContractStatus();
                contract.client = new User();
                contract.freelancer = new User();

                this._service.listStreamKeyItems(this.userstream, contract.client_email).then(data => {
                    if(data[0] != undefined)
                        contract.client = JSON.parse(this._service.Hex2String(data[0].data.toString()));

                    this._service.listStreamKeyItems(this.userstream, contract.freelancer_email).then(data => {
                        if(data[0] != undefined)
                            contract.freelancer = JSON.parse(this._service.Hex2String(data[0].data.toString()));
                    });
                });

                this._service.listStreamKeyItems(this.contractStatusStream, element.txid).then(element => {
                    let lastStatus = element[element.length - 1];
                    let contract_status = JSON.parse(this._service.Hex2String(lastStatus.data.toString()));
                    contract.status = contract_status;
                    //contract.status.current_milestone_name = this.getCurrentMilestoneName(contract.milestones, contract_status.current_milestone);
                    //contract.status.progress = this.getProgress(contract.milestones, contract.milestoneValues, contract_status);

                    if((this.userType == "Client" && contract.client_email == this.userEmail) ||
                        (contract.type == this.userType && contract.freelancer_email == this.userEmail)) {
                        if (contract_status.status == "Pending" || contract_status.status == "Confirmed") {
                            console.log(contract);
                            this.pending_contracts.unshift(contract);

                        } else if (contract_status.status == "Active") {
                            this.active_contracts.unshift(contract);

                        } else if (contract_status.status == "Completed") {
                            this.completed_contracts.unshift(contract);
                        }
                    }
                    console.log("CONT");
                    console.log(this.pending_contracts);
                });
            });
        });
    }

    ngOnInit() {
    }

    // getCurrentMilestoneName(milestones: number, currentMilestone: number): string {
    //     let name = 'Milestone_';
    //
    //     if (currentMilestone == milestones + 1) {
    //         if (milestones == 0) {
    //             name = 'Working';
    //
    //         } else {
    //             name = 'Finalizing';
    //         }
    //     } else {
    //         name = name + currentMilestone.toString();
    //     }
    //     return name;
    // }

    // getProgress(milestones: number, milestoneValues: any, status: ContractStatus): number {
    //     let progress = 0;
    //
    //     if (milestones + 1 == status.current_milestone && status.milestone_state == 'C') {
    //         progress = 100;
    //
    //     } else {
    //         for (let i = 0; i < status.current_milestone - 1; i++) {
    //             progress += Number(milestoneValues[i].value);
    //         }
    //     }
    //     return progress;
    // }

    getSelectedContract(id: string): Contract {
        return (this.active_contracts.concat(this.completed_contracts.concat(this.pending_contracts))).find(x => x.contract_id === id);
    }

    cancelContract(id: string): void {


        let contract = this.getSelectedContract(id);

        this.changeContractStatus(id, "Cancelled");
        this.pending_contracts = this.pending_contracts.filter(function(cnt) {
            return cnt.contract_id !== id;
        });

        if(contract.status.contract_link != null) {
            this._service.listStreamKeyItems(this.contractStatusStream, contract.status.contract_link).then(element => {
                let linked_contract_status = JSON.parse(this._service.Hex2String((element[element.length - 1]).data.toString()));

                this.changeStateOfLinkedContract(linked_contract_status, "Cancelled");

                console.log(this.getSelectedContract(linked_contract_status.contract_id));
                if(this.getSelectedContract(linked_contract_status.contract_id) != undefined) {
                    this.pending_contracts = this.pending_contracts.filter(function(cnt) {
                        return cnt.contract_id !== linked_contract_status.contract_id;
                    });
                }
                console.log("Contract Cancelled");
            });
            if(this.userType == "Client")
                $('#myModal').modal('show');
        }
    }

    confirmContract(id: string): void {
        let contract = this.getSelectedContract(id);

        if(contract.status.contract_link == null) {
            this.changeContractStatus(id, "Active");
            this.active_contracts.push(contract);
            this.pending_contracts = this.pending_contracts.filter(function(cnt) {
                return cnt.contract_id !== id;
            });

        } else {
            this._service.listStreamKeyItems(this.contractStatusStream, contract.status.contract_link).then(element => {
                let linked_contract_status = JSON.parse(this._service.Hex2String((element[element.length - 1]).data.toString()));

                console.log(linked_contract_status);
                if(linked_contract_status.status == "Pending") {
                    this.changeContractStatus(id, "Confirmed");
                    contract.status.status = "Confirmed";

                } else if(linked_contract_status.status == "Confirmed") {
                    this.changeContractStatus(id, "Active");

                    contract.status.status = "Active";
                    this.active_contracts.push(contract);
                    this.pending_contracts = this.pending_contracts.filter(function(cnt) {
                        return cnt.contract_id !== id;
                    });
                    this.changeStateOfLinkedContract(linked_contract_status, "Active");

                } else if(linked_contract_status.status == "Cancelled") {

                }
            });
        }
    }

    changeContractStatus(id: string, state: string): void {
        let key = id;
        let contractStatus = this.getSelectedContract(id).status;

        /* setting the contract state attributes */
        contractStatus.status = state;

        if(state == "Active") {
            contractStatus.current_milestone = 1;
            contractStatus.milestone_state = "Uncompleted";
        }

        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        console.log(contractStatusJSON);

        let data_hex = this._service.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log("Contract status saved");
            console.log(data);
        });
    }

    changeStateOfLinkedContract(contractStatus: ContractStatus, state: string): void {
        let key = contractStatus.contract_id;

        /* setting the contract state attributes */
        if(state == "Active") {
            contractStatus.status = state;
            contractStatus.current_milestone = 1;
            contractStatus.milestone_state = "Uncompleted";

        } else {
            contractStatus.status = state;
        }
        /* saving contract state to the blockchain */
        let contractStatusJSON = JSON.stringify(contractStatus);
        console.log(contractStatusJSON);

        let data_hex = this._service.String2Hex(contractStatusJSON);

        this._service.publishToStream(this.contractStatusStream, key, data_hex).then(data => {
            console.log("Linked contract status saved");
            console.log(data);
        });
    }

    goToContract(id: string) {
        let contract = this.getSelectedContract(id);
        this.data.saveData(contract);
        let link = ['/pages/contract/contract_details', id];
        this._router.navigate(link);
    }
}
