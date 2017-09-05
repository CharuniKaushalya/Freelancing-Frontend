import { Routes, RouterModule } from '@angular/router';

import { Admin } from './admin.component';
import { Skill } from './components/skill/skill.component';
import { Users } from './components/users/users.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'skill', component: Skill },
      { path: 'users', component: Users }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
