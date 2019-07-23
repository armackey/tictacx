import { Component, OnInit } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase/firebase';
// import { Fire } from './shared/fire';
import { Router, CanActivate, Event, NavigationCancel, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { FireService } from './shared/fire';
import { UserService } from './shared/user/user.service';
import { SharedService } from './shared/shared-service';
import { User } from './shared/interfaces';
// import { AngularFireAuth } from '@angular/fire/auth';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	loading = true;
	constructor(
		private _fire: FireService,
		private router: Router,
		// private userService: UserService
		public sharedService: SharedService
	) {

		// this.userService.uid = this.createUID();
		if (this.sharedService.isServer) return;

		this.router.events.subscribe((routerEvent: Event) => {
			this.checkRouterEvent(routerEvent);
		});


	}

	checkRouterEvent(routerEvent) {

		let turnOffLoader = routerEvent instanceof NavigationCancel || 
			routerEvent instanceof NavigationEnd ||
			routerEvent instanceof NavigationError;

		let turnOnLoader = routerEvent instanceof NavigationStart;

		if (turnOffLoader) {
			this.loading = false;
		} else if (turnOnLoader) {
			this.loading = true;
		}

	}
	
	async ngOnInit() {

		if (this.sharedService.isServer) return;

		let uid = this.sharedService.getData('uid');

		if (!uid) {
			
			// return this.sendUserToLoginScreen();
			
		}

		try {

			let user = await this._fire.getUserData(uid);

			user = user.val();

			this.sharedService.user = new User();

			this.sharedService.user = {
				uid: user.uid,
				name: user.name
			};

			console.log('this.sharedService.user', this.sharedService.user);

			// this.sendUserToHomeScreen();
				
		} catch (error) {
			
			console.log(error);

		}
		
		// this.fire
		// 	.listenToAuthChanges(this.sendUserToHomeScreen.bind(this), this.sendUserToLoginScreen.bind(this))
		// 	.then(r => {

		// this.fire.isUserLoggedIn().then(r => {
		// 	if (!r) {
		// 		this.sendUserToLoginScreen();
		// 		return;
		// 	}
		// 	// this.sendUserToHomeScreen();
		// }).catch(e => {
		// 	console.log(e);
		// 	this.sendUserToLoginScreen();
		// });

		// 	});
	}

	createUID(): string {
	
		let array = [1,2,3,4,5,6,7,8,9, 'a', 'b', 'c'];

		function randomString (): string {
			let randomNumber = Math.ceil(Math.random() * ( array.length - 1 ) );
			return array[randomNumber].toString();
		}

		return randomString() + randomString() + randomString();

	}

	sendUserToHomeScreen(): void {
		this.router.navigate(['home']);
		console.log('should see home screen');
	}

	sendUserToLoginScreen(): void {

		this.router.navigate(['']);

	}

}
