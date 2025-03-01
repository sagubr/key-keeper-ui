import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DialogWrappedInfo } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";

@Component({
	selector: 'app-dialog-wrapped',
	imports: [
		MatDialogModule,
		MatIconModule,
		MatButtonModule,
	],
	templateUrl: './dialog-wrapped.component.html',
	styleUrl: './dialog-wrapped.component.scss'
})
export class DialogWrappedComponent implements OnInit {

	constructor(
		private dialogRef: MatDialogRef<DialogWrappedComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogWrappedInfo
	) {
	}

	ngOnInit(): void {
		if (this.data.autoClose) {
			this.autoClose();
		}
	}

	close(result: boolean): void {
		this.dialogRef.close(result);
	}

	getIcon(): string {
		const icons: Record<string, string> = {
			danger: 'error_outline',
			warning: 'warning_amber',
			success: 'check_circle_outline',
			info: 'info',
		};
		return icons[this.data.icon || 'info'];
	}

	getIconClass(): string {
		return this.data.icon ? `icon-${ this.data.icon }` : '';
	}

	private autoClose(): void {
		setTimeout(() => this.dialogRef.close(true),
			(this.data.closeAfterSeconds || 3) * 1000);
	}

}
