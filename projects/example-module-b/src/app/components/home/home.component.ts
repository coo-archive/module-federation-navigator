import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContextService } from 'projects/example-context/src/public-api';

@Component({
	selector: 'module-b-home',
	templateUrl: './home.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
	
	constructor(
		public readonly context: ContextService
	) { }

}
