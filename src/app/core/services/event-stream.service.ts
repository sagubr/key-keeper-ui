import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { BASE_PATH } from "@openapi/variables";
import { Configuration } from "@openapi/configuration";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class EventStreamService {

	protected basePath = 'http://localhost:8080';
	public defaultHeaders = new HttpHeaders();
	public configuration = new Configuration();
	private eventSource!: EventSourcePolyfill;

	constructor(
		@Optional() @Inject(BASE_PATH) basePath: string | string[],
		@Optional() configuration: Configuration
	) {
		if (configuration) {
			this.configuration = configuration;
		}
		if (typeof this.configuration.basePath !== 'string') {
			const firstBasePath = Array.isArray(basePath) ? basePath[0] : undefined;
			if (firstBasePath != undefined) {
				basePath = firstBasePath;
			}
			if (typeof basePath !== 'string') {
				basePath = this.basePath;
			}
			this.configuration.basePath = basePath;
		}
	}

	getSocketEvents(): Observable<any> {
		return new Observable((observer) => {
			const connect = () => {
				console.log("Tentando conectar ao SSE...");

				this.eventSource = new EventSourcePolyfill(`${this.configuration.basePath}/logging/get`, {
					headers: {
						'Authorization': 'Bearer ' + this.configuration.lookupCredential('Authorization'),
						'Accept': 'text/event-stream',
					},
				});

				this.eventSource.onmessage = (event) => {
					console.log('Evento recebido:', event);
					observer.next(event.data);
				};

				this.eventSource.onerror = (error) => {
					console.warn('Conexão SSE perdida. Tentando reconectar em 3s...', error);
					this.closeEventSource();
					setTimeout(connect, 3000);
				};
			};

			connect();

			return () => this.closeEventSource();
		});
	}

	closeEventSource(): void {
		if (this.eventSource) {
			this.eventSource.close();
			console.log('Conexão SSE encerrada.');
		}
	}
}
