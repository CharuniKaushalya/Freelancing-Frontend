import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { TreeModule } from 'ng2-tree';

import { routing } from './contract.routing';
import { Contract } from './contract.component';
import { MyContract } from './components/index/contract.component';
import { ContractView } from './components/view/contract_view.component';
import { ContractDetails } from './components/detail/contract_details.component';
import { ContractRules } from './components/rules/contract_rules.component';

import { DataService } from "../../theme/services/data/data.service";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    TreeModule,
    routing
  ],
  declarations: [
    Contract,
    MyContract,
    ContractView,
    ContractDetails,
    ContractRules
  ],
  providers: [
    DataService
  ]
})
export class ContractModule { }
