#!/usr/bin/env node

/* Constants */
const NODE_SERVICE = 'node';
const PUBLISH_PORT = 32323;

/* Dependencies */

// Zeroconf / mDNS / DNS-SD
// npm install mdns2
// switching to mdns2 because mdns does not seem to be maintain anymore
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

	// nodes
	// store node objects { name: "", id: "", ip: "", ...}
	this.nodes = [];

	// toString()
	this.toString = function() 
	{
		return this.name;
	};

	// publisher socket (inch)
	this.publisher = zmq.socket('pub');

	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = mdns.createAdvertisement(mdns.tcp(NODE_SERVICE), PUBLISH_PORT);

	// _node._tcp. service browser
	this.browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));

	// browser events
	this.browser.on('serviceUp', function(service) {
		console.log('[INCH] Service up: '+service.name+' at '+service.addresses[1]+' ('+service.networkInterface+')');
		//network_cap.nodes.push(new node(service.host, service.addresses));
  		//console.log(network_cap);
	});
	this.browser.on('serviceDown', function(service) {
		console.log('[INCH] Service down: '+service.name+' at '+service.addresses[1]+' ('+service.networkInterface+')');
	});

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
				// bind ok
				console.log('[INCH] Publisher socket listening on '+PUBLISH_PORT);
				// start advertising
				self.advertiser.start();
				console.log('[CORE] Advertising _'+NODE_SERVICE+'._tcp on '+PUBLISH_PORT);
				// start browser
				self.browser.start();
				console.log('[INCH] Start browsing for _'+NODE_SERVICE+'._tcp services');

			}
		});
	};
}
util.inherits(Core, EventEmitter);




/// Testing part

var c = new Core();


// register callback on events before init
c.init();
