import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { ActionsService } from '@app/core/services/actions.service';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {

	constructor(
		private readonly authentication: AuthenticationService,
		private readonly actionsService: ActionsService,
		private readonly router: Router
	) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.authentication.isAuthenticated().pipe(
			map((isAuthenticated) => {
				if (!isAuthenticated) {
					return false;
				}

				const requiredPermission = route.data?.['permissions'];
				if (!requiredPermission) return true;

				const requiredPermissions = route.data?.['permissions'];
				if (requiredPermissions && !this.actionsService.hasAnyPermission(requiredPermissions)) {
					this.router.navigate(['/unauthorized']);
					return false;
				}

				return true;
			})
		);
	}
}
