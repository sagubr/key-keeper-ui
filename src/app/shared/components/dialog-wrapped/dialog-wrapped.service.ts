import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogWrappedComponent } from "@app/shared/components/dialog-wrapped/dialog-wrapped.component";

export interface DialogWrappedInfo {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	icon?: 'info' | 'danger' | 'warning' | 'success';
	color?: 'primary' | 'accent' | 'warn';
	hideCancel?: boolean;
	autoClose?: boolean;
	closeAfterSeconds?: number;
}

@Injectable({
	providedIn: 'root',
})
export class DialogWrappedService {

	constructor(private readonly dialog: MatDialog) {
	}

	openFeedback(data?: DialogWrappedInfo): MatDialogRef<DialogWrappedComponent, boolean> {
		return this.dialog.open(DialogWrappedComponent, {
			data: {
				title: data?.title ?? 'Atualização no status da solicitação',
				message: data?.message ?? 'Houve uma mudança no status da solicitação de empréstimo',
				icon: data?.icon ?? 'success',
				color: data?.color ?? 'primary',
				confirmText: data?.confirmText ?? 'Confirmar',
				hideCancel: data?.hideCancel ?? false,
			},
			width: '400px',
		});
	}
}
