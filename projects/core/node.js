/**
 * Constants
 */
const INCH_PORT = 32323;

/** 
 * Module dependencies
 */
var zmq = require('zmq');
var inch = require('./inch.js');

/**
 * Node object
 * @param {String} host    node hostname
 * @param {String} name    node canonical name
 * @param {String} ip      node IP address
 * @param {String} my_uuid current uuid
 * @param {String} uuid    node uuid
 */
function Node (host, name, ip, my_uuid, uuid)
{
	this.id = uuid;
	this.host = host;
	this.name = name;
	this.ip = filter_ipv4(ip);
	if(my_uuid != uuid){
		this.subscribe_socket = new SubSocket(this.ip, host);
	}else{
		this.subscribe_socket = null;
	}
}

Node.prototype.disconnect = function() {
	if (this.subscribe_socket != null) {
		subscribe_socket.disconnect('tcp://'+this.ip+':'+INCH_PORT);
	}
};

module.exports = Node;

/**
 * SubSocket object
 * 
 * @param {String} peer IP address of the peer
 * @param {String} host hostname of the peer
 */
function SubSocket (peer, host){
	var subscriber = zmq.socket('sub');
	subscriber.connect('tcp://'+peer+':'+INCH_PORT);
	subscriber.subscribe('');
	subscriber.identity = host ;

	console.log('+[INCH] Subscribe to '+peer);

	subscriber.on("message", function(msg) {
		console.log('>[INCH] From ' + subscriber.identity +' : ' + msg.toString());
		inch.handleMessage(peer, msg);
		
	});

	subscriber.on('error', function(err) {
		console.log('![INCH] Subscriber error'+err);
	});

	return subscriber;
}

/**
 * filter_ipv4 filtering ipv6 addresses in the "addresses" field of the object return by the mdns browse]
 * @param  {String[]} addresses [description]
 * @return {String}             [first IPv4 address found]
 */
function filter_ipv4(addresses){
	var res = "undefined";
	for (k in addresses){
		if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(addresses[k])) 
			res = addresses[k];
	}
	return res;
}