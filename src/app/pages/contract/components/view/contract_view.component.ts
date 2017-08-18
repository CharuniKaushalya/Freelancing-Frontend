import {Component} from '@angular/core';
import { MyService } from  "../../../../theme/services/backend/service";

@Component({
  selector: 'contract_view',
  templateUrl: './contract_view.html',
  providers :[MyService]
})

export class ContractView {

 

  constructor() {
  }

}
