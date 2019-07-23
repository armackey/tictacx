import { Injectable } from '@angular/core';
import { User } from '../shared/interfaces';
// import { BoardService } from '../tictac/board/board.service';
import { FireService } from '../shared/fire';
import { UserService } from '../shared/user/user.service';
import { SharedService } from '../shared/shared-service';


@Injectable({
	providedIn: 'root'
})
export abstract class GameManagerService {
	
	public isGameOver: boolean;
	public playerList: Array<User> = [];
	public userTurn: string;
	public gameType: string;
	public gameId: string;
	// public assocSymbols: {} = {}; // key value paired list of user id's and game symbols ex. 293vdnasSDowp9vS: x

	constructor(
		public _sharedService: SharedService,
		public fireService: FireService,
	) {
		
	}

	abstract resetGame(): void;

	abstract setBoardData(data: any): void;

	isUserTurn(): boolean {
		return this._sharedService.user.uid === this.userTurn;
	}

	setNextUserTurn(): void {

		let count = 0,
		l = this.playerList.length;

		while (this.userTurn === this._sharedService.user.uid) {

			count++;

			if (this.playerList[0].uid === this.userTurn) {

				this.userTurn = this.playerList[1].uid;
				break;
			}

			// taking into account the last person's turn
			if (this.playerList[l - 1].uid === this.userTurn) {

				this.userTurn = this.playerList[0].uid;
				break;
			} 			

			
			// find index of current user turn on player list
			// then increment if not found
			if (this.playerList[count].uid === this.userTurn) {
				
				count++;
				
				this.userTurn = this.playerList[count].uid;
				break;
			}

		}

	}

	sendMove(data: any): void {
		
		this.fireService.sendMove(this.gameType, this.gameId, data);

	}

	rematch(): void {
		// takes same players into account
		// does not search for new players unless a player drops 
		// write logic search for new player..... later
		// simple clear board should do for now...
	}



}
