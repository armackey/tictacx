"use strict";
exports.__esModule = true;
var express = require("express");
require('reflect-metadata');
require('zone.js/dist/zone-node');
var readFileSync = require('fs').readFileSync;
var port = process.env.PORT || 9000;
var path = require('path');
var join = path.join;
var enableProdMode = require('@angular/core').enableProdMode;
var renderModuleFactory = require('@angular/platform-server').renderModuleFactory;
var DIST_FOLDER = join(process.cwd(), 'dist');
var AppServerModuleNgFactory = require('../../dist/server/main').AppServerModuleNgFactory;
var App = require('./app').App;
var app = new App().express;
var firebase = require('firebase');
var config = require('./firebase-request/firebase.service.config').getConfig();
firebase.initializeApp(config);
// begin: ssr
enableProdMode();
var template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
app.engine('html', function (_, options, callback) {
    var opts = { document: template, url: options.req.url };
    renderModuleFactory(AppServerModuleNgFactory, opts)
        .then(function (html) { return callback(null, html); });
});
app.set('view engine', 'html');
app.set('views', 'src');
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));
app.get('*', function (req, res) {
    res.render('index', { req: req });
});
// end: ssr
app.listen(port, function (err) {
    if (err) {
        return console.error(err);
    }
    return console.log("server is listening on " + port);
});
