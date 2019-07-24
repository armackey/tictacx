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
	
	ngOnInit() {

		if (this.sharedService.isServer) return;

		this.sharedService.setUidOnSharedUser();

	}

	sendUserToHomeScreen(): void {
		this.router.navigate(['home']);
		
	}

	sendUserToLoginScreen(): void {

		this.router.navigate(['login']);

	}

}
