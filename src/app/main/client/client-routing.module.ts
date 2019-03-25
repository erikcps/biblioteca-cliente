import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListClientComponent } from './list-client/list-client.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'list',
      component: ListClientComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
