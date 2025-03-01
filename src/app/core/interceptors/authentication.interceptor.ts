import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "@app/core/services/authentication.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export const httpAuthErrorsInterceptor: HttpInterceptorFn = (req, next) => {

	const authentication = inject(AuthenticationService);
	const snackBar = inject(MatSnackBar);

	return next(req).pipe(
		catchError((error) => {
			if (error.status === 401) {
				snackBar.open('Seu token de acesso foi expirado', 'Fechar', {
					duration: 10000,
				});
				authentication.logout();
			}
			return throwError(() => error);
		})
	);
};
