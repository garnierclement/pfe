/** 
 * Module dependencies
 */
var uuid = require('uuid');

/**
 * Sensor object
 */
function Sensor (desc, systems)
{
	// du taff
	if (1) {
		this.id = uuid.v1();
		this.name = desc.name;
		this.data = [];
	}
	else
		throw 'unsupported platform';
	
}

module.exports = Sensor;

/**
 * Add a data that a sensor can provide
 * The data is described by a canonical name and its OSC address
 * @param {String} _name      [description]
 * @param {String} osc_string [description]
 */
Sensor.prototype.addData = function(_name, osc_string) {
	this.data.push({name: _name, osc: osc_string});
};