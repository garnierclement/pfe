# Core

## Installation

Install dependencies (mdns2 and zmq)
See `package.json`

	$ npm install

## Warning

On linux distribution, we can see the following warning

	*** WARNING *** The program 'node' uses the Apple Bonjour compatibility layer of Avahi.
	*** WARNING *** Please fix your application to use the native API of Avahi!
	*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node>
	*** WARNING *** The program 'node' called 'DNSServiceRegister()' which is not supported (or only supported partially) in the Apple Bonjour compatibility layer of Avahi.
	*** WARNING *** Please fix your application to use the native API of Avahi!
	*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node&f=DNSServiceRegister>

This must not be harmful and the warning can be hidden with the following export variable

	$ TODO export 1
