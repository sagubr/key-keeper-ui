import {Component} from '@angular/core';

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AuthenticationService} from '@app/core/services/authentication.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {} from '@angular/common/http';
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        NgOptimizedImage,
        MatIcon,
        ReactiveFormsModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
	username = '';
	password = '';
	hide = true;
	errorMessage = '';

	constructor(private readonly _authenticationService: AuthenticationService) {
	}

	login(): void {
		this._authenticationService.login(this.username, this.password).subscribe({
			error: (error) => {
				this.errorMessage = 'Falha no login. Verifique suas credenciais.';
				console.error('Erro de login:', error);
			},
		});
	}
}
