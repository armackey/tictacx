import { FireBaseClass, User, Square } from './interfaces';
import * as firebase from 'nativescript-plugin-firebase/firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

import { SERVER_HOST } from './constants';
import { RestRequest } from './requests';
import { UserService } from './user/user.service';

@Injectable({
	providedIn: 'root'
})
export class FireService implements FireBaseClass {

	private _moveListener: any;

	constructor(
		private _afAuth: AngularFireAuth, 
		private _db: AngularFireDatabase, 
		private http: HttpClient,
		private _restRequest: RestRequest,
		private _user: UserService
	) {

	}



	// login(email: string, password: string): Promise<any>{

	// 	// return this._afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);

	// }

	loginLinkedIn(): void {
		window.location.href = SERVER_HOST + '/oauth/linkedin';
		// this.fire.loginFacebook().then(r => {
		// 	console.log(r);
		// }, error => {
		// 	console.log(error);
		// });
	}

	getCurrentUser(): any {
		
		return this._afAuth.authState.pipe(first()).toPromise();

	}

	private getSnapshots(path: string): any {

		return this._db.object(path).snapshotChanges();

	}


	sendMove(gameType: string, gameId: string, data: any): Promise<any> {

		let path = `${gameType}/${gameId}`;

		let ref = this._db.object(path);

		return ref.update(data);

	}

	getTokenId(): Promise<any> {

		return this._afAuth.auth.currentUser.getIdToken(true);

	}

	async getGameData(gameType: string, gameId: string): Promise<any> {

		let path = `${gameType}/${gameId}`;

		let gameData = await this._db.object(path).query.once('value');

		return gameData.val();

	}


	listenToMovesList(gameType: string, gameId: string, cb: Function): any {
		
		let path = `${gameType}/${gameId}`;

		return this._db.list(path).valueChanges();

	}



	listenToMoves(gameType: string, gameId: string, cb: Function): void {

		let path = `${gameType}/${gameId}`;

		let ref = this._db.object(path);

		this._moveListener = this.getSnapshots(path).subscribe(action => {

			cb(action.payload.val());

		});

	}

	unsubscribeFromListeners(): void {
		if (this._moveListener)
			this._moveListener.unsubscribe();
	}
	
	loadGameList(): any {
		return;
	}

	loadSelectedGame(): any {
		return;
	}

	logout(): Promise<any> {
		
		return this._afAuth.auth.signOut();

	}

	createGame(gameType: string, numberOfPlayers?: number): Promise<any> {
		
		return this._restRequest.createGameId(gameType, numberOfPlayers);

	}

	addPlayerToGame(gameType: string, gameId: string, assocSymbol?: string): Promise<any> {
		
		let path = `${gameType}/${gameId}/playerList/${this._user.uid}`;

		return this._db.object(path).set({
			user: {
				uid: this._user.uid //TODO: add names and what not later
			},
			assocSymbol
		});

	}

	saveUser(user: User) {

		this._db.object('users').set(user);

	}


	getUserData(uid: string): Promise<any> {

		let path = `users/${uid}`;

		return this._db.object(path).query.once('value');

	}

	getUser(): Promise<void | { [key: string]: any }> {
		return this.http.post(SERVER_HOST + '/oauth/user', {
			credentials: 'same-origin'
		}).toPromise().then(function(response) {
			console.log(response);
			if (response['error']) {
				return false;
			}
	    return response;
	  }).then(function(json) {
			if (json['error']) {
				return void 0
			} else {
				return json
			}
	  });
	}

	loginFacebook(): Promise<any> {

		let provider = new auth.FacebookAuthProvider();

		return this._afAuth.auth.signInWithPopup(provider);

	}

	storeUser(data): Promise<any> {

		let path = `users/${data['uid']}`;

		return this._db.object(path).set(data);

	}

	anonLogin(): Promise<any> {

		return this._afAuth.auth.signInAnonymously();

	}	

	async createAndStoreUser(user, additionalUserInfo): Promise<any> {

		let tokenId = await this.getTokenId();

		let { uid, error } = await this._restRequest.verifyTokenId(tokenId);

		if (error) {
			console.log('error:', error);
			return;
		}

		let { isNewUser, profile } = additionalUserInfo;

		let { email, emailVerified, photoURL, refreshToken } = user;

		let data;

		if (profile) {

			let { first_name, last_name, name, picture, id } = profile;

			data = {
				fbId: id,
				uid,
				first_name,
				last_name,
				name,
				photoURL,
				email,
				emailVerified,
				tokenId
			};

		} else {

			data = {
				uid,
				tokenId
			};

		}

		this.storeUser(data);

		return data;

	}

}


 /*
 *
 * 	loginFacebook(): Promise<any> {

		return new Promise<any>((resolve, reject) => {
			// firebase.au
			let provider = new auth.FacebookAuthProvider();
			this._afAuth.auth
				.signInWithPopup(provider)
				.then(res => {
					resolve(res);
				}, err => {
					console.log(err);
					reject(err);
				});
		});

	}
 * 	createUser(data): Promise<any> {

		let user: User = {
			username: '',
			email: '',
			uid: ''
		};

		return this.db.database.ref('users').push({

		});
		// this.db.database.ref().child(`users/${this.shared.user.uid}`)

	}
 * 	

	createEmailAndPassword(email: string, password: string): Promise<any> {

		return this._afAuth.auth.createUserWithEmailAndPassword(email, password);

	}

	listenToAuthChanges(loggedInCb: Function, notLoggedInCb: Function): Promise<any> {

		return new Promise((resolve, reject) => {

			auth().onAuthStateChanged((data) => {

				console.log(data);

			});

			resolve();

		});

	}
 */