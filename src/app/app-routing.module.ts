import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { CreatenewuserComponent } from './createnewuser/createnewuser.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [

  {
    path: 'index',
    component: HomeComponent
  },
  {
    path: 'newuser',
    component: CreatenewuserComponent
  },
  {
    path: 'Daysheet',
    component: FormComponent
  },
  {
    path: '',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
