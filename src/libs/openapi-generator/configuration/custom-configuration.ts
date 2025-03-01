import {Injectable, Injector} from '@angular/core';
import {Configuration} from '../configuration';
import {AuthenticationService} from '@app/core/services/authentication.service';

@Injectable()
export class CustomConfiguration extends Configuration {

    constructor(private readonly _injector: Injector) {
        super(
				{
			    credentials: {
			        Authorization: () => this._getAccessToken(),
			    },
			}
		);
    }

    private _getAuthenticationService(): AuthenticationService {
        const service = this._injector.get(AuthenticationService);
        this._getAuthenticationService = () => service;
        return service;
    }

	private _getAccessToken(): string | undefined {
		const token = this._getAuthenticationService().getToken();
		if (!token) {
			return undefined;
		}
		return token;
	}

}
