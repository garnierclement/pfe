/**
 * Constants
 */
const NODE_SERVICE = 'node'; // _node._tcp
const INCH_PORT = 32323;
const UDP_PORT = 42424;
const MACH_PORT = 45454;

/** 
 * Module dependencies
 */
var uuid = require('uuid');
var mdns = require('mdns');		// Zeroconf / mDNS / DNS-SD
var zmq = require('zmq');		// ZeroMQ
var dgram = require('dgram');	// for UDP sockets
var util = require('util'),		// extend the Core to be an EventEmitter
	EventEmitter = require('events').EventEmitter;

var Node = require('./node.js');// Node object

/**
 * Core object
 *
 * @name		hostname of the current computer
 * @uuid		unique identifier of the current core process
 * @nodes		array of Node objects 
 * @publisher	publisher socket (ZeroMQ) for information channel (InCh)
 * @udp			udp socket (unused)
 * @advertiser	mDNS advertiser of service _node._tcp
 * @browser		DNS-SD browser of _node._tcp services		
 * @mach		tcp socket for direct communication between node's core (MaCh)
 */
function Core()
{
	this.name = require('os').hostname();
	this.uuid = uuid.v1();
	this.nodes = [];
	this.sensors = [];
	this.resources = [];
	this.publisher = zmq.socket('pub');	// publisher socket (inch)
	this.subscriber = zmq.socket('sub');
	this.udp = dgram.createSocket('udp4');	// local channel
	this.requester = zmq.socket('dealer');
	this.mach = zmq.socket('router');
	this.syncRequester = zmq.socket('req');
	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = createAdvertisement(this.uuid);
	// _node._tcp. service browser
	this.browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));
}
// Inherit from `EventEmitter.prototype`.
util.inherits(Core, EventEmitter);

// Expose the Core singleton 
// Provide self for convenience within module
var self = module.exports = new Core();

/**
 * Initiliaze the Core singleton
 * Binding sockets, advertising and browsing for other _node._tcp cores
 * Emit 'ready' event when initialized
 */
Core.prototype.init = function() {
	console.log('+[CORE] Core starting on '+this.name);
	// bind local socket
	this.udp.bind(UDP_PORT, function() {
		var address = self.udp.address();
		console.log('+[UDP] UDP socket listening on '+address.address+':'+address.port);
	});
	// bind publish socket and start advertising and browsing
	this.publisher.bind('tcp://*:'+INCH_PORT, function(err) {
		if (err) {
			console.log('![PUB] Publisher binding error: '+err);
		}
		else {
			console.log('+[PUB] Publisher socket listening on '+INCH_PORT);
			self.advertise();
			self.browse();
		}
	});
	// bind mach channel
	this.mach.bind('tcp://*:'+MACH_PORT, function(err) {
		if (err)
			console.log('![MACH] Socket binding error: '+err);
		else
			console.log('+[MACH] Socket listening on '+MACH_PORT);
	});
	// subscribe socket
	this.subscriber.identity = this.name;
	this.emit('ready');
};

/**
 * Start mDNS advertisement of _node._tcp service
 */
Core.prototype.advertise = function() {
	this.advertiser.start();
	console.log('+[CORE] Advertising _'+NODE_SERVICE+'._tcp on '+INCH_PORT);
};

/**
 * Start discovery of _node._tcp services
 */
Core.prototype.browse = function() {
	this.browser.start();
	console.log('+[mDNS] Start browsing for _'+NODE_SERVICE+'._tcp services');
};

/**
 * Handle the reception of messages on the subscriber socket (inch)
 * Emits 'inch' event on core
 * 
 * @param  {blob} data [blob of data (JSON)]
 */
self.subscriber.on('message', function(data) {
	self.emit('inch', JSON.parse(data));
});

/**
 * Wrappers arount socket reception of message
 * Emits 'mach' event on core
 * 
 * @param  {blob} data [blob of data (JSON)]
 */

self.mach.on('message', function() {
	console.log(':[DBUG] Router: '+arguments.length);
	for (k in arguments)
		console.log(arguments[k].toString());
	switch (arguments.length) {
		case 2:
			var envelope = arguments[0];
			var data = arguments[1];
			break;
		case 3:
			var envelope = arguments[0];
			var data = arguments[2];
			break;
		default:
			return;
	}
	
	self.emit('mach', envelope, JSON.parse(data));
});

self.requester.on('message', function(data) {
	console.log(':[DBUG] Dealer: '+arguments.length);
	for (k in arguments)
		console.log(arguments[k].toString());
	switch (arguments.length) {
		case 2:
			var data = arguments[1];
			break;
		case 3:
			var data = arguments[2];
			break;
		default:
			return;
	}
	self.emit('reply', JSON.parse(data));
});

/**
 * Display errors with sockets
 */
self.subscriber.on('error', function(err) {
	console.log('![SUB] Socket error: '+err);
});

self.mach.on('error', function(err) {
	console.log('![REP] Socket error: '+err);
});

self.requester.on('error', function(err) {
	console.log('![REQ] Socket error: '+err);
});

self.publisher.on('error', function(err) {
	console.log('![PUB] Socket error: '+err);
});

/**
 * Handle the discovery of new _node._tcp service
 * (mDNS browser event)
 */
self.browser.on('serviceUp', function(service) {
	console.log('+[mDNS] Service up: '+service.name+' at '+service.addresses+' ('+service.networkInterface+')');

	if(!self.findNodeById(service.txtRecord.id))
	{
		var new_node = new Node(service);
		self.nodes.push(new_node);
		if (self.uuid != service.txtRecord.id) {
			self.newSubscribe(new_node.ip);
		}
		console.log('+[CORE] Adding node id '+service.txtRecord.id);
	}
	else {
		console.log('![CORE] Node id '+service.txtRecord.id+' is already present');
	}
});

/**
 * Subscribe to new discovered node
 * 
 * @param  {String} peer [IP address of the new discovered node]
 */
Core.prototype.newSubscribe = function(peer) {
	this.subscriber.connect('tcp://'+peer+':'+INCH_PORT);
	this.subscriber.subscribe('');
	console.log('+[SUB] Subscribing to '+peer);
};

/**
 * Delete dead node from local node list when 'serviceDown'
 */
self.browser.on('serviceDown', function(service) {
	console.log('-[mDNS] Service down: '+service.name+' ('+service.networkInterface+')');
	self.deleteDeadNode(service.name);
});

/**
 * Handle mDNS browser errors
 */
self.browser.on('error', function(error) {
	console.log('![mDNS] Browser error: '+error);
});

/**
 * Get the name of the Core
 */
Core.prototype.toString = function() {
	return this.name;
};

/**
 * Stopping mDNS advertising/browsing,
 * closing sockets and exiting
 */
Core.prototype.close = function(exit) {
	console.log('[CORE] Closing');
	this.browser.stop();
	this.advertiser.stop();
	this.publisher.close();
	this.subscriber.close();
	this.requester.close();
	this.udp.close();
	if (typeof exit === "undefined")
		process.exit();
};

/**
 * [publish description]
 * @param  {[type]} data [description]
 */
Core.prototype.publish = function(data) {
	this.publisher.send(JSON.stringify(data));
};

/**
 * Create an object representing the structure of message
 * used between cores
 * always adding name and uuid
 * 
 * @param  {String} cmd  [type of the message]
 * @param  {?}		data [payload of the message]
 * @return {Object}      [message sent on the socket]
 */
Core.prototype.createMessage = function(cmd, data) {
	return {src: this.uuid, name: this.name, type: cmd, payload: data};
};

Core.prototype.send = function(dst, cmd, data) {
	if (dst != null) {
		this.requester.connect('tcp://'+dst+':'+MACH_PORT);
		this.requester.send([null, JSON.stringify(this.createMessage(cmd, data))]);
	}
};

Core.prototype.syncSend = function(dst_id, cmd, data, callback) {
	var socket = zmq.socket('req');
	var dst = this.getNodeIpById(dst_id);
	if (dst != null) {
		socket.connect('tcp://'+dst+':'+MACH_PORT);
		socket.send(JSON.stringify(this.createMessage(cmd, data)));
		console.log('+[SYNC] Sending '+data+' to '+dst);

		socket.on('message', function(data) {
			console.log('>[SYNC] Received '+data.toString());
			callback(JSON.parse(data));
			socket.close();
		});
	}
};

Core.prototype.reply = function(cmd, envelope, data) {
	var msg = this.createMessage(cmd, data);
	this.mach.send([envelope, '', JSON.stringify(msg)]);
};

/**
 * Delete node when service down
 * @param  {Node[]}	nodes      list of Node objects
 * @param  {String} node_name  node canonical name to be deleted
 */
Core.prototype.deleteDeadNode = function(node_name){
	var index = null;
	for(k in this.nodes){
		if (this.nodes[k].name == node_name)  index = k;
	}
	if(index != null) {
		if (node_name != this.name && this.nodes[index].ip != null) {
			this.subscriber.disconnect('tcp://'+this.nodes[index].ip+':'+INCH_PORT);
		}
		this.nodes.splice(index,1);
		console.log('-[CORE] Deleting node '+node_name);
	}
	else {
		console.log('![CORE] Error cannot delete node '+node_name+', not found ; no harm, maybe just a duplicate serviceDown');
	}
};

/**
 * Check if a particular node is present within a list of node
 * Using UUID to disambiguate nodes
 * 
 * @param  {String} uuid  [uuid of the sought node]
 * @return {Boolean}      [return true if found}
 */
Core.prototype.findNodeById = function (uuid){
	for(k in this.nodes){
		if (this.nodes[k].id == uuid)  
			return true;
	}
	return false;
};

Core.prototype.getNodeById = function(uuid){
	for(idx in this.nodes){
		if (this.nodes[idx].id == uuid)
			return this.nodes[idx];
	}
	return null;
};

Core.prototype.getNodeIpById = function(uuid){
	for(idx in this.nodes){
		if (this.nodes[idx].id == uuid)
			return this.nodes[idx].ip;
	}
	return null;
};

/**
 * Wrapper for creating mDNS advertiser
 * Using DNS TXT records to publish additional information of the node 
 * 
 * @param  {String} uuid identifier of the node
 * @return {mdns.Advertisement}
 */
function createAdvertisement(uuid)  {
    var mdns_txt_record = {
        id: uuid
    };
    
    var advertiser = mdns.createAdvertisement(mdns.tcp(NODE_SERVICE), INCH_PORT, {txtRecord: mdns_txt_record});
    advertiser.on('error', function(error) {
        console.log("![CORE] ", error);
        setTimeout(createAdvertisement, 30 * 1000);
    });
    return advertiser;
}

/**
 * Check if running on Mac OS X
 * @return {Boolean} true if OS X
 */
function isDarwin() {
	if (require('os').platform() == 'darwin') return true;
	else return false;
}

/**
 * Check if running on Linux
 * @return {Boolean} true if Linux
 */
function isLinux() {
	if (require('os').platform() == 'linux') return true;
	else return false;
}