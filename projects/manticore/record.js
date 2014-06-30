function Record (res, type, src)
{
	this.date = new Date();
	this.resource = res;
	this.type = type;	// 'active_resource' or 'client_request'
	this.source = src;	// where does the record comes from (client, other node (UUID))
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