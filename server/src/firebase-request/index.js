"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var firebase = require("firebase");
function createGameId(req, res) {
    var _a = req.body, gameType = _a.gameType, uid = _a.uid, numberOfPlayers = _a.numberOfPlayers;
    numberOfPlayers = numberOfPlayers || 2;
    var gameId = firebase.database().ref().child(gameType).push('').key;
    firebase.database().ref().child("/users/" + uid + "/" + gameType).push(gameId);
    firebase.database().ref().child(gameType + "/" + gameId + "/").set({
        gameId: gameId,
        numberOfPlayers: numberOfPlayers
    });
    addUserToGame(gameType, gameId, uid, determineAssocSymbol('tictac', {}));
    res.send({ gameId: gameId });
}
exports.createGameId = createGameId;
;
// exports.createGameId = createGameId;
function findGame(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, gameType, uid, list, assocSymbol;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, gameType = _a.gameType, uid = _a.uid;
                    return [4 /*yield*/, getGameList(gameType)];
                case 1:
                    list = _b.sent();
                    list = Object.values(list).filter(function (l) { return (l['playerList']) && Object.keys(l['playerList'] || []).length < l['numberOfPlayers']; });
                    if (!list.length) {
                        createGameId(req, res);
                        return [2 /*return*/];
                    }
                    assocSymbol = determineAssocSymbol(gameType, list[0]['playerList']);
                    addUserToGame(gameType, list[0]['gameId'], uid, assocSymbol);
                    res.send(list[0]);
                    return [2 /*return*/];
            }
        });
    });
}
exports.findGame = findGame;
;
function determineAssocSymbol(gameType, playerList) {
    var symbol;
    if (gameType === 'tictac') {
        if (playerList === null) {
            return 'x';
        }
        var oCount_1 = 0, xCount_1 = 0;
        Object.values(playerList).forEach(function (item) {
            if (item['assocSymbol'] === 'x')
                xCount_1++;
            if (item['assocSymbol'] === 'o')
                oCount_1++;
        });
        if (xCount_1 > oCount_1)
            symbol = 'o';
        else
            symbol = 'x';
    }
    return symbol;
}
function addUserToGame(type, gameId, uid, assocSymbol) {
    firebase.database().ref().child(type + "/" + gameId + "/playerList/" + uid).set({
        uid: uid,
        assocSymbol: assocSymbol
    });
}
function getGameList(type) {
    return firebase.database().ref().child(type).once('value').then(function (r) {
        return r.val();
    });
}
//TODO: get active games and list them..
