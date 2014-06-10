/**
 * Constants
 */
const NODE_SERVICE = 'node'; // _node._tcp
const INCH_PORT = 32323;
const LOCAL_PORT = 42424;
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
var inch = require('./inch.js');

/**
 * Core object
 *
 * @name		hostname of the current computer
 * @uuid		unique identifier of the current core process
 * @nodes		array of Node objects 
 * @publisher	publisher socket (ZeroMQ) for information channel (InCh)
 * @loch		local udp socket (unused)
 * @advertiser	mDNS advertiser of service _node._tcp
 * @browser		DNS-SD browser of _node._tcp services		
 * @mach		tcp socket for direct communication between node's core (MaCh)
 */
function Core()
{
	this.name = require('os').hostname();
	this.uuid = uuid.v1();
	this.nodes = [];
	this.publisher = zmq.socket('pub');	// publisher socket (inch)
	this.subscriber = zmq.socket('sub');
	this.loch = dgram.createSocket('udp4');	// local channel
	this.requester = zmq.socket('req');
	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = createAdvertisement(this.uuid);
	// _node._tcp. service browser
	this.browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));
	this.mach = zmq.socket('rep');
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
	this.loch.bind(LOCAL_PORT, function() {
		var address = self.loch.address();
		console.log('+[LOCH] UDP socket listening on '+address.address+':'+address.port);
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
			console.log('+[MACH] Publisher socket listening on '+MACH_PORT);
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
self.mach.on('message', function(data) {
	self.emit('mach', JSON.parse(data));
});

/**
 * Display errors with sub socket
 */
self.subscriber.on('error', function(err) {
	console.log('![SUB] Subscriber '+err);
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
 * Delete dead node from local node list
 */
self.browser.on('serviceDown', function(service) {
	console.log('-[mDNS] Service down: '+service.name+' ('+service.networkInterface+')');
	deleteDeadNode(self.nodes,service.name);
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
 * Delete node when service down
 * @param  {Node[]}	nodes      list of Node objects
 * @param  {String} node_name  node canonical name to be deleted
 */
function deleteDeadNode(nodes, node_name){
	var index = null;
	for(k in nodes){
		if (nodes[k].name == node_name)  index = k;
	}
	if(index != null) {
		nodes.splice(index,1);
		console.log('-[CORE] Deleting node '+node_name);
	}
	else {
		console.log('![CORE] Error cannot delete node '+node_name+', not found ; no harm, maybe just a duplicate serviceDown');
	}
}

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
	this.requester.connect('tcp://'+dst+':'+MACH_PORT);
	this.requester.send(this.createMessage(cmd, data));
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