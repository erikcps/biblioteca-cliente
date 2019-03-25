import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLoanComponent } from './list-loan/list-loan.component';
import { CreateLoanComponent } from './create-loan/create-loan.component';
import { DetailLoanComponent } from './detail-loan/detail-loan.component';
import { DetailLoanService } from './detail-loan/detail-loan.service';
import { PayAmortizationLoanComponent } from './pay-amortization-loan/pay-amortization-loan.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'list',
      component: ListLoanComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'create',
      component: CreateLoanComponent
    }]
  },
  {
    path: '',
    children: [{
      path: ':id/details',
      component: DetailLoanComponent,
      resolve  : {
        data: DetailLoanService
      }
    }]
  },
  {
    path: '',
    children: [{
      path: 'amortization',
      component: PayAmortizationLoanComponent,
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
