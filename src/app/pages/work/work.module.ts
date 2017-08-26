import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { TreeModule } from 'ng2-tree';

import { routing } from './work.routing';
import { Work } from './work.component';
import { MyWork } from './components/work/work.component';
import { MyProjects } from './components/project/project.component';
import { ProjectNew } from './components/project_new/project_new.component';
import { ProjectDetails } from './components/project_detail/project_details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    TreeModule,
    routing
  ],
  declarations: [
    Work,
    MyWork,
    MyProjects,
    ProjectNew,
    ProjectDetails
  ]
})
export class WorkModule { }
