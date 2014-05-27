#!/usr/bin/env node

/* Constants */
const NODE_SERVICE = 'node';
const PUBLISH_PORT = 32323;

/* Dependencies */

// Zeroconf / mDNS / DNS-SD
// npm install mdns2
var mdns = require('mdns2');

// ZeroMQ
// npm install zmq
var zmq = require('zmq');

// In order to extend the Core class to be an EventEmitter
var util = require('util'),
	EventEmitter = require('events').EventEmitter;


/* Core object */
function Core() 
{
	var self = this;

	// name
	this.name = require('os').hostname();

	// toString()
	this.toString = function() 
	{
		return this.name;
	};

	// publisher socket (inch)
	this.publisher = zmq.socket('pub');

	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = mdns.createAdvertisement(mdns.tcp(NODE_SERVICE), PUBLISH_PORT);

	// initialisation
	this.init = function() 
	{
		console.log('[CORE] Core starting on '+self.name);
		// TODO for all theses initialization
		// see if async and waterfall can simplify the code (callback hell ?)
		self.publisher.bind('tcp://*:'+PUBLISH_PORT, function(err) {
			if (err) {
				console.log('[INCH] Publisher binding error: '+err);
			}
			else {
				console.log('[INCH] Publisher socket listening on '+PUBLISH_PORT);
				self.advertiser.start();
				console.log('[CORE] Advertising '+NODE_SERVICE+' on '+PUBLISH_PORT);
			}
		});
	};
}
util.inherits(Core, EventEmitter);




/// Testing part

var c = new Core();


// register callback on events before init
c.init();
