import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FireService } from '../shared/fire';
import { User } from '../shared/interfaces';
import { SharedService } from '../shared/shared-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements Resolve<User|Boolean> {

	constructor(private sharedService: SharedService, private _fire: FireService) {}

	async resolve(route: ActivatedRouteSnapshot) {
	
		let uid = this.sharedService.getData('uid');

		let user;

		if (!uid) {

			return false;

		}

		try {

			user = await this._fire.getUserData(uid);

			user = user.val() || !!user.val();

			if (user) {
				
				this.sharedService.user = new User();

				this.sharedService.user = {
					uid: user.uid,
					name: user.name
				};

			}

		} catch (error) {

			console.log(error);

		}

		return this.sharedService.user || user;
	}

}
