import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { ResourceManagementComponent } from '@app/features/resource-management/resource-management.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { RequesterManagementComponent } from "@app/features/authorization-management/requester-management/requester-management.component";
import {
	PermissionManagementComponent
} from "@app/features/authorization-management/permission-management/permission-management.component";
import {
	AuthorizationManagementComponent
} from "@app/features/authorization-management/authorization-management.component";
import {
	TransactionsManagementComponent
} from "@app/features/transactions-management/transactions-management.component";

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{
		path: 'recursos',
		component: ResourceManagementComponent,
		canActivate: [AuthenticationGuard],
	},
	{
		path: 'emprestimos',
		component: ResourceManagementComponent,
		canActivate: [AuthenticationGuard],
	},
	{
		path: 'autorizacoes',
		component: AuthorizationManagementComponent,
		canActivate: [AuthenticationGuard],
	},
	{
		path: 'transacoes',
		component: TransactionsManagementComponent,
		canActivate: [AuthenticationGuard],
	},
];
