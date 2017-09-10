import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },

  {
    path: 'discussion',
    loadChildren: 'app/pages/discussion/discussion.module#DiscussionModule' 
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'components', loadChildren: './components/components.module#ComponentsModule' },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
      { path: 'users', loadChildren: './users/users.module#UsersModule' },
      { path: 'contract', loadChildren: './contract/contract.module#ContractModule' },
      { path: 'work', loadChildren: './work/work.module#WorkModule' }

    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
