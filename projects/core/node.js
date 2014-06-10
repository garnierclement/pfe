/**
 * Constants
 */
const INCH_PORT = 32323;

/** 
 * Module dependencies
 */
var zmq = require('zmq');
// var inch = require('./inch.js');

/**
 * Node object
 * @param {String} host    node hostname
 * @param {String} name    node canonical name
 * @param {String} ip      node IP address
 * @param {String} my_uuid current uuid
 * @param {String} uuid    node uuid
 */
function Node (service)
{
	this.id = service.txtRecord.id;
	this.host = service.host;
	this.name = service.name;
	this.ip = filter_ipv4(service.addresses);
}

module.exports = Node;

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