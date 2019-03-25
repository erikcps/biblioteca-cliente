import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGuaranteeComponent } from './list-guarantee/list-guarantee.component';
import { ListSentGuaranteeComponent } from './list-sent-guarantee/list-sent-guarantee.component';
import { ListRequestGuaranteeComponent } from './list-request-guarantee/list-request-guarantee.component';
import { ListInventoryGuaranteeComponent } from './list-inventory-guarantee/list-inventory-guarantee.component';
import { ListDeliveryGuaranteeComponent } from './list-delivery-guarantee/list-delivery-guarantee.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'list',
      component: ListGuaranteeComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'sent',
      component: ListSentGuaranteeComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'request',
      component: ListRequestGuaranteeComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'inventory',
      component: ListInventoryGuaranteeComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'delivery',
      component: ListDeliveryGuaranteeComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuaranteeRoutingModule { }
