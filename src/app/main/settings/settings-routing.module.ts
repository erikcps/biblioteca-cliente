import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListRoleComponent } from './list-role/list-role.component';
import { ListModuleComponent } from './list-module/list-module.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'list-roles',
      component: ListRoleComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'list-modules',
      component: ListModuleComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
