import { Component, OnInit, ViewChildren, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
// import { GameManagerService } from '../game-manager/game-manager.service';
import { SharedService } from '../shared/shared-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board, Square } from '../shared/interfaces';
import { BoardService } from './board/board.service';
import { UserService } from '../shared/user/user.service';
import { Observable } from 'tns-core-modules/ui/page/page';

@Component({
	selector: 'app-tictac',
	templateUrl: './tictac.component.html',
	styleUrls: ['./tictac.component.css']
})
export class TictacComponent implements OnInit {

	routeSub: any;

	constructor(
		private _sharedService: SharedService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _user: UserService,
		public _boardService: BoardService,
	) { 
		
		if (this._sharedService.isServer) return;

	}

	ngOnInit() {
		
		if (this._sharedService.isServer) return;

		this.routeSub = this._route.data.subscribe(data => {

			console.log(data);

			const { resolvedData } = data;

			const { gameId, boards, numberOfPlayers, userTurn, playerList } = resolvedData;

			this._boardService.gameId = gameId;

			this._boardService.gameType = 'tictac';

			if (data['isGameOver']) {

				this._sharedService.isGameOver = true;

				this._sharedService.notifyMessage = data['winner'] === this._user.uid ? 'congrats' : 'sorry you\'ve lost';

			}

			

			if (!numberOfPlayers || !playerList) {
				// TODO: stop game from starting
			}

			// should only start game once all players have joined
			if (numberOfPlayers == Object.keys(playerList).length) {

				this._boardService.setBoardData(boards);

			}	



			console.log(gameId);

			this._boardService.fireService.listenToMoves('tictac', gameId, (data) => {

				// if (!data) return this._router.navigate(['home']); // if game does not exist send user home
					this._boardService.setBoardData(data);


			});	


		});

	}


	ngAfterViewInit() {

	}


	clearBoard(): void {


	}

	ngOnDestroy() {
		
		if (this.routeSub) {
			this.routeSub.unsubscribe();
		}

		this.clearBoard();
		
	}

}
