/** 
 * Module dependencies
 */
var exec = require('child_process').exec;
var child;

child = exec('ls -la', function(error, stdout, stderr) {
	console.log(stdout);
});