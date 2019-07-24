import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
// import * as adminCredentials from '../admin-credentials';
import * as serviceAccount from './admin-credentials.json';
// var serviceAccount = require("./admin-credentials.json");
const sAccount = (<any>serviceAccount);

admin.initializeApp({
	credential: admin.credential.cert(sAccount),
	databaseURL: "https://tictacx-16b0a.firebaseio.com"
});

function createGameId(req, res) {

	let { gameType, uid, numberOfPlayers } = req.body;

	numberOfPlayers = numberOfPlayers || 2;

	let gameId = firebase.database().ref().child(gameType).push('').key;

	firebase.database().ref().child(`/active-games/${uid}/${gameType}`).push(gameId);

	firebase.database().ref().child(`${gameType}/${gameId}/`).set({
		gameId,
		numberOfPlayers,
		userTurn: uid,
		boards: createBoards(gameType)
	});

	addUserToGame(gameType, gameId, uid, determineAssocSymbol(gameType, {}));

	res.send({ gameId });

};

exports.createGameId = createGameId;

export async function findGame(req, res, next) {

	let { gameType, uid } = req.body;
	
	let list = await getGameList(gameType);
	
	list = (<any>Object).values(list).filter(l => (l['playerList']) && Object.keys(l['playerList'] || []).length < l['numberOfPlayers']);
	
	if (!list.length) {

		createGameId(req, res);

		return;

	}
	

	let assocSymbol = determineAssocSymbol(gameType, list[0]['playerList']);
	
	addUserToGame(gameType, list[0]['gameId'], uid, assocSymbol);
	
	res.send(list[0]);
	
};

export async function verifyTokenId(req, res) {

	let { tokenId } = req.body;

	try {

		let decodedToken = await admin.auth().verifyIdToken(tokenId);

		let uid = decodedToken.uid;

		res.send({ uid });	

	} catch (error) {

		res.send({error});
		
	}

}

function determineAssocSymbol(gameType, playerList) {

	let symbol;

	if (gameType === 'tictac') {

		let oCount = 0,
			xCount = 0;

		(<any>Object).values(playerList).forEach(item => {

			if (item['assocSymbol'] === 'x')
				xCount++;
			if (item['assocSymbol'] === 'o')
				oCount++;

		});

		if (xCount > oCount)
			symbol = 'o';
		else
			symbol = 'x';

	}

	return symbol;

}

function addUserToGame(type: string, gameId: string, uid: string, assocSymbol: string) {

	firebase.database().ref().child(`${type}/${gameId}/playerList/${uid}`).set({
		uid,
		assocSymbol
	});

}

function getGameList(type: string) {

	return firebase.database().ref().child(type).once('value').then(r => {

		return r.val();

	});

}


function createBoards(gameType: string): any {

	if (gameType === 'tictac') {

		return createTicTacBoards();
		
	}

}

function createTicTacBoards(): Array<any> {

	let b = [];

	function createSquareCollection() {

		return <any>[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {

			let square = {
				squareNumber: index
			};

			return square;

		});
	}


	[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {

		b.push({
			boardNumber: index,
			squares: createSquareCollection()
		});

	});

	return b;

}

//TODO: get active games and list them..