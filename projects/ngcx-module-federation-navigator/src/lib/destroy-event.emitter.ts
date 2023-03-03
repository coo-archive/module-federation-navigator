/* eslint-disable rxjs/no-subclass */

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NgcxDestroyEventEmitter extends Subject<void> implements OnDestroy {

	public ngOnDestroy(): void {
		this.next();
		this.complete();
	}

}