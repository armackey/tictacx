import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared-service';
import { FireService } from '../shared/fire';
import { Router } from '@angular/router';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

	constructor(
		public _sharedService: SharedService,
		private _fire: FireService,
		private _router: Router
	) { }

	ngOnInit() {

	}

	goToLoginScreen(): void {

		this._router.navigate(['login']);
		
	}


	async logout() {

		await this._fire.logout();

		localStorage.clear();

		this._sharedService.user = undefined;

		this._router.navigate(['']);

	}

}
