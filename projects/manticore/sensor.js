/** 
 * Module dependencies
 */
var uuid = require('uuid');
var exec = require('child_process').exec;
var _ = require('underscore');

/**
 * Sensor object
 */
function Sensor (desc, systems)
{
	// du taff
	_.each(desc.bootstrap, function(command, key) {
		var intersect = _.intersection(command.systems, systems);
		if (intersect.length > 0) {
			var cmdToExecute = "../../sensors/"+desc.name+"/"+command.cmd;
			if (command.parameters > 0) {
				for (var i = 0; i < command.parameters.length; i++) {
					cmdToExecute += ' '+command.parameters[i];
				}	
			}
			var child = executeCommand(cmdToExecute, function(stdout, stderr) {
				//console.log(stdout+stderr);
			});
			child.on('exit', function(exit_code) {
				if (exit_code === 0) {
					console.log('+[DTEC] Bootstrap command '+command.cmd+' for sensor '+desc.name+ ' OK');
				}
				else {
					var err = "![DTEC] Bootstrap command "+command.cmd+" for sensor "+desc.name+" failed";
					console.log(err);
						throw err;
				}
			});
		}
	});

	this.id = uuid.v1();
	this.name = desc.name;
	this.data = [];

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

function executeCommand(cmd, callback) {
	try {
		var child = exec(cmd, function(err, stdout, stderr){
			console.log("+[EXEC]\tExecuting "+cmd+"\n"+stdout+stderr);
			callback(stdout, stderr);
		});
		return child;
	}
	catch(e) {
		console.log("![EXEC]\t"+e);
	}
};