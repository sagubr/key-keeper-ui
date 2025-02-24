import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'join'
})
export class JoinPipe implements PipeTransform {
	transform(value: any[], separator: string = ', '): string {
		return Array.isArray(value) ? value.join(separator) : value;
	}
}
