import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRoutingModule } from './loan-routing.module';
import { CreateLoanComponent } from './create-loan/create-loan.component';
import { ListLoanComponent } from './list-loan/list-loan.component';
import { FormsModule } from '@angular/forms';
import { FuseSharedModule } from '@fuse/shared.module';

import {  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatIconModule, 
  MatSelectModule,
  MatStepperModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatTabsModule,
  MatMenuModule,
} from '@angular/material';
import { MatDialogModule} from '@angular/material/dialog';
import { DetailLoanComponent } from './detail-loan/detail-loan.component';
import { DetailLoanService } from './detail-loan/detail-loan.service';
import { PayAmortizationLoanComponent } from './pay-amortization-loan/pay-amortization-loan.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoanRoutingModule,

    MatPaginatorModule, 
    MatProgressSpinnerModule, 
    MatSortModule, 
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatStepperModule,
    MatSnackBarModule,
    MatTabsModule,
    MatMenuModule,

    FuseSharedModule,
  ],
  declarations: [
    CreateLoanComponent, 
    ListLoanComponent, 
    DetailLoanComponent, 
    PayAmortizationLoanComponent
  ],
  providers   : [
    DetailLoanService
  ]
})
export class LoanModule { }
