import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { CreateModuleComponent } from './create-module/create-module.component';
import { ListModuleComponent } from './list-module/list-module.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule} from '@angular/material/dialog';

import {  MatButtonModule, 
  MatCheckboxModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatIconModule, 
  MatSelectModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatSnackBarModule,
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,

    //MATERIAL
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule, 
    MatProgressSpinnerModule, 
    MatSortModule, 
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,

    FuseSharedModule
  ],
  declarations: [
    CreateRoleComponent, 
    ListRoleComponent, 
    CreateModuleComponent, 
    ListModuleComponent
  ],
  entryComponents: [
    CreateRoleComponent,
    CreateModuleComponent, 
  ]
})
export class SettingsModule { }
