import { Routes, RouterModule } from '@angular/router';

import { DocumentationComponent } from './docs.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: DocumentationComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
