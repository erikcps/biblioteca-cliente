import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuaranteeRoutingModule } from './guarantee-routing.module';
import { ListGuaranteeComponent } from './list-guarantee/list-guarantee.component';
import { FormsModule } from '@angular/forms';

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

import { FuseSharedModule } from '@fuse/shared.module';
import { ListSentGuaranteeComponent } from './list-sent-guarantee/list-sent-guarantee.component';
import { ListRequestGuaranteeComponent } from './list-request-guarantee/list-request-guarantee.component';
import { ListInventoryGuaranteeComponent } from './list-inventory-guarantee/list-inventory-guarantee.component';
import { ListDeliveryGuaranteeComponent } from './list-delivery-guarantee/list-delivery-guarantee.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GuaranteeRoutingModule,

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

    FuseSharedModule
  ],
  declarations: [
    ListGuaranteeComponent,
    ListSentGuaranteeComponent,
    ListRequestGuaranteeComponent,
    ListInventoryGuaranteeComponent,
    ListDeliveryGuaranteeComponent
  ]
})
export class GuaranteeModule { }
