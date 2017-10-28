import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { CountryPickerModule } from 'angular2-countrypicker';

import { routing } from './users.routing';
import { Users } from './users.component';
import { Profile } from './components/profile/profile.component';
import { Wallet } from './components/wallet/wallet.component';
import { MyUsers } from './components/users/user.component';
import { SkillModal } from './components/skill-modal/skill-modal.component';
import { EducationModal } from './components/edu-modal/edu-modal.component';
import { CountryPickerComponent } from './components/edu-modal/country-picker.component';
import { PortfolioModal } from './components/proj-modal/proj-modal.component';
import { WorkModal } from './components/work-modal/work-modal.component';
import { PaymentModal } from './components/payment-modal/payment.component';

import {RatingModule} from "ng2-rating";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    routing,
    NgbDropdownModule,
    NgbModalModule,
    TagInputModule,
    RatingModule,
    CountryPickerModule.forRoot({
      baseUrl: '/assets/'
    })
  ],
  declarations: [
    Users,
    Profile,
    Wallet,
    SkillModal,
    EducationModal,
    CountryPickerComponent,
    PortfolioModal,
    WorkModal,
    MyUsers,
    PaymentModal
  ],
  entryComponents: [
    SkillModal,
    EducationModal,    
    PortfolioModal,
    WorkModal,
    PaymentModal
  ],
})
export class UsersModule { }
