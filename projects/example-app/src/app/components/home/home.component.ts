import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModuleNavigator } from '@ngcx/module-federation-navigator';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

	title = 'ngcx-module-federation-navigator.example-app';

	constructor(
		public readonly navigator: ModuleNavigator,
	) { }

}