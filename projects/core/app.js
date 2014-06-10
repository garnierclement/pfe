#!/usr/bin/env node

var express = require('express');
var api = express();
var exec = require('child_process').exec;

var core = require('./manticore.js');
var interactive = require('./interactive.js');

// Gracefully exit on SIGINT (Ctrl+C)
process.on('SIGINT', function() {
	core.close();
});

// Start HTTP server to serve JSON API
api.listen(3000, function() {
	console.log('+[HTTP] Listening on 3000');
});

// Upon core initialization
core.on('ready', function() {
	api.get('/', function(req, res) {
		res.set({'Content-Type': 'application/json'});
		res.send({nodes: core.nodes });
	});
	api.get('/request/:id', function(req, res) {
		console.log('+[HTTP] Request id '+req.param('id'));
		if (core.findNodeById(req.param('id')))
			res.send(true);
		else {
			res.send(false);
			console.log('![HTTP] id not found');
		}
	});
});

// Upon receiving a message on MaCh
core.mach.on('message', function(data) {
	console.log("+[MACH] "+data);
	this.send('ACK');
});

// Test core event
core.on('test', function(){
	console.log('test');
});

// Initialize core, everything starts from here
// Note : in order to avoid asunc issues, register callbacks event before calling init()
core.init();



