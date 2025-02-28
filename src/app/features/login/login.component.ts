import { Component, OnInit } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { CommonModule } from '@angular/common';
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
		MatIcon,
		ReactiveFormsModule,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

	formGroup!: FormGroup;
	hide = true;
	errorMessage: string | null = null;

	constructor(
		private readonly fb: FormBuilder,
		private readonly service: AuthenticationService,
	) {
	}

	ngOnInit(): void {
		this.formGroup = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	get username() {
		return this.formGroup.get('username');
	}

	get password() {
		return this.formGroup.get('password');
	}

	login(): void {
		if (this.formGroup.invalid) {
			return;
		}
		const { username, password } = this.formGroup.value;
		this.service.login(username, password).subscribe({
			error: (error) => {
				this.errorMessage = 'Falha no login. Verifique suas credenciais.';
				console.error('Erro de login:', error);
			},
		});
	}
}
