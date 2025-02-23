import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatTab, MatTabGroup, MatTabLabel, MatTabsModule } from "@angular/material/tabs";
import { Status } from "@openapi/model/status";
import {
	TransactionsDatatableProgressComponent
} from "@app/features/transactions-management/transactions-management-datatable/transactions-datatable-progress/transactions-datatable-progress.component";
import {
	TransactionsDatatableHistoryComponent
} from "@app/features/transactions-management/transactions-management-datatable/transactions-datatable-history/transactions-datatable-history.component";
import { MatTableModule } from "@angular/material/table";

@Component({
	selector: 'app-transactions-management',
	imports: [
		MatIconModule,
		MatTableModule,
		MatTabsModule,
		TransactionsDatatableProgressComponent,
		TransactionsDatatableHistoryComponent,
	],
	templateUrl: './transactions-management.component.html',
	styleUrl: './transactions-management.component.scss'
})
export class TransactionsManagementComponent {

	activeTabIndex = 0;
	tabs = ['in-progress', 'scheduled', 'completed'];

	onTabChange(index: number): void {
		this.activeTabIndex = index;
		const activeTab = this.tabs[index];
		this.loadDataForTab(activeTab);
	}

	loadDataForTab(tab: string): void {
		console.log(`Carregando dados para a aba: ${ tab }`);
		switch (tab) {
			case 'in-progress':
				this.fetchInProgressData();
				break;
			case 'scheduled':
				this.fetchScheduledData();
				break;
			case 'completed':
				this.fetchCompletedData();
				break;
			default:
				console.warn('Tab desconhecida!');
		}
	}

	fetchInProgressData(): void {
		console.log('Buscando dados de empréstimos em andamento...');
	}

	fetchScheduledData(): void {
		console.log('Buscando dados de reservas agendadas...');
	}

	fetchCompletedData(): void {
		console.log('Buscando dados do histórico de reservas...');
	}

	protected readonly Status = Status;
}
