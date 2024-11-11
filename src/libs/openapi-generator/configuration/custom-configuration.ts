import {Injectable, Injector} from '@angular/core';
import {Configuration} from '../configuration';
import {AuthenticationService} from '@app/core/services/authentication.service';

@Injectable()
export class CustomConfiguration extends Configuration {

	//TODO: Solução temporária para teste em ambiente Vercel
    constructor(private readonly _injector: Injector) {
        super(
			// 	{
			//     credentials: {
			//         Authorization: () => this._getAccessToken(),
			//     },
			// }
		);
    }

    private _getAuthenticationService(): AuthenticationService {
        const service = this._injector.get(AuthenticationService);
        this._getAuthenticationService = () => service;
        return service;
    }

    private _getAccessToken(): string {
        const token = this._getAuthenticationService().getToken();
        if (!token) {
            throw new Error('Token not found');
        }

        return token;
    }
}
