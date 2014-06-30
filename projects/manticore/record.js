function Record (res, type, src)
{
	this.date = new Date();
	this.resource = res;
	this.type = type;	// 'active_resource' or 'client_request'
	this.source = src;	// where does the record comes from (client, other node (UUID))
}

module.exports = Record;