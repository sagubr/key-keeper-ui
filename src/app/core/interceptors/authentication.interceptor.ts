import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

	constructor(
		private readonly router: Router,
		private readonly authentication: AuthenticationService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = this.authentication.getToken();
		let clonedRequest = req;

		if (token) {
			clonedRequest = req.clone({
				setHeaders: {
					Authorization: `Bearer ${ token }`
				}
			});
		}

		return next.handle(clonedRequest).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					this.authentication.logout();
					this.router.navigate(['/login']);
				}
				return throwError(error);
			})
		);
	}
}
