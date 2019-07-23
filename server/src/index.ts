import * as express from 'express';
require('reflect-metadata');
require('zone.js/dist/zone-node');

const { readFileSync } = require('fs');
const port = process.env.PORT || 9000;
const path = require('path');
const join = path.join;
const { enableProdMode } = require('@angular/core');
const { renderModuleFactory } = require('@angular/platform-server');
const DIST_FOLDER = join(process.cwd(), 'dist');
const { AppServerModuleNgFactory } = require('../../dist/server/main');

const { App } = require('./app');
const app = new App().express;
const firebase = require('firebase');
const config = require('./firebase-request/firebase.service.config').getConfig();

firebase.initializeApp(config);

// begin: ssr

enableProdMode();

const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

app.engine('html', (_, options, callback) => {
	const opts = { document: template, url: options.req.url };
	renderModuleFactory(AppServerModuleNgFactory, opts)
		.then(html => callback(null, html));
});

app.set('view engine', 'html');

app.set('views', 'src')

app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

app.get('*', (req, res) => {
	res.render('index', { req });
});

// end: ssr

app.listen(port, (err) => {
	if (err) {
		return console.error(err);
	}

	return console.log(`server is listening on ${port}`);
});