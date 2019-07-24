"use strict";
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
var compression_1 = require("compression");
var body_parser_1 = require("body-parser");
var dotenv_1 = require("dotenv");
var index_1 = require("./auth/index");
var cookie_parser_1 = require("cookie-parser");
var _a = require('./firebase-request'), createGameId = _a.createGameId, findGame = _a.findGame, verifyTokenId = _a.verifyTokenId, joinGameByInvite = _a.joinGameByInvite;
// import * as userControlller from './controllers/user/user.controller';
var App = /** @class */ (function () {
    function App() {
        this.express = express_1["default"]();
        this.router = express_1["default"].Router();
        this.middleWare();
        this.mountRoutes();
        this.express.use(this.router);
        // Load enviromnet variables to process.env from .env file
        dotenv_1["default"].config({ path: '.env' });
    }
    App.prototype.middleWare = function () {
        var options = {
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: '*',
            preflightContinue: false
        };
        this.router.use(cors_1["default"](options));
        this.router.options('*', cors_1["default"](options));
        this.router.use(cookie_parser_1["default"]());
        this.router.use(index_1.ensureCookie);
        this.express.use(compression_1["default"]());
        this.express.use(body_parser_1["default"].json());
        this.express.use(body_parser_1["default"].urlencoded({ extended: true }));
        this.express.use(function (err, req, res, next) {
            res.status(500).send(err.toString());
        });
    };
    App.prototype.mountRoutes = function () {
        this.router.post('/getUserPosition', index_1.getUserPosition);
        this.router.post('/getUserPicture', index_1.getUserLinkedInProfilePicture);
        this.router.post('/getUserLinkedInProfile', index_1.getUserLinkedInProfile);
        this.router.post('/verifyTokenId', verifyTokenId);
        this.router.post('/oauth/user', index_1.getUser);
        this.router.get('/oauth/logout', index_1.logout);
        this.router.get('/oauth/linkedin', index_1.authorize);
        this.router.get('/oauth/linkedin/callback', index_1.getAccessToken);
        this.router.post('/createGameId', createGameId);
        this.router.post('/findGame', findGame);
        this.router.post('/joinGameByInvite', joinGameByInvite);
        // this.router.get('/user', userControlller.get);
        // this.router.get('/user/:name', userControlller.get);
        // this.router.post('/user', userControlller.insert);
        // this.express.use('/api', this.router);
    };
    return App;
}());
exports.App = App;
// export default new App().express;
