import { Routes, RouterModule } from '@angular/router';

import { Work } from './work.component';
import { MyWork } from './components/work/work.component';
import { MyProjects } from './components/project/project.component';
import { ProjectNew } from './components/project_new/project_new.component';
import { ProjectDetails } from './components/project_detail/project_details.component';
import { PostedProjects } from './components/post-projects/post_project.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Work,
    children: [
      { path: 'my_projects', component: MyProjects },
      { path: 'project_new', component: ProjectNew },
      { path: 'project_details/:project_id', component: ProjectDetails },
      { path: 'my_work', component: MyWork },
      { path: 'posted_projects', component: PostedProjects },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
