import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleNavigatorManifest, ngcx, NgcxRemoteModuleNavigatorModule, NGCX_MODULE_NAVIGATOR_OPTIONS } from '@ngcx/module-federation-navigator';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { UnfoundComponent } from './components/unfound/unfound.component';
import { BehaviorSubject } from 'rxjs';
import { ExampleContextModule } from 'projects/example-context/src/public-api';

@NgModule({
	imports: [
		BrowserModule,
		ExampleContextModule,
		NgcxRemoteModuleNavigatorModule,
		RouterModule.forRoot([{
			path: '',
			component: WelcomeComponent,
			pathMatch: 'full'
		}])
	],
	declarations: [
		HomeComponent,
		UnfoundComponent,
		WelcomeComponent
	],
	providers: [{
		provide: NGCX_MODULE_NAVIGATOR_OPTIONS,
		useValue: {
			undefined: {
				component: UnfoundComponent
			}
		}
	}, {
		provide: 'ModuleBNavComponentOptions',
		useValue: { 
			active$: new BehaviorSubject<boolean>(true),
			order: 3
		}
	}, {
		provide: 'ModuleANavComponentOptions', // ModuleANavComponent
		useValue: { 
			active$: new BehaviorSubject<boolean>(true),
			order: 2
		}
	}, {
		// Preload: routes and other internal configurations
		provide: APP_INITIALIZER,
		useFactory: (manifest: ModuleNavigatorManifest<ngcx.module.federation.navigation.NavigableRemoteModuleConfig>) => 
			(): Promise<void> => 
				manifest.load('/assets/modules.manifest.json'),
		deps: [ModuleNavigatorManifest],
		multi: true
	}],
	bootstrap: [HomeComponent]
})
export class AppModule { }