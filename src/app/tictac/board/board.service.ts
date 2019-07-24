import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { SharedService } from '../../shared/service';
import { Board, Square } from '../../shared/interfaces';
import { GameManagerService } from '../../game-manager/game-manager.service';
import { UserService } from '../../shared/user/user.service';
import { FireService } from '../../shared/fire';
import { SharedService } from '../../shared/shared-service';
// import { UserService } from '~/app/shared/user/user.service';


@Injectable({
	providedIn: 'root'
})
export class BoardService extends GameManagerService {
	
	// public event: BehaviorSubject<any>;
	// public userTurn: 'x' | 'o';
	private _activeBoard: number;
	private _prevBoard: number;
	private firstTurnHasBeenTaken: boolean = false;

	public boards: Array<Board> = [];
	public assocSymbol: 'x' | 'o';

	constructor(
		public fireService: FireService,
		public _sharedService: SharedService
	) { 
		super(_sharedService, fireService);
		
		// this.event = new BehaviorSubject('');
		this.userTurn = 'x';
		
	}

	set activeBoard(n: number) {

		this._activeBoard = n;

	}

	get activeBoard(): number {

		return this._activeBoard;

	}

	set prevBoard(n: number) {

		this._prevBoard = n;

	}

	get prevBoard(): number {

		return this._prevBoard;

	}


	resetGame(): void {

		this._activeBoard = undefined;

		this._prevBoard = undefined;

		this.boards = [];

		this.userTurn = 'x';

		this.firstTurnHasBeenTaken = false;

	}


	private winLogic(object: any): boolean {

		let b = false;

		let row1 = object[0] === object[1] && object[1] === object[2] && object[0]; //!== "" && object[0] !== undefined ? true : false;

		let row2 = object[3] === object[4] && object[4] === object[5] && object[3]; //!== "" && object[3] !== undefined ? true : false;

		let row3 = object[6] === object[7] && object[7] === object[8] && object[6]; //!== "" && object[6] !== undefined ? true : false;

		let col1 = object[0] === object[3] && object[3] === object[6] && object[0]; //!== "" && object[0] !== undefined ? true : false;

		let col2 = object[1] === object[4] && object[4] === object[7] && object[1]; //!== "" && object[1] !== undefined ? true : false;

		let col3 = object[2] === object[5] && object[5] === object[8] && object[2]; //!== "" && object[2] !== undefined ? true : false;

		let diag1 = object[0] === object[4] && object[4] === object[8] && object[0]; //!== "" && object[0] !== undefined ? true : false;

		let diag2 = object[2] === object[4] && object[4] === object[6] && object[2]; //!== "" && object[2] !== undefined ? true : false;

		if (row1 || row2 || row3 || col1 || col2 || col3 || diag1 || diag2) {

			b = true;

		}

		return b;

	}

	private isLastSpaceOnBoard(selectedBoard: number): boolean {

		if (!this.boards[selectedBoard]) return false;

		let squares = Object.values(this.boards[selectedBoard].squares || {});

		return squares.length === 8;

	}

	private hasWonBoard(selectedBoard: number, selectedSquare: number, symbol: 'x' | 'o'): boolean {

		let b = false;
			
		this.boards[selectedBoard].squares[selectedSquare].symbol = symbol; //squares<Square>

		let squares = {}; 
		
		this.boards[selectedBoard].squares.map((sq, index) => {
			squares[index] = sq.symbol;
		});

		// check to see if user has won the board and it's not already won
		if ( this.winLogic(squares) && !this.boards[selectedBoard].winningSymbol ) {

			b = true;

			this.boards[selectedBoard].winningSymbol = symbol;

		}

		return b;

	}

	private hasWonGame(): boolean { 

		let wonBoards = {};

		// must build object to pass into winLogic		
		this.boards.map((element, index) => {

			wonBoards[index] = element['winningSymbol'];
			
		});	
		
		return this.winLogic(wonBoards);

	}

	private isBoardFull(selectedBoard): boolean {
		
		if (!this.boards[selectedBoard]) return false;

		let b = true;

		let squares = Object.values(this.boards[selectedBoard].squares);

		squares.forEach((square) => {

			if (!square.symbol) {

				b = false;
				
			}

		});

		return b;

	}

	private invalidMove(): void {

		this._sharedService.notifyMessage = 'invalid move';

	}
	

	public isMoveValid(event, data, validCB): any {

		let b = false;

		let selectedBoard = data['board'];

		let selectedSquare = data['square'].squareNumber;

		let isLastSpace = this.isLastSpaceOnBoard(selectedBoard);

		let fullBoard = this.isBoardFull(selectedSquare);

		let winner;

		// square has not been taken, selected board is not the previous board unless it's the last space, it's valid
		if (!data['square'].symbol && !fullBoard && (this.activeBoard === selectedBoard && this.firstTurnHasBeenTaken) && (this.prevBoard !== selectedSquare) || isLastSpace ) {
			
			this.activeBoard = selectedSquare;

			b = true;

		} else if (!data['square'].symbol && !this.firstTurnHasBeenTaken) {

			this.activeBoard = selectedSquare;

			this.firstTurnHasBeenTaken = true;

			b = true;

		}

		if (!b) {
			
			this.invalidMove();

			return;

		} 
		
		b = this.hasWonBoard(selectedBoard, selectedSquare, this.assocSymbol);

		if (b) {

			this.isGameOver = this.hasWonGame();

			console.log('isGameOver', this.isGameOver);

			if (this.isGameOver) {
	
				winner = this._sharedService.user.uid;

			}

		}

		this.prevBoard = selectedBoard;

		validCB({
			activeBoard: this.activeBoard,
			prevBoard: this.prevBoard,
			turn: this.userTurn, 
			boards: this.boards,
			isGameOver: this.isGameOver,
			winner
		});

	}

	public setBoardData(data: any): void {

		let { 
			boards,
			prevBoard,
			activeBoard,
			playerList,
			userTurn
		} = data;

		this.prevBoard = prevBoard;

		this.activeBoard = activeBoard;

		this.userTurn = userTurn;

		this.assocSymbol = playerList[this._sharedService.user.uid].assocSymbol;

		this.playerList = Object.values(playerList);

		// for new game purposes
		this.firstTurnHasBeenTaken = this.activeBoard ? true : false; 

		if (this.prevBoard)
		 	return this.insertBoardOnList(this.prevBoard, boards)

		this.boards = boards;

	}


	private insertBoardOnList(index: number, boards: Array<Board>): void {
		
		this.boards.splice(index, 1, boards[index]);

	}

}