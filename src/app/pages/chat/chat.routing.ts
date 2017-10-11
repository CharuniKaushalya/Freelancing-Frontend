import { Routes, RouterModule } from '@angular/router';

import { Chat } from './chat.component';
import { ChatView } from './components/view/chat_view.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Chat,
    children: [
      
      
      { path: 'chat_view/:contract_id', component: ChatView }

    ]
  }
];

export const routing = RouterModule.forChild(routes);