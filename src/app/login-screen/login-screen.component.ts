import { Component, OnInit } from '@angular/core';
import { FireService } from '../shared/fire';
import { User } from '../shared/interfaces';
import { AngularFireAuth } from '@angular/fire/auth';
import { SharedService } from '../shared/shared-service';
import { RestRequest } from '../shared/requests';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login-screen',
	templateUrl: './login-screen.component.html',
	styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

	email: string;
	password: string;
	uid: string;
	username: string;
	showModal: boolean;

	constructor(
		private fire: FireService,
		private afAuth: AngularFireAuth,
		private _restRequest: RestRequest,
		private _router: Router,
		public _sharedService: SharedService
		// public user: User
	) { }

	ngOnInit() {

		if (this._sharedService.isServer)
			return;
	
		this.showModal = true;

	}

	signUp(): void {
		
		if (!this.password.length || !this.email.length) return;

		// this.fire.createEmailAndPassword(this.email, this.password).then(r => {

		// 	this.uid = r['uid'];

		// }, error => {
		// 	console.log(error);
		// });
	}

	saveUser(data): void {
		
		let user: User = {
			email: this.email,
			uid: this.uid,
			username: this.username
		}; 

		this.fire.saveUser(user);

	}

	login(): void {
		
		if (!this.password.length || !this.email.length) return;

		// this.fire.login(this.email, this.password).then(data => {
		// 	// get user object from firebase..
		// 	// send user to game list
		// });

	}

	async anonLogin(): Promise<any> {

		try {

			let {
				additionalUserInfo,
				user
			} = await this.fire.anonLogin();

			this.createAndStoreUser(additionalUserInfo, user);
			
		} catch (error) {

			console.log(error);
			
		}

	}




	async loginFacebook() {

		try {

			let {
				additionalUserInfo,
				user
			} = await this.fire.loginFacebook();

			this.createAndStoreUser(additionalUserInfo, user);

		} catch(e) {

			console.log(e);

		}

	}

	async createAndStoreUser(additionalUserInfo, user): Promise<any> {

		let tokenId = await this.fire.getTokenId();

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

		this._sharedService.user = new User();

		this._sharedService.user = {
			uid: data.uid,
			name: data.name
		};

		console.log('this._sharedService.user', this._sharedService.user);

		this.fire.storeUser(data);

		this._sharedService.setData('uid', uid);

		this._router.navigate(['home']);		

	}

	// loginLinkedIn(): void {
	// 	this.fire.loginLinkedIn();
	// }



}
