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
	isWaitingForPlayers: boolean =  false;
	sharableLink: string;
	timeOutId: number;
	constructor(
		private _sharedService: SharedService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _user: UserService,
		public boardService: BoardService,
	) { 

	}

	ngOnInit() {
		
		if (this._sharedService.isServer) return;

		// after 10 seconds notify user to invite friend
		this.timeOutId = setTimeout(() => this.sharableLink = location.href, 10000);

		this.routeSub = this._route.data.subscribe(data => {

			const { resolvedData, inviteResolvedData } = data;

			if (resolvedData === null) {

				this._router.navigate(['home']);

				this._sharedService.notifyMessage = 'game does not exist';
				
				return;
			}

			const { gameId, userTurn } = resolvedData;

			this.boardService.gameId = gameId;

			this.boardService.gameType = 'tictac';

			if (data['isGameOver']) {

				this._sharedService.isGameOver = true;

				this._sharedService.notifyMessage = data['winner'] === this._user.uid ? 'congrats' : 'sorry you\'ve lost';

			}

			this.boardService.fireService.listenToMoves('tictac', gameId, (data) => {
				
				let { numberOfPlayers, playerList, boards } = data;

				// should only start game once all players have joined
				if (numberOfPlayers == Object.keys(playerList).length) {

					this.isWaitingForPlayers = false;

					this.boardService.setBoardData(data);

					this.removeTimeout();

				} else { 

					this.isWaitingForPlayers = true;

				}				
				

			});	

		});

	}

	removeTimeout(): void {
		
		if (this.timeOutId) {
			clearTimeout(this.timeOutId);
		}

	}


	ngOnDestroy() {
		
		if (this.routeSub) {
			this.routeSub.unsubscribe();
		}

		this.removeTimeout();
		
	}

}
