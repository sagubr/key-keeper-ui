import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogTitle } from "@angular/material/dialog";
import { Location } from "@openapi/model/location";
import { KeyDatatableComponent } from "@app/features/resource/key/key-datatable/key-datatable.component";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";

@Component({
	selector: 'app-key',
	imports: [
		KeyDatatableComponent,
		MatDialogClose,
		MatDialogTitle,
		MatIcon,
		MatIconButton
	],
	templateUrl: './key.component.html',
	styleUrl: './key.component.scss'
})
export class KeyComponent {

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
	}

}
