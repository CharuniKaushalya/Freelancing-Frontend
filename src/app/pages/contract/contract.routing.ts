import { Routes, RouterModule } from '@angular/router';

import { Contract } from './contract.component';
import { MyContract } from './components/index/contract.component';
import { ContractView } from './components/view/contract_view.component';
import { ContractDetails } from './components/detail/contract_details.component';
import { ContractRules } from './components/rules/contract_rules.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Contract,
    children: [
      { path: 'mycontract/:fBid/:qaBid', component: MyContract },
      { path: 'contract_view', component: ContractView },
      { path: 'contract_details/:contract_id', component: ContractDetails },
      { path: 'contract_rules', component: ContractRules },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
