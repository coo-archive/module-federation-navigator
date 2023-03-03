import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { ngcx } from './lib.d';
import { NgcxDestroyEventEmitter } from './destroy-event.emitter';
import { ModuleNavigatorManifest } from './navigator.manifest';

export const NGCX_MODULE_NAVIGATOR_OPTIONS = new InjectionToken<Partial<ngcx.module.federation.navigation.navigator.Options>>(
	'NGCX Module navigator behavior options'
);

@Injectable({ providedIn: 'root' })
export class ModuleNavigator extends NgcxDestroyEventEmitter {

	private readonly _default: Routes;

	public readonly navigation$ = this._manifest.definition$.pipe(
		map(_definition => _definition.navigation),
		switchMap(_items => combineLatest(
			_items.map(_item => _item.options?.active$
				? _item.options.active$.pipe(
					map(_active => _active
						? _item
						: false
					),
					takeUntil(this)
				)
				: of(_item)
			)
		)),
		map(_items => _items.filter(_item => _item !== false)),
		shareReplay({ bufferSize: 1, refCount: false }),
		takeUntil(this)
	);

	constructor(
		private readonly _manifest: ModuleNavigatorManifest<ngcx.module.federation.navigation.NavigableRemoteModuleConfig>,
		_router: Router,
		@Inject(NGCX_MODULE_NAVIGATOR_OPTIONS)
		@Optional()
		_options?: Partial<ngcx.module.federation.navigation.navigator.Options>
	) {
		super();
		this._default = _router.config;
		this._manifest.definition$.pipe(
			takeUntil(this)
		).subscribe(definition => {
			_router.resetConfig([
				...this._default,
				...definition.routes,
				..._options?.undefined
					? [{
						path: '**',
						component: _options.undefined.component
					}]
					:[]
			]);
		});
	}

}