function Record (res, type, src, dst)
{
	this.date = new Date();
	this.resource = res;
	this.type = type;	// 'active_resource' or 'client_request'
	this.source = src;	// where does the record comes from (client, other node (UUID))
	this.dst = dst;		// IP of recipient
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

/**
 * Add the port asked by the client
 * Specific to 'client_request' records
 * @param {Number} port [description]
 */
Record.prototype.addPort = function(port) {
	this.port = port;
};


///// unfinished
exports.findResourceIn = function(list, type, res, callback) {
	for (var idx = 0; idx < list.length; idx++) {
		if (list[idx].resource === res) {
			switch(list[idx].type) {
				case 'client_request':
					break;
				case 'active_resource':
					break;
				default:
					break;
			}
		}
	}
};