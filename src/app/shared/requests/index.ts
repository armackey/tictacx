import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { SharedService } from '../shared-service';

@Injectable({
	providedIn: 'root'
})
export class RestRequest {

	constructor(
		private _http: HttpClient,
		private _userService: UserService,
		private _sharedService: SharedService
	) {

	}

	public async findGame(gameType: string, numberOfPlayers?: number): Promise<any> {

		return this.makeRequest('findGame', { gameType, numberOfPlayers})
		
	}

	public async createGameId(gameType: string, numberOfPlayers?: number): Promise<any> {

		return this.makeRequest('createGameId', { gameType, numberOfPlayers});

	}

	private makeRequest(restUrl: 'createGameId' | 'findGame' | 'verifyTokenId', extras?): Promise<any> {

		let options = this.createRequestOptions();

		let obj = this.getBasicUserInformation(); // attach roomType to this object;

		if (extras) {

			obj = Object.assign({}, obj, extras);

		}

		return this._http.post(`/${restUrl}`, obj, options).toPromise();

	}

	public verifyTokenId(tokenId: string): Promise<any> {
		
		return this.makeRequest('verifyTokenId', { tokenId });

	}

	private getBasicUserInformation(): any {
		let uid = this._sharedService.getData('uid');
		return {
			uid: uid === null ? '' : uid
		};
	}

	private createRequestOptions(): any {

		let headers = new HttpHeaders({
			"Content-Type": "application/json; charset=utf-8"
		});

		return { headers };

	}

}
// function makeRequest() {
// 	let http = new HttpClient()
// 	HttpClient.post('')
// }