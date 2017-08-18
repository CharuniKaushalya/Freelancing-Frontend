import { Routes, RouterModule }  from '@angular/router';

import { Admin } from './admin.component';
import { Skill } from './components/skill/skill.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'skill', component: Skill }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
