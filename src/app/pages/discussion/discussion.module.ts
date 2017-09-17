import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { TreeModule } from 'ng2-tree';

import { routing } from './discussion.routing';
import { Discussion } from './discussion.component';
import { DiscussionView } from './components/view/discussion_view.component';

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
    Discussion,
    DiscussionView
  ],
  providers: [
    DataService
  ]
})
export class DiscussionModule { }
