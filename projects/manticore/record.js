function Record (res, type)
{
	this.date = new Date();
	this.resource = res;
	this.type = type; // 'active_resource' or 'client_request'
}

module.exports = Record;