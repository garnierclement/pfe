/** 
 * Module dependencies
 */
var uuid = require('uuid');

/**
 * Sensor object
 */
function Sensor (name)
{
	this.id = uuid.v1();
	this.name = name;
	this.data = [];
}

module.exports = Sensor;

Sensor.prototype.addData = function(_name, osc_string) {
	this.data.push({name: _name, osc: osc_string});
};