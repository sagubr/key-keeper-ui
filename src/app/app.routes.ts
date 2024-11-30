import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { ManagementComponent } from './features/management/management.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { RequesterManagementComponent } from "@app/features/management/requester-management/requester-management.component";
import {
	PermissionManagementComponent
} from "@app/features/management/permission-management/permission-management.component";

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{
		path: 'gerenciamento',
		component: ManagementComponent,
		// canActivate: [AuthenticationGuard], //TODO: Reativar segurança da rota
	},
	{
		path: 'agendamentos',
		component: ManagementComponent,
		// canActivate: [AuthenticationGuard], //TODO: Reativar segurança da rota
	},
	{
		path: 'solicitantes',
		component: PermissionManagementComponent,
		// canActivate: [AuthenticationGuard], //TODO: Reativar segurança da rota
	},
];
