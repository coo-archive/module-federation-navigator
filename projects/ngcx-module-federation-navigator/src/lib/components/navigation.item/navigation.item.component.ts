import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { filter, map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ngcx } from '../../lib';
import { NgcxDestroyEventEmitter } from '../../destroy-event.emitter';

/** The <ngcx-ni> element represents a navigation item. */
@Component({
	selector: 'ngcx-ni',
	templateUrl: './navigation.item.component.html',
	styleUrls: ['./navigation.item.component.scss'],
	providers: [NgcxDestroyEventEmitter],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgcxNavigationItemComponent<TEvent> implements AfterViewInit {

	private readonly _source$ = new ReplaySubject<ngcx.navigation.item.Definition<TEvent>>();

	@ViewChild('content', { read: ViewContainerRef })
	private _content: ViewContainerRef;

	@Input('source')
	private set _source(value: ngcx.navigation.item.Definition<TEvent>) {
		this._source$.next(value);
	}

	public readonly uuid = uuid();

	public readonly active$: Observable<boolean> = combineLatest([
		this._source$.pipe(
			filter(_source => !!_source)
		),
		this._router.events.pipe(
			filter(_event => _event instanceof NavigationStart || _event instanceof NavigationEnd),
			map(_event => _event as RouterEvent),
			map(_event => _event instanceof NavigationEnd
				? _event.urlAfterRedirects
				: _event.url
			),
			startWith(this._router.url)
		)
	]).pipe(
		map(([_source, _url]) => _url.startsWith(`/${_source.route.path}`)),
		takeUntil(this._destroy$),
		shareReplay({ bufferSize: 1, refCount: false })
	);

	public readonly route$ = this._source$.pipe(
		map(o => o.route),
		takeUntil(this._destroy$),
		shareReplay({ bufferSize: 1, refCount: false })
	);

	public readonly link$ = this.route$.pipe(
		map(_route => ([
			..._route.path.startsWith('/')
				? [_route.path]
				: ['/', _route.path],
			..._route.params
				? Object.values(_route.params)
				: []
		])),
		takeUntil(this._destroy$),
		shareReplay({ bufferSize: 1, refCount: false })
	);

	constructor(
		private readonly _vcRef: ViewContainerRef,
		private readonly _elRef: ElementRef,
		private readonly _renderer: Renderer2,
		private readonly _router: Router,
		private readonly _destroy$: NgcxDestroyEventEmitter
	) { }

	ngAfterViewInit(): void {
		this._source$.pipe(
			filter(_source => !!_source),
			takeUntil(this._destroy$)
		).subscribe(_source => _source.component.then(_component => {
			switch (typeof _component) {
				case 'string': {
					this._renderer.setProperty(this._elRef.nativeElement.querySelector('.ngcx-ni-link'), 'innerHTML', _component);  
					break;
				}
				default: {
					const _componentRef = this._vcRef.createComponent(_component);
					// TODO: ?????????????????? ???????????? ???????????????? ????????????????????
					_componentRef.changeDetectorRef.detectChanges();
					this._content.insert(_componentRef.hostView);
					break;
				}
			}
		}));
	}

}