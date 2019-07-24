import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { BoardService } from './board.service';
// import { BoardNum } from '../../shared/interfaces';
import { GameManagerService } from '../../game-manager/game-manager.service';
import { Board } from '../../shared/interfaces';
import { UserService } from '../../shared/user/user.service';
import { SharedService } from '../../shared/shared-service';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

	@Input() boardNumber;
	@Input() _board: Board; // collection of squares
	// @Output() userSelectedEvent = new EventEmitter;
	@ViewChild('board', { static: false }) board: ElementRef; // parent element

	constructor(
		public bService:  BoardService,
		private _user: UserService,
		private _sharedService: SharedService
		// private _gameManagerService: GameManagerService
	) {

	}


	ngOnInit() {

	}


	validMove(domData, data): void {

		let selectedSquare = domData['square'].squareNumber;

		this._board.squares[selectedSquare].symbol = this.bService.assocSymbol;

		this.board.nativeElement.class = 'active';

		this.bService.setNextUserTurn();

		this.bService.sendMove({
			activeBoard: data.activeBoard,
			prevBoard: data.prevBoard,
			userTurn: this.bService.userTurn,
			boards: data.boards,
			winner: data['winner'] || '',
			isGameOver: data['isGameOver'] || ''
		});		

	}

	
	selected(event, data, index): void {

		if (this.bService.isGameOver || this.bService.userTurn !== this._sharedService.user.uid) {
			
			this._sharedService.notifyMessage = 'not your turn';

			return;

		}

		this.bService.isMoveValid(event, data, this.validMove.bind(this, data));

	}

}
