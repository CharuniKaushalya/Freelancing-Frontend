import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './users.routing';
import { Users } from './users.component';
import { Profile } from './components/profile/profile.component';
import { PopularApp } from './components/popularApp/popularApp.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    Users,
    Profile,
    PopularApp,
  ]
})
export class UsersModule {}
