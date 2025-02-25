import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';

import { ResourceComponent } from '@app/features/resource/resource-component';
import { AuthorizationManagementComponent } from "@app/features/authorization/authorization-management.component";
import { TransactionsComponent } from "@app/features/transactions/transactions-component";
import { SidenavComponent } from "@app/shared/components/sidenav/sidenav.component";
import { AccessComponent } from "@app/features/settings/access/access.component";
import { RegistersComponent } from "@app/features/settings/registers/registers.component";
import { DefinitionsComponent } from "@app/features/settings/definitions/definitions.component";
import {
	RequesterDatatableComponent
} from "@app/features/authorization/requester/requester-datatable/requester-datatable.component";
import {
	PermissionDatatableComponent
} from "@app/features/authorization/permission/permission-datatable/permission-datatable.component";

export const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '',
		component: SidenavComponent,
		canActivate: [AuthenticationGuard],
		children: [
			{ path: 'recursos', component: ResourceComponent, canActivate: [AuthenticationGuard] },
			{
				path: 'autorizacoes',
				component: AuthorizationManagementComponent,
				canActivate: [AuthenticationGuard],
				children: [
					{
						path: 'solicitantes',
						component: RequesterDatatableComponent,
						canActivate: [AuthenticationGuard]
					},
					{
						path: 'permissoes',
						component: PermissionDatatableComponent,
						canActivate: [AuthenticationGuard]
					}
				]
			},
			{ path: 'transacoes', component: TransactionsComponent, canActivate: [AuthenticationGuard] },
			{
				path: 'configuracoes',
				canActivate: [AuthenticationGuard],
				children: [
					{
						path: 'definicoes',
						component: DefinitionsComponent,
						canActivate: [AuthenticationGuard]
					},
					{ path: 'acessos', component: AccessComponent, canActivate: [AuthenticationGuard] },
					{ path: 'registros', component: RegistersComponent, canActivate: [AuthenticationGuard] }
				]
			},
			{ path: '', redirectTo: 'recursos', pathMatch: 'full' }
		]
	},
	{ path: '**', redirectTo: 'login' }
];
