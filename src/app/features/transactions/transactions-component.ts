import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import {
	TransactionsDatatableProgressComponent
} from "@app/features/transactions/transactions-datatable/transactions-datatable-progress/transactions-datatable-progress.component";
import {
	TransactionsDatatableHistoryComponent
} from "@app/features/transactions/transactions-datatable/transactions-datatable-history/transactions-datatable-history.component";
import { MatTableModule } from "@angular/material/table";
import { ActionsService } from "@app/core/services/actions.service";
import { Permissions } from "@openapi/model/permissions";

@Component({
	selector: 'app-transactions',
	imports: [
		MatIconModule,
		MatTableModule,
		MatTabsModule,
		TransactionsDatatableProgressComponent,
		TransactionsDatatableHistoryComponent,
	],
	templateUrl: './transactions-component.html',
	styleUrl: './transactions-component.scss'
})
export class TransactionsComponent {

	activeTabIndex = 0;
	tabs = ['in-progress', 'scheduled', 'completed'];

	constructor(private readonly action: ActionsService) {
	}

	onTabChange(index: number): void {
		this.activeTabIndex = index;
		const activeTab = this.tabs[index];
	}

	hasPermission(permission: Permissions[]): boolean {
		return this.action.hasAnyPermission(permission);
	}
}
