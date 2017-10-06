import { Component, OnInit } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { DataService } from "../../../../theme/services/data/data.service";
import { Router } from '@angular/router';

import { Contract } from "../../../../theme/models/contract";
import { ContractStatus } from "../../../../theme/models/contractStatus";
import { ProjectStatus } from "../../../../theme/models/projectStatus";
import { User } from "../../../../theme/models/user";

@Component({
    selector: 'contract_view',
    templateUrl: './contract_view.html',
    providers: [MyService]
})

export class ContractView implements OnInit {

    contractStream: string = "contracts";
    contractStatusStream: string = "ContractStatus";
    userstream: string = "Users";
    projectStatusStream: string = "ProjectStatus";
    projectStream: string = "projects";

    pending_contracts: Contract[] = [];
    active_contracts: Contract[] = [];
    completed_contracts: Contract[] = [];

    userType;
    userEmail;

    constructor(private _router: Router, private _service: MyService, private data: DataService) {

        this.userType = localStorage.getItem("userType");
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
                    if (data[data.length - 1] != undefined)
                        contract.client = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));

                    this._service.listStreamKeyItems(this.userstream, contract.freelancer_email).then(data => {
                        if (data[data.length - 1] != undefined)
                            contract.freelancer = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                    });
                });

                this._service.listStreamKeyItems(this.contractStatusStream, element.txid).then(element => {
                    let lastStatus = element[element.length - 1];
                    let contract_status = JSON.parse(this._service.Hex2String(lastStatus.data.toString()));
                    contract.status = contract_status;

                    if ((this.userType == "Client" && contract.client_email == this.userEmail) ||
                        (contract.type == this.userType && contract.freelancer_email == this.userEmail)) {
                        if (contract_status.status == "Pending" || contract_status.status == "Confirmed") {
                            console.log(contract);
                            this.pending_contracts.unshift(contract);

                        } else if (contract_status.status == "Active") {
                            contract.status.current_milestone_name =
                                this.getCurrentMilestoneName(contract.milestones, contract_status.current_milestone, contract_status.milestone_state);
                            contract.status.progress = this.getProgress(contract.milestones, contract.milestoneValues, contract_status);
                            this.active_contracts.unshift(contract);

                        } else if (contract_status.status == "Completed") {
                            this.completed_contracts.unshift(contract);
                        }
                    }
                });
            });
        });
    }

    ngOnInit() {
    }

    getCurrentMilestoneName(milestones: number, currentMilestone: number, milestoneState: string): string {

        if (currentMilestone == 1 && milestoneState == "Uncompleted") {
            return "Work not started"

        } else if (currentMilestone == 1 && milestones == 0) {
            return 'Working';

        } else if (currentMilestone == milestones + 1) {
            return 'Finalizing';

        } else {
            return 'Milestone_' + currentMilestone;
        }
    }

    getProgress(milestones: number, milestoneValues: any, status: ContractStatus): number {
        let progress = 0;

        for (let i = 0; i < status.current_milestone - 1; i++) {
            progress += Number(milestoneValues[i].value);
        }
        return progress;
    }

    getSelectedContract(id: string): Contract {
        return (this.active_contracts.concat(this.completed_contracts.concat(this.pending_contracts))).find(x => x.contract_id === id);
    }

    cancelContract(id: string): void {


        let contract = this.getSelectedContract(id);

        this.changeContractStatus(id, "Cancelled");
        this.pending_contracts = this.pending_contracts.filter(function (cnt) {
            return cnt.contract_id !== id;
        });

        if (contract.status.contract_link != null) {
            this._service.listStreamKeyItems(this.contractStatusStream, contract.status.contract_link).then(element => {
                let linked_contract_status = JSON.parse(this._service.Hex2String((element[element.length - 1]).data.toString()));

                this.changeStateOfLinkedContract(linked_contract_status, "Cancelled");

                console.log(this.getSelectedContract(linked_contract_status.contract_id));
                if (this.getSelectedContract(linked_contract_status.contract_id) != undefined) {
                    this.pending_contracts = this.pending_contracts.filter(function (cnt) {
                        return cnt.contract_id !== linked_contract_status.contract_id;
                    });
                }
                console.log("Contract Cancelled");
            });
            if (this.userType == "Client")
                $('#myModal').modal('show');
        }
    }

    setNewStatusForActivatedContracts(contract: Contract) {

        contract.status.status = "Active";
        contract.status.current_milestone = 1;
        contract.status.milestone_state = "Uncompleted";

        contract.status.current_milestone_name =
            this.getCurrentMilestoneName(contract.milestones, contract.status.current_milestone, contract.status.milestone_state);
        contract.status.progress = this.getProgress(contract.milestones, contract.milestoneValues, contract.status);
        this.active_contracts.push(contract);
    }

    confirmContract(id: string): void {
        let contract = this.getSelectedContract(id);
        this._service.listStreamKeyItems(this.projectStream, contract.projectName).then(p => {

            if (p[p.length - 1] != undefined) {
                let project_id = p[p.length - 1].txid;
                if (contract.status.contract_link == null) {
                    this.changeContractStatus(id, "Active");
                    this.setNewStatusForActivatedContracts(contract);
                    this.pending_contracts = this.pending_contracts.filter(function (cnt) {
                        return cnt.contract_id !== id;
                    });
                    this.updateProjectStatus(project_id, "Closed");

                } else {
                    this._service.listStreamKeyItems(this.contractStatusStream, contract.status.contract_link).then(element => {
                        let linked_contract_status = JSON.parse(this._service.Hex2String((element[element.length - 1]).data.toString()));

                        console.log(linked_contract_status);
                        if (linked_contract_status.status == "Pending") {
                            this.changeContractStatus(id, "Confirmed");
                            contract.status.status = "Confirmed";

                        } else if (linked_contract_status.status == "Confirmed") {
                            this.changeContractStatus(id, "Active");

                            contract.status.status = "Active";
                            this.setNewStatusForActivatedContracts(contract);
                            this.pending_contracts = this.pending_contracts.filter(function (cnt) {
                                return cnt.contract_id !== id;
                            });
                            this.changeStateOfLinkedContract(linked_contract_status, "Active");
                            this.updateProjectStatus(project_id, "Closed");


                        } else if (linked_contract_status.status == "Cancelled") {

                        }
                    });
                }
            }
        });
    }

    changeContractStatus(id: string, state: string): void {
        let key = id;
        let contractStatus = this.getSelectedContract(id).status;

        /* setting the contract state attributes */
        contractStatus.status = state;

        if (state == "Active") {
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

    updateProjectStatus(id: string, status: string) {
        let projectStatus: ProjectStatus = new ProjectStatus();
        projectStatus.project_id = id;
        projectStatus.status = status;
        projectStatus.user_email = localStorage.getItem("email");

        let statusJSON = JSON.stringify(projectStatus);
        let data_hex = this._service.String2Hex(statusJSON);

        this._service.publishToStream(this.projectStatusStream, projectStatus.project_id, data_hex).then(data => {
            console.log(projectStatus.status + "saved");
        }).catch(error => {
            console.log(error.message);
        });
    }

    changeStateOfLinkedContract(contractStatus: ContractStatus, state: string): void {
        let key = contractStatus.contract_id;

        /* setting the contract state attributes */
        if (state == "Active") {
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

    goToDisscussion(id: string) {
        let contract = this.getSelectedContract(id);
        this.data.saveData(contract);
        let link = ['/pages/discussion/discussion_view', id];
        this._router.navigate(link);
    }
}
