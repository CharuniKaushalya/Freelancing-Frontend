import {Component} from '@angular/core';
import { MyService } from  "../../../../theme/services/backend/service";
import {TreeModel} from 'ng2-tree';

@Component({
  selector: 'my-contract',
  templateUrl: './contract.html',
  providers :[MyService],
})

export class MyContract {

 	fromAddresses = null;
    toAddresses = null;
    selectedFromAddress = null;
    balances = null;
    permissions = "receive";

    constructor(private _service: MyService) { 
         _service.getaddresses().then(data => {
            console.log(data);
            this.fromAddresses = data;
            this._service.getaddressbalances(this.fromAddresses[0].address).then(data => {
                this.balances = data;
            });
        });
        _service.listpermissions(this.permissions,null).then(data => {
            console.log(data);
            this.toAddresses = data;
        });
        
    }
    onClickFromAddress(address : string){
        this._service.getaddressbalances(address).then(data => {
            this.balances = data;
        });
    }

}
