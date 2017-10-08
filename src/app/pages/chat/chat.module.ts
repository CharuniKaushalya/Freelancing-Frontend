import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { TreeModule } from 'ng2-tree';

import { routing } from './chat.routing';
import { Chat } from './chat.component';
import { ChatView } from './components/view/chat_view.component';

import { DataService } from "../../theme/services/data/data.service";
import { AF } from '../../providers/af';

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
    Chat,
    ChatView
  ],
  providers: [
    DataService,
    AF,
    
  ]
})
export class ChatModule { }
