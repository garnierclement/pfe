#!/usr/bin/env node

/* Constants */
const NODE_SERVICE = 'node';
const INCH_PORT = 32323;
const LOCAL_PORT = 42424;

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

// for UDP sockets
var dgram = require('dgram');

/* SubSocket object */
function SubSocket (peer){
	var subscriber = zmq.socket('sub');
	subscriber.connect('tcp://'+peer+':'+INCH_PORT);
	subscriber.subscribe('');

	console.log('[INCH] Subscribe to '+peer);

	subscriber.on("message", function(msg) {
  		console.log('[INCH] Received s' , msg.toString());
	});

	subscriber.on('error', function(err) {
		console.log('[INCH] Subscriber error'+err);
	});
}

// function filtering ipv6 addresses in the "addresses" field of the object return by the mdns browse
// need testing
function filter_ipv4(addresses){
	var res = "undefined";
	for (k in addresses){
		if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(addresses[k])) 
			res = addresses[k];
	}
	return res;
}

/* Node object */
function Node (host, ip)
{
	this.host = host;
	this.ip = filter_ipv4(ip);
	this.id = "";
	this.subscribe_socket = new SubSocket(this.ip);
}


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

	// local channel
	this.loch = dgram.createSocket('udp4');

	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = mdns.createAdvertisement(mdns.tcp(NODE_SERVICE), INCH_PORT);

	// _node._tcp. service browser
	this.browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));

	// browser events
	this.browser.on('serviceUp', function(service) {
		console.log('[INCH] Service up: '+service.name+' at '+service.addresses+' ('+service.networkInterface+')');
		self.nodes.push(new Node(service.name, service.addresses));
		
	});
	this.browser.on('serviceDown', function(service) {
		console.log('[INCH] Service down: '+service.name+' ('+service.networkInterface+')');
	});

	this.browser.on('error', function(error) {
		console.log('[INCH] Browser error: '+error)
	});

	// initialisation
	this.init = function() {
		// start init
		console.log('[CORE] Core starting on '+self.name);
		// bind local socket
		self.loch.bind(LOCAL_PORT, '127.0.0.1', function() {
			var address = self.loch.address();
			console.log('[LOCH] Local UDP socket listening on '+address.address+':'+address.port);
		});
		// TODO for all theses initialization
		// see if async and waterfall can simplify the code (callback hell ?)
		self.publisher.bind('tcp://*:'+INCH_PORT, function(err) {
			if (err) {
				console.log('[INCH] Publisher binding error: '+err);
			}
			else {
				// bind ok
				console.log('[INCH] Publisher socket listening on '+INCH_PORT);
				// start advertising
				self.advertiser.start();
				console.log('[CORE] Advertising _'+NODE_SERVICE+'._tcp on '+INCH_PORT);
				// start browser
				self.browser.start();
				console.log('[INCH] Start browsing for _'+NODE_SERVICE+'._tcp services');

			}
		});
	};

	// closing, cleaning
	this.close = function() {
		self.browser.stop();
		self.advertiser.stop();
		console.log('[CORE] Closing');
		process.exit();
	};
}
util.inherits(Core, EventEmitter);

// return true if runs on Mac OS X
function isDarwin() {
	if (require('os').platform() == 'darwin') return true;
	else return false;
}

// return true if runs on Linux
function isLinux() {
	if (require('os').platform() == 'linux') return true;
	else return false;
}


/// Testing part

var c = new Core();

// gracefully exit on ctrl+C (SIGINT)
process.on('SIGINT', function() {
  //subscriber.close();
  c.close();
});



process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  	var chunk = process.stdin.read();
  	if (chunk !== null) {
   		c.publisher.send(chunk);
   		console.log("Inch : Published ==>: "+chunk);
  	}
});
// register callback on events before init
c.init();
