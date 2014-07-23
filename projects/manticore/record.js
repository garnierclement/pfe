function Record (res, type, src, dst, port)
{
	this.date = new Date();
	this.resource = res;
	this.type = type;	// 'active_resource' or 'client_request'
	this.source = src;	// where does the record comes from (client, other node (UUID))
	this.dst = dst;		// IP of recipient
	this.port = port;		// source port (client request) dst port (active_resource)
}

module.exports = Record;

/**
 * Add the reference to a child process
 * Used to track the child process for any 'active_resource'
 * @param {[type]} child [description]
 */
Record.prototype.addChild = function(child) {
	this.child = child;
};
