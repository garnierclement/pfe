/** 
 * Module dependencies
 */
var uuid = require('uuid');
var exec = require('child_process').exec;
var _ = require('underscore');
var async = require('async');
var path = require('path');

/**
 * Sensor object
 * @param {Object} desc    Object representing the description.json file
 * @param {Array} systems  Array of all system aliases matching
 */
function Sensor (desc, systems, constructor_cb)
{
	var bootstrap_func = [];
	var self = this;
	// parse the content of the bootstrap procedure in the description file
	// and create a new function for each Command object found
	_.each(desc.bootstrap, function(command, key) {
		var intersect = _.intersection(command.systems, systems);
		if (intersect.length > 0) {
			// the bind methods of the Function object creates a new function with defined parameters
			// here commandHandler(command, sensor_name, next) becomes commandHandler(next)
			// and the 2 first parameters are set
			var new_func = commandHandler.bind(null, command, desc.name);
			bootstrap_func.push(new_func);
		}
	});

	// execute all the bootstrap commands one after another
	if (bootstrap_func.length > 0) {
		async.series(bootstrap_func, function(err, results){
			if (err) {
				constructor_cb(err);
			}
			else {
				// no errors in bootstrap procedure
				// setting the sensor properties
				self.id = uuid.v1();
				self.name = desc.name;
				self.data = [];

				// parsing the content of 'data' in the description file
				_.each(desc.data, function(datum) {
					self.data.push({name: datum.description, osc: datum.osc_format});
				});

				// create the handler for the request procedure
				self.request = function(mode, options, callback) {
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
							if ('generate' in desc.request[mode]) {
								parseExecuteAndDie(desc.name, desc.request[mode].generate, systems, opt, next);
							}
							else {
								next(null, 0);
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
							callback(null, results[2]);
						}
						else {
							callback(err);
						}
					});
				};

				// calling the callback constructor with 'thisValue' pointing to
				// the created Sensor
				constructor_cb.apply(self, [null]);
			}
		});
	}
}

module.exports = Sensor;

/**
 * Parse the content of an array of Command objects from the description.json file
 * Execute the command if one of the system aliases match
 * Finally use the callback to return the child process
 * 
 * @param  {String}		sensor_name [description]
 * @param  {Array}		cmd_array   [description]
 * @param  {Array}		systems     [description]
 * @param  {Array}		options     [description]
 * @param  {Function} callback    Error-first callback 
 */
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
			var working_dir = "../../sensors/"+sensor_name;
			if ('path' in command) {
				working_dir = path.normalize(working_dir+'/'+command.path);
			}
			console.log(working_dir);
			var child = executeCommand(cmdToExecute, {cwd: working_dir} ,function(stdout, stderr) {
				//console.log(stdout+stderr);
			});
			callback(null, child);
		}
	});
}

/**
 * Parse the content of an array of Command objects from the description.json file
 * Execute the command if one of the system aliases match
 * When the child process exits, use the callback to return its exit code
 * 
 * @param  {String}		sensor_name [description]
 * @param  {Array}		cmd_array   [description]
 * @param  {Array}		systems     [description]
 * @param  {Array}		options     [description]
 * @param  {Function} callback    Error-first callback 
 */
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
			var working_dir = "../../sensors/"+sensor_name;
			if ('path' in command) {
				working_dir = path.normalize(working_dir+'/'+command.path);
			}
			console.log(working_dir);
			var child = executeCommand(cmdToExecute, {cwd: working_dir} ,function(stdout, stderr) {
				});
			child.on('exit', function(exit_code) {
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
 * Handles a Command object from descripion.json
 * @param  {Function} next    [description]
 * @param  {[type]}   command [description]
 * @return {[type]}           [description]
 */
function commandHandler(command, sensor_name, next) {
	// get the command
	var cmdToExecute = command.cmd;
	// parse the arguments
	_.each(command.parameters, function(param) {
		if (_.has(options, param)) {
			cmdToExecute += ' '+options[param];
		} else {
			cmdToExecute += ' '+param;
		}
	});
	// set the working dir for the subshell
	var working_dir = "../../sensors/"+sensor_name;
	if ('path' in command) {
		working_dir = path.normalize(working_dir+'/'+command.path);
	}
	// execute the command
	console.log('+[EXEC]\tStarting execution of command '+cmdToExecute+' for sensor '+sensor_name);
	var child = executeCommand(cmdToExecute, {cwd: working_dir}, function(stdout, stderr) {});
	child.on('exit', function(exit_code) {
		if (exit_code === 0) {
			console.log('+[EXEC]\tCommand '+cmdToExecute+' for sensor '+sensor_name+ ' OK');
			next(null, exit_code);
		}
		else {
			var err = "![EXEC]\tCommand "+cmdToExecute<+" for sensor "+sensor_name+" failed with exit cod"+exit_code;
			console.log(err);
			next(err, exit_code);
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

/**
 * Simple wrapper around the exec function of module Child Process in the Node.js API
 * @param  {String}   cmd      Full command to be executed (with arguments)
 * @param  {Object}		opts     Options for the exec command (cwd for changing the current working directory)
 * @param  {Function} callback Return stdout and stderr
 */
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