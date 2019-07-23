import { Component, OnInit, ViewChild, ElementRef, Output, ViewChildren, QueryList, ComponentFactoryResolver, ViewContainerRef, Input } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { EventEmitter } from 'events';
import { SharedService } from '../shared/shared-service';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { SERVER_HOST } from '../shared/constants';
import { Router } from '@angular/router';
import { TictacComponent } from '../tictac/tictac.component';
import { FireService } from '../shared/fire';
import { UserService } from '../shared/user/user.service';
import { RestRequest } from '../shared/requests';
// import { BoardComponent } from '../tictac/board/board.component';
// import * as firebase from 'nativescript-plugin-firebase/firebase';
// import { isIOS, isAndroid } from 'tns-core-modules/ui/page/page';

// if (isIOS || isAndroid) {

// 	// registerElement('app-home', () => require('tns-core-modules/ui/layouts/stack-layout').StackLayout);

// }


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

	// @ViewChild('tictac', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef; 
	@Output() modalTypeSent: any;
	boards: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	showToast: boolean;
	showModal: boolean;

	constructor(
		private _fireService: FireService,
		private _restRequest: RestRequest,
		private componentFactoryResolver: ComponentFactoryResolver,
		private service: SharedService,
		private http: HttpClient,
		private _router: Router,
		private _user: UserService,
		private _sharedService: SharedService,
	) {

	}


	ngOnInit() {

		if (this.service.isServer) return;

		console.log('home component loaded');
		
	}

	async renderGame(gameType: string, numberOfPlayers: number): Promise<any> {

		let { gameId } = await this.createGame(gameType, numberOfPlayers);

		// this._fireService.addPlayerToGame(gameType, gameId, 'x');

		// needs a second to create game on firebase before navigating
		setTimeout(() => this._router.navigate([`/game`, gameId]), 500);

		

		// dynamic component loading below
		// const factory = this.componentFactoryResolver.resolveComponentFactory(TictacComponent);
		// const ref = this.viewContainerRef.createComponent(factory);
		// ref.changeDetectorRef.detectChanges();

	}

	receivedClosedModal(event) {
		
		this.modalTypeSent = '';

	}

	async findGame(gameType: string, numberOfPlayers: number): Promise<any> {
		
		let { gameId } = await this._restRequest.findGame(gameType, numberOfPlayers);

		this._router.navigate([`/game`, gameId]);

	}

	async createGame(gameType: string, numberOfPlayers: number): Promise<any> {
		
		let r = await this._restRequest.createGameId(gameType, numberOfPlayers);

		return r;

	}

	renderHowToModal(modalType): void {

		this.modalTypeSent = modalType;

	}
	

	getUserPosition(): void {
		console.log('user clicked');
		this.http.post(`${SERVER_HOST}/getUserPosition`, {}).toPromise().then((r)=>{
			console.log(r);
		});
	}
	getUserLinkedInProfile(): void {
		this.http.post(`${SERVER_HOST}/getUserLinkedInProfile`, {}).toPromise().then(r => {
			console.log(r);
		})
	}

	getUserPicture(): void {
		this.http.post(`${SERVER_HOST}/getUserPicture`, {}).toPromise().then(r => {
			console.log(r);
		})
	}

	logout(): void {
		this.http.get(`${SERVER_HOST}/oauth/logout`).toPromise()
		.then(r => {
			console.log('logged out');
			console.log(r);
			this._router.navigate(['login']);
		})
		.catch(e => {
			console.log(e);
		})
	}

}
