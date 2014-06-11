#!/usr/bin/env node

var express = require('express');
var api = express();

var core = require('./manticore.js');
var interactive = require('./interactive.js');
var trigger = require('./trigger.js');

// Start HTTP server to serve JSON API
api.listen(3000, function() {
	console.log('+[HTTP] Listening on 3000');
});

/**
 * Handles the 'ready' event on the core
 * This implies that the core has started
 * and that all the communication channels have been set up
 */
core.on('ready', function() {

	api.get('/', function(req, res) {
		res.set({'Content-Type': 'application/json'});
		res.send({nodes: core.nodes });
	});

	api.get('/request/:id', function(req, res) {
		console.log('+[HTTP] Request id '+req.param('id'));
		if (core.findNodeById(req.param('id')))
			core.syncSend(req.param('id'), 'request', req.param('id'),function(reply) {
				console.log('reply:'+reply.toString());
				if (reply.status)
					res.send(true);
				else
					res.send(false);
			});
		else {
			res.send(false);
			console.log('![HTTP] id not found');
		}
	});
});

/**
 * Handles the 'inch' event on the core
 * This event corresponds to the reception of a message on the subscriber socket
 */
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
					core.send(dst, 'raw', stdout+stderr);
				else
					console.log('![CORE] Cannot send reply to '+data.name);
			});
			break;
		default:
			console.log('![INCH] No message type');
			console.log(data.payload);
	}
});

/**
 * Handles the 'mach' event on the core
 * This event corresponds to the reception of a msg of the router (aka mach or replier) socket
 * Depending on the type of message received :
 *		- an action is triggered
 *		- nothing is done
 *		- we use the core.reply() command to send a response
 */
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
		case 'request':
			console.log(data.payload);
			core.reply('ack', envelope, {status: true});
			// NOT YET IMPLEMENTED
			// To request a resource
			// Need to trigger.check() (resource availability)
			// Need to send a response true/false according to availability
			// May need to trigger.generate()
			// Need to trigger.execute()
			break;
		case 'release':
			console.log(data.payload);
			// NOT YET IMPLEMENTED
			// To release a resource
			// Need to trigger.kill()
			break;
		default:
			console.log('![INCH] No message type');
			console.log(data.payload);
	}
});

/**
 * Handles the 'reply' event on the core
 */
core.on('reply', function(data) {
	console.log('>[MACH] '+data.name+' replied with '+data.type);
	switch(data.type) {
		default:
			console.log(data.payload);
	}
});

/**
 * Handles the 'test' event on the core
 * Used for debug purpose only
 */
core.on('test', function(){
	console.log('test');
	this.syncRequester.connect('tcp://192.168.0.20:45454');
	this.syncRequester.send(JSON.stringify(this.createMessage('request', 'hi')));

		// this.syncRequester.on('message', function(data) {

		// });
	//this.syncRequester.close();
	// var dealer = require('zmq').socket('dealer');
	// dealer.connect('tcp://192.168.1.171:45454');
	// dealer.send(JSON.stringify(this.createMessage('request', 'hi')));
});

/**
 * Gracefully exit on SIGINT (Ctrl+C)
 * Clean up and exit
 */
process.on('SIGINT', function() {
	core.close();
});

/**
 * Eventually initialize the core, everything starts from here
 * Note : in order to avoid asunc issues, register callbacks event before calling init()
 */
core.init();
