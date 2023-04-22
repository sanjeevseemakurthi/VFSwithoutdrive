import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { CreatenewuserComponent } from './createnewuser/createnewuser.component';
import { HomeComponent } from './home/home.component';
import { AuthtokenGuard } from './authtoken.guard';

const routes: Routes = [

  {
    path: 'index',
    component: HomeComponent,
    canActivate: [AuthtokenGuard]
  },
  {
    path: 'newuser',
    component: CreatenewuserComponent,
  },
  {
    path: 'Daysheet',
    component: FormComponent,
    canActivate: [AuthtokenGuard]
  },
  {
    path: '**',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
