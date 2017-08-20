import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { TreeModule } from 'ng2-tree';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";

import { routing }       from './admin.routing';
import { Admin } from './admin.component';
import { Skill } from './components/skill/skill.component';
import { Users } from './components/users/users.component';
import { SmartTables } from './components/smartTables/smartTables.component';
import { SmartTablesService } from './components/smartTables/smartTables.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    TreeModule,
    routing,
    Ng2SmartTableModule,
    DataTableModule,
  ],
  declarations: [
    Admin,
    Skill,
    Users,
    SmartTables,
  ],
  providers: [
    SmartTablesService
  ]
})
export class AdminModule {}
