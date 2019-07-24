import { Injectable } from '@angular/core';
import { User } from './interfaces';
import { BehaviorSubject } from 'rxjs';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class SharedService {

	private _event: BehaviorSubject<any> = new BehaviorSubject('');
	private _timerId;
	private _isServer: boolean;
	private _isBrowser: boolean;
	private _notifyMessage: string;
	private _isGameOver: boolean;

	public user: User;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string, 
		private state: TransferState
	) {
		this._isServer = isPlatformServer(platformId);
		this._isBrowser = isPlatformBrowser(platformId);
	}

	set isGameOver(b) {

		this._isGameOver = b;

	}

	get isGameOver(): boolean {

		return this._isGameOver;

	}

	get notifyMessage(): string {
		
		return  this._notifyMessage;

	}

	set notifyMessage(s: string) {

		this._notifyMessage = s;

		this.hideNotifier();

	}

	get isServer(): boolean {

		return this._isServer;

	}

	get isBrowser(): boolean {

		return this._isBrowser;

	}
	

	get event(): BehaviorSubject<any> {

		return this._event;

	}

	setUidOnSharedUser() {
		
		let uid = this.getData('uid');

		if (uid) {
			
			this.user = new User();
			
			this.user.uid = uid;

		}

	}


	public setData(name: string, data: any): void {
		
		localStorage.setItem(name, JSON.stringify(data));

	}

	public getData(name: string): any {

		let data = localStorage.getItem(name);

		if (data !== null && data.length) {

			return JSON.parse(data);

		}

		return false;

	}


	private hideNotifier(): void {
		
		if (this._isGameOver) return;

		setTimeout(() => {
			
			this._notifyMessage = '';

		}, 2000);

	}	

	private clearTimer() {

		if (this._timerId) {

			clearTimeout(this._timerId);

		}


	}

	public removeModal(cb) {

		// if (data.type === 'toast') {
		if (this._timerId) return;

		this._timerId = setTimeout(() => {
			
			this._timerId = undefined;

			cb(); // callback that sets showModal to false

		}, 2500);


		// }

	}
}