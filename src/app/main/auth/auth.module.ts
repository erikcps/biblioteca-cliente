import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { RegisterComponent } from './register/register.component';

import { FuseSharedModule } from '@fuse/shared.module';

import {  MatButtonModule, 
          MatCheckboxModule, 
          MatFormFieldModule, 
          MatInputModule, 
          MatIconModule, 
          MatSelectModule,
          MatStepperModule,
          MatRadioModule,
          MatGridListModule,
          MatSnackBarModule
  } from '@angular/material';

@NgModule({
  imports: [
    FormsModule,      
    CommonModule,
    AuthRoutingModule,

    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatIconModule,
    MatRadioModule,
    MatGridListModule,
    MatSnackBarModule,

    FuseSharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    SignInComponent, 
    SignOutComponent, 
    RegisterComponent
  ]
})
export class AuthModule { }
