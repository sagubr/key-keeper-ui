import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatTab, MatTabGroup, MatTabLabel } from "@angular/material/tabs";
import {
	TransactionsManagementDatatableComponent
} from "@app/features/transactions-management/transactions-management-datatable/transactions-management-datatable.component";
import { Status } from "@openapi/model/status";

@Component({
	selector: 'app-transactions-management',
	imports: [
		MatIcon,
		MatTab,
		MatTabGroup,
		MatTabLabel,
		TransactionsManagementDatatableComponent,
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
