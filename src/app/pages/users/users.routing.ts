import { Routes, RouterModule }  from '@angular/router';

import { Users } from './users.component';
import { Profile } from './components/profile/profile.component';
import { MyUsers } from './components/users/user.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Users,
    children: [
     	{ path: '', component: MyUsers },
      { path: 'profile', component: Profile },
      {	path: 'profile/:user_id', component: Profile}
    ]
  }
];

export const routing = RouterModule.forChild(routes);
