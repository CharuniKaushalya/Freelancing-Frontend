import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';


import { routing }       from './users.routing';
import { Users } from './users.component';
import { Profile } from './components/profile/profile.component';
import { SkillModal } from './components/skill-modal/skill-modal.component';
import { EducationModal } from './components/edu-modal/edu-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    NgbDropdownModule,
    NgbModalModule,
    TagInputModule
  ],
  declarations: [
    Users,
    Profile,
    SkillModal,
    EducationModal,
  ],
  entryComponents: [
    SkillModal,
    EducationModal
  ],
})
export class UsersModule {}
