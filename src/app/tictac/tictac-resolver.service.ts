import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Board, BoardsResolved } from '../shared/interfaces';
import { FireService } from '../shared/fire';
import { of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TicTacResolver implements Resolve<BoardsResolved> {

	constructor(private _fire: FireService) {

	}

	resolve(route: ActivatedRouteSnapshot) {
		const id = route.paramMap.get('id');
		const data = this._fire.getGameData('tictac', id);
		if (typeof data === null) {
			return of({
				error: 'Game doesn\'t exist',
				boards: []
			});
		}
		return data;
	}
}