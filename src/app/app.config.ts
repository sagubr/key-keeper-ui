import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { CustomConfiguration } from '@openapi/configuration/custom-configuration';
import { Configuration as GRClientConfiguration } from '@openapi/configuration';
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideClientHydration(),
		provideAnimationsAsync(),
		provideHttpClient(withFetch()),
		{ provide: GRClientConfiguration, useClass: CustomConfiguration },
		{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
		importProvidersFrom(TranslateModule.forRoot(
			{
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			}
		))
	],
};

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/xi18n', '.json')
}
