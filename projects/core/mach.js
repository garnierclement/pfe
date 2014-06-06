/** 
 * Module dependencies
 */
var zmq = require('zmq');

/**
 * Constants
 */
const MACH_PORT = 45454;

function create() {
	return zmq.socket('rep');
}

function init() {
	
}

exports.create = create;