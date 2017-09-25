import { Routes, RouterModule } from '@angular/router';

import { Users } from './users.component';
import { Profile } from './components/profile/profile.component';
import { MyUsers } from './components/users/user.component';
import { Wallet } from './components/wallet/wallet.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Users,
    children: [
      { path: '', component: MyUsers },
      { path: 'profile/:user_id', component: Profile },
      { path: 'wallet/:user_id', component: Wallet }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
