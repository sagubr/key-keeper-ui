import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { ManagerComponent } from './features/manager/manager.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AuthenticationGuard],
  },
];
