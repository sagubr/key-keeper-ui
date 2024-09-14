import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private PATH_API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<string> {
    const url = `${this.PATH_API_URL}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http
      .post<{ access_token: string }>(url, body, { headers })
      .pipe(
        map((response) => {
          const token = response.access_token;
          this.setCookie('Authorization', token, 1);
          this.router.navigate(['/manager']);
          return token;
        }),
        catchError((error) => {
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  private setCookie(name: string, value: string, seconds: number): void {
    const expires = new Date(Date.now() + seconds * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; secure; SameSite=Strict`;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getCookie('Authorization');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  logout(): void {
    this.deleteCookie('Authorization');
    this.router.navigate(['/login']);
  }

  private getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  private deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }

  getToken(): string | null {
    return this.getCookie('Authorization');
  }

  isAuthenticated(): boolean {
    const token = this.getCookie('Authorization');
    if (token) {
      return true;
    }
    return false;
  }
}
