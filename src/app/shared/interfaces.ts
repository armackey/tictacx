import { Observable } from "tns-core-modules/ui/page/page";
import { Injectable } from "@angular/core";

export interface BoardsResolved {
	boards: Board[];
	error?: any;
}

export interface Board {
	winnerUserId?: string; // winner's uid
	winningSymbol?: 'x' | 'o';
	boardNumber: number;
	squares: Array<Square>; //{ 0?: string, 1?: string, 2?: string, 3?: string, 4?: string, 5?: string, 6?: string, 7?: string, 8?: string };
}

// export interface Board {
// 	number: number,
// 	symbolConquered?: 'x' | 'o',
// 	conquredUID?: string,
// 	squares: Array<Square>
// }


export interface Square {
	symbol?: 'x' | 'o';
	squareNumber: number;
}

export interface FireBaseClass {
	// login(email: string, password: string): Promise<any>;
	sendMove(gameType: string, gameId: string, square: Square): Promise<any>;
	listenToMoves(gameType: string, gameId: string, cb: Function): void;
	loadSelectedGame(gameId: string): any;
	loadGameList(): any;
	logout(): void;
	unsubscribeFromListeners(): void;
	// isUserLoggedIn(): Promise<any>;
	// listenToAuthChanges(loggedInCb: Function, notLoggedInCb: Function): Promise<any>;
	// createUser(data): Promise<any>;
	// anonLogin(): Promise<any>;
	// createEmailAndPassword(email: string, password: string): Promise<any>;
	// loginFacebook(): Promise<any>;
}

@Injectable({
	providedIn: 'root'
})
export class User {
	username?: string;
	uid: string;
	email?: string;
	name?: string;
}