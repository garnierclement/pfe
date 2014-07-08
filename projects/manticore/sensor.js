/** 
 * Module dependencies
 */
var uuid = require('uuid');
var exec = require('child_process').exec;
var _ = require('underscore');
var async = require('async');

/**
 * Sensor object
 */
function Sensor (desc, systems)
{
	// parse the content of the bootstrap object in the description file
	_.each(desc.bootstrap, function(command, key) {
		var intersect = _.intersection(command.systems, systems);
		if (intersect.length > 0) {
			var cmdToExecute = command.cmd;
			_.each(command.parameters, function(param) {
					cmdToExecute += ' '+param;
				}
			});
			var child = executeCommand(cmdToExecute, {cwd: "../../sensors/"+desc.name}, function(stdout, stderr) {
				//console.log(stdout+stderr);
			});
			child.on('exit', function(exit_code) {
				if (exit_code === 0) {
					console.log('+[DTEC] Bootstrap command '+command.cmd+' for sensor '+desc.name+ ' OK');
				}
				else {
					var err = "![DTEC] Bootstrap command "+command.cmd+" for sensor "+desc.name+" failed with exit code "+exit_code;
					console.log(err);
					//throw err;
					// need to find why it stops
				}
			});
		}
	});

	this.id = uuid.v1();
	this.name = desc.name;
	var data = this.data = [];

	// parsing the content of 'data' in the description file
	_.each(desc.data, function(datum) {
		data.push({name: datum.description, osc: datum.osc_format});
	});

	this.request = function(mode, options, callback) {
		var opt;
		//parse options
		if (_.has(desc.request, mode)) {
				opt = _.object(desc.request[mode].options, options);
		}
		console.log(opt);
		async.series([
			function(next) {
				console.log("check");
				// check
				parseExecuteAndDie(desc.name, desc.request[mode].check, systems, opt, next);
			},
			function(next) {
				// generate
				console.log("generate");
				if (_.has(desc.request[mode], 'generate')) {
					parseExecuteAndDie(desc.name, desc.request[mode].generate, systems, opt, next);
				}
				else {
					next(null, null);
				}
			},
			function(next) {
				// execute
				console.log("execute");
				parseAndExecute(desc.name, desc.request[mode].execute, systems, opt, next);
			}
		],
		function(err, results) {
			// see 'results', normally exit code for check and generate or null
			// and child for execute
			if (err !== null) {
				console.log(results);
				callback(null, results[2]);
			}
			else {
				callback(err);
			}
		});
	};
}

module.exports = Sensor;

function parseAndExecute(sensor_name, cmd_array, systems, options, callback) {
	_.each(cmd_array, function(command, key) {
		var intersect = _.intersection(command.systems, systems);
		if (intersect.length > 0) {
			var cmdToExecute = command.cmd;
			_.each(command.parameters, function(param) {
				if (_.has(options, param)) {
					cmdToExecute += ' '+options[param];
				} else {
					cmdToExecute += ' '+param;
				}
			});
			var child = executeCommand(cmdToExecute, {cwd: "../../var/run"} ,function(stdout, stderr) {
				//console.log(stdout+stderr);
			});
			callback(null, child);
		}
	});
}

function parseExecuteAndDie(sensor_name, cmd_array, systems, options, callback) {
	_.each(cmd_array, function(command, key) {
		var intersect = _.intersection(command.systems, systems);
		if (intersect.length > 0) {
			var cmdToExecute = command.cmd;
			_.each(command.parameters, function(param) {
				if (_.has(options, param)) {
					cmdToExecute += ' '+options[param];
				} else {
					cmdToExecute += ' '+param;
				}
			});
			var child = executeCommand(cmdToExecute, {cwd: "../../sensors/"+sensor_name} ,function(stdout, stderr) {
				});
			child.on('exit', function(exit_code) {
					console.log("sdkjhskjdfh");
					if (exit_code === 0) {
						console.log('+[EXEC]\tCommand '+command+' for sensor '+sensor_name+ ' OK');
						callback(null, exit_code);
					}
					else {
						var err = "![EXEC]\tCommand "+command+" for sensor "+sensor_name+" failed with exit code "+exit_code;
						console.log(err);
						callback(err, exit_code);
					}
			});
		}
	});
}

/**
 * Add a data that a sensor can provide
 * The data is described by a canonical name and its OSC address
 * @param {String} _name      [description]
 * @param {String} osc_string [description]
 */
Sensor.prototype.addData = function(_name, osc_string) {
	this.data.push({name: _name, osc: osc_string});
};

function executeCommand(cmd, opts, callback) {
	try {
		var child = exec(cmd, opts, function(err, stdout, stderr){
			console.log("+[EXEC]\tExecuting "+cmd+"\n"+stdout+stderr);
			callback(stdout, stderr);
		});
		return child;
	}
	catch(e) {
		console.log("![EXEC]\t"+e);
	}
};