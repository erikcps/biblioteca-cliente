import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignOutComponent } from './sign-out/sign-out.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'register',
      component: RegisterComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'sign-in',
      component: SignInComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'sign-out',
      component: SignOutComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }