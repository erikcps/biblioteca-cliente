import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchOfficeRoutingModule } from './branch-office-routing.module';
import { ListBranchOfficeComponent } from './list-branch-office/list-branch-office.component';
import { FormsModule } from '@angular/forms';

import {  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatIconModule, 
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatSnackBarModule,
} from '@angular/material';

import { MatDialogModule} from '@angular/material/dialog';

import { CreateBranchOfficeComponent } from './create-branch-office/create-branch-office.component';
import { FuseProgressBarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BranchOfficeRoutingModule,

    MatButtonModule,
    MatPaginatorModule, 
    MatProgressSpinnerModule, 
    MatSortModule, 
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatSnackBarModule,

    FuseProgressBarModule,
    FuseSharedModule
  ],
  declarations: [
    ListBranchOfficeComponent, 
    CreateBranchOfficeComponent
  ]
})
export class BranchOfficeModule { }
