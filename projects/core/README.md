# Manticore

## Start

To start manticore, you can either use node

	$ node app.js

or with npm

	$ npm start

## Guide

### Interactive commands

The following commands are available

* `debug` show core.nodes
* `eval [js]` use eval() javascript function to imitate REPL mechanism
* `log [js]` same as eval but will also show the result on stdout using console.log()
* `send [msg]` send a the string `msg` to publish socket
* `remote [cmd]` ask remote execution of `cmd` command
* `emit [event]` is equivalent to core.emit('event'), used for debug purpose only
* `exec [cmd]` execute a command in the shell (no need to quit the program or to open a new ssh session)  
* `exit` gracefully close sockets and exit (equivalent to Ctrl+C)

### Events

* `ready`
* `inch`
* `mach`
* `reply`
* `test` (for testing purpose only)

### Core commands

* `init()`
* `publish()`
* `send()`
* `reply()`
* `close()`

### Source files

* `app.js` is the main entry point of the program
* `manticore.js` is the module containing the core singleton
* `node.js` is the Node class
* `interactive.js` contains code for interactive commands in the shell
* `trigger.js` contains code for generating and executing processes

## Installation

Install dependencies ([mdns] and [zmq])  
See `package.json` for more information about versions

	$ npm install

Manually

	$ npm install mdns
	$ npm install zmq
	$ npm install express
	$ npm install uuid

Note: zmq and mdns have other requirements, see the main README at the root of this repository

## Warning

On Linux distributions, we can see the following warning when executing the program

	*** WARNING *** The program 'node' uses the Apple Bonjour compatibility layer of Avahi.
	*** WARNING *** Please fix your application to use the native API of Avahi!
	*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node>
	*** WARNING *** The program 'node' called 'DNSServiceRegister()' which is not supported (or only supported partially) in the Apple Bonjour compatibility layer of Avahi.
	*** WARNING *** Please fix your application to use the native API of Avahi!
	*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node&f=DNSServiceRegister>

This must not be harmful and the warning can be hidden with the following environment variable

	$ export AVAHI_COMPAT_NOWARN=1

For further investigation, see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node>


[zmq]: https://www.npmjs.org/package/zmq
[mdns]: https://www.npmjs.org/package/mdns
