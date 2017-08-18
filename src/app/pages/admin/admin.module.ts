import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { TreeModule } from 'ng2-tree';

import { routing }       from './admin.routing';
import { Admin } from './admin.component';
import { Skill } from './components/skill/skill.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    TreeModule,
    routing
  ],
  declarations: [
    Admin,
    Skill,
  ]
})
export class AdminModule {}
