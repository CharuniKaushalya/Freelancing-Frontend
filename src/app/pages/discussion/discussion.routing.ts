import { Routes, RouterModule } from '@angular/router';

import { Discussion } from './discussion.component';
import { DiscussionView } from './components/view/discussion_view.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Discussion,
    children: [
      
      
      { path: 'discussion_view/:contract_id', component: DiscussionView }

    ]
  }
];

export const routing = RouterModule.forChild(routes);