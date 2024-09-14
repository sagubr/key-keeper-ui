import { Component } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private readonly _authenticationService: AuthenticationService) {}

  login() {
    this._authenticationService.login(this.username, this.password).subscribe({
      next: (token) => {
        console.log('Login bem-sucedido! Token:', token);
      },
      error: (error) => {
        this.errorMessage = 'Falha no login. Verifique suas credenciais.';
        console.error('Erro de login:', error);
      },
    });
  }
}
