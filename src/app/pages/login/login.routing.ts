import { Routes, RouterModule } from '@angular/router';

import { Login } from './login.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  { path: 'user-type/:email/:name', component: UserTypeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
