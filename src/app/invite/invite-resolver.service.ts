import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { FireService } from '../shared/fire';
import { User } from '../shared/interfaces';
import { SharedService } from '../shared/shared-service';
import { RestRequest } from '../shared/requests';

@Injectable({
  providedIn: 'root'
})
export class InviteServiceResolver implements Resolve<User|Boolean> {

	constructor(
		private _sharedService: SharedService, 
		private _fire: FireService,
		private _restRequest: RestRequest,
		private router: ActivatedRoute
	) {}

	async resolve(route: ActivatedRouteSnapshot) {

		// user may have been invited to play
		// if they are not logged in,
		// we'll create an account and make them an anonymous user
		const gameId = route.paramMap.get('id');

		let uid = this._sharedService.getData('uid');

		let user;

		try {

			if (!uid) {
				// seems unable to get active route with ActivatedRouteSnapshot or ActivatedRoute
				// so.. location object it is!
				let url = location.pathname; 

				let gameType = url.substring(url.indexOf('/') + 1);

				gameType = gameType.substring(0, gameType.indexOf('/'));

				let { uid } = await this._restRequest.joinGameByInvite(gameType, gameId);

				user = {
					uid
				};


			} else {

				user = await this._fire.getUserData(uid);

				user = user.val() || !!user.val();

			}


		} catch (error) {

			console.log(error);

		}

		if (user) {

			this._sharedService.user = new User();

			this._sharedService.user = {
				uid: user.uid,
				name: user.name || ''
			};

			this._sharedService.setData('uid', uid);

		}		

		return this._sharedService.user;
	}

}
