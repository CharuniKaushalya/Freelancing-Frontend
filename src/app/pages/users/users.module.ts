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
import { SkillModal } from './components/skill-modal/skill-modal.component';
import { EducationModal } from './components/edu-modal/edu-modal.component';
import { CountryPickerComponent } from './components/edu-modal/country-picker.component';

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
    CountryPickerModule.forRoot({
      baseUrl: '/assets/'
    })
  ],
  declarations: [
    Users,
    Profile,
    SkillModal,
    EducationModal,
    CountryPickerComponent,
  ],
  entryComponents: [
    SkillModal,
    EducationModal
  ],
})
export class UsersModule { }
