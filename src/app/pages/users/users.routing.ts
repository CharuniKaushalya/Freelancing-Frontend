import { Routes, RouterModule }  from '@angular/router';

import { Users } from './users.component';
import { Profile } from './components/profile/profile.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Users,
    children: [
      { path: 'profile', component: Profile }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
