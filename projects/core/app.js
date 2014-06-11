#!/usr/bin/env node

var express = require('express');
var api = express();

var core = require('./manticore.js');
var interactive = require('./interactive.js');
var trigger = require('./trigger.js');

// Gracefully exit on SIGINT (Ctrl+C)
process.on('SIGINT', function() {
	core.close();
});

// Start HTTP server to serve JSON API
api.listen(3000, function() {
	console.log('+[HTTP] Listening on 3000');
});

// Upon core initialization, we can respond to http request
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

// Upon receiving a message on Inch
core.on('inch', function(data) {
	console.log('>[INCH] '+data.type+' from '+data.name);
	switch(data.type) {
		case 'raw':
			console.log(data.payload);
			break;
		case 'exec': 
			trigger.execute(data.payload, function(stdout, stderr){
				var dst = core.getNodeIpById(data.src)
				console.log('+[CORE] Sending result of execution to '+data.name+'('+dst+')');
				if (dst != null)
					core.send(dst, 'raw', stdout);
				else
					console.log('-[CORE] Cannot send reply to '+data.name);
			});
			break;

		default:
			console.log('![INCH] No message type');
			console.log(data.payload);
	}
});

// Upon receiving a message on MaCh
core.on('mach', function(envelope, data) {
	console.log('>[MACH] '+data.type+' from '+data.name);
	switch(data.type) {
		case 'raw':
			console.log(data.payload);
			core.reply('ack', envelope, "Bien reçu !");
			break;
		case 'ack':
			console.log(data.payload);
			break;
		default:
			console.log('![INCH] No message type');
			console.log(data.payload);
	}

});

core.on('reply', function(data) {
	console.log('>[MACH] '+data.name+' replied with '+data.type);
	switch(data.type) {
		default:
			console.log(data.payload);
	}
});

// Test core event
core.on('test', function(){
	console.log('test');
});

// Initialize core, everything starts from here
// Note : in order to avoid asunc issues, register callbacks event before calling init()
core.init();



