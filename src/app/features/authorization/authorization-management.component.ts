import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
	PermissionDatatableComponent
} from "@app/features/authorization/permission/permission-datatable/permission-datatable.component";
import {
	RequesterDatatableComponent
} from "@app/features/authorization/requester/requester-datatable/requester-datatable.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

@Component({
	selector: 'app-authorization-management',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		PermissionDatatableComponent,
		RequesterDatatableComponent,
		RouterModule,
	],
	templateUrl: './authorization-management.component.html',
	styleUrl: './authorization-management.component.scss'
})
export class AuthorizationManagementComponent {

	constructor(private router: Router, private route: ActivatedRoute) {
	}

	getSelectedIndex(): number {
		const path = this.router.url;
		if (path.includes('permissoespermissoes')) return 1;
		return 0;
	}

	onTabChange(index: number): void {
		const tabRoutes = ['solicitantes', 'permissoes'];
		this.router.navigate(['autorizacoes', tabRoutes[index]]);
	}

}
