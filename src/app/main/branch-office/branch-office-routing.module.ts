import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBranchOfficeComponent } from './list-branch-office/list-branch-office.component';
import { CreateBranchOfficeComponent } from './create-branch-office/create-branch-office.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'list',
      component: ListBranchOfficeComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'create',
      component: CreateBranchOfficeComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchOfficeRoutingModule { }
