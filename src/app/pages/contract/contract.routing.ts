import { Routes, RouterModule }  from '@angular/router';

import { Contract } from './contract.component';
import { MyContract } from './components/index/contract.component';
import { ContractView } from './components/view/contract_view.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Contract,
    children: [
      { path: 'mycontract', component: MyContract },
      { path: 'contract_view', component: ContractView },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
