import express from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {
	ensureCookie,
	getUser,
	logout,
	authorize,
	getAccessToken,
	getUserPosition,
	getUserLinkedInProfile,
	getUserLinkedInProfilePicture,
} from './auth/index';
import cookieParser from 'cookie-parser';

const { createGameId, findGame, verifyTokenId}  = require('./firebase-request');
// import * as userControlller from './controllers/user/user.controller';

export class App {
	public express;
	public router;

	constructor() {
		this.express = express();
		this.router = express.Router();
		this.middleWare();
		this.mountRoutes();

		this.express.use(this.router);

		// Load enviromnet variables to process.env from .env file
		dotenv.config({ path: '.env' });
	}

	private middleWare(): void {
		const options: cors.CorsOptions = {
			allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
			credentials: true,
			methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
			origin: '*',
			preflightContinue: false
		};

		this.router.use(cors(options));
		this.router.options('*', cors(options));
		this.router.use(cookieParser());
		this.router.use(ensureCookie);
		this.express.use(compression());
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: true }));
		this.express.use((err, req, res, next) => {
			res.status(500).send(err.toString());
		});
	}

	private mountRoutes(): void {

		this.router.post('/getUserPosition', getUserPosition);

		this.router.post('/getUserPicture', getUserLinkedInProfilePicture);

		this.router.post('/getUserLinkedInProfile', getUserLinkedInProfile);

		this.router.post('/verifyTokenId', verifyTokenId);

		this.router.post('/oauth/user', getUser);

		this.router.get('/oauth/logout', logout);

		this.router.get('/oauth/linkedin', authorize);

		this.router.get('/oauth/linkedin/callback', getAccessToken);

		this.router.post('/createGameId', createGameId);

		this.router.post('/findGame', findGame);
		// this.router.get('/user', userControlller.get);
		// this.router.get('/user/:name', userControlller.get);
		// this.router.post('/user', userControlller.insert);

		// this.express.use('/api', this.router);
	}
}

// export default new App().express;
