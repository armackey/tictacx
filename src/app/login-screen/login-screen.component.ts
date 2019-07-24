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

			let { uid } = await this.fire.createAndStoreUser(additionalUserInfo, user);

			this._sharedService.setData('uid', uid);

			this._router.navigate(['home']);
			
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

			let { uid } = await this.fire.createAndStoreUser(additionalUserInfo, user);

			this._sharedService.setData('uid', uid);

			this._router.navigate(['home']);			

		} catch(e) {

			console.log(e);

		}

	}

	// loginLinkedIn(): void {
	// 	this.fire.loginLinkedIn();
	// }



}
