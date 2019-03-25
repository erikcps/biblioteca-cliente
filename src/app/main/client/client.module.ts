import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {  MatButtonModule, 
  MatCheckboxModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatIconModule, 
  MatSelectModule,
  MatStepperModule,
  MatRadioModule,
  MatPaginator,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatSnackBarModule,
} from '@angular/material';
import { MatDialogModule} from '@angular/material/dialog';

import { ClientRoutingModule } from './client-routing.module';
import { ListClientComponent } from './list-client/list-client.component';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClientRoutingModule,

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

    FuseSharedModule
  ],
  declarations: [
    ListClientComponent
  ]
})
export class ClientModule { }
