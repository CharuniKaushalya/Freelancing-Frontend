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

    public listOfObjects = [
    {
       name : 'Milestone_1',
       edit : false
    },
    {
       name : 'Milestone_2',
       edit : false
    },
    {
       name : 'Milestone_3',
       edit : false
    },
    {
       name : 'Milestone_4',
       edit : false
    },
    {
       name : 'Milestone_5',
       edit : false
    } 
  ];

    updateSelectedValue(event:string): void{

        var num = 0;
        var val = JSON.parse(event);

        for (num = 0; num < 5; num++) {
            if (num >= val) {
                this.listOfObjects[num].edit = false;
            }
            else {
                this.listOfObjects[num].edit = true;
            }
            console.log(num);
        }

    }
}
