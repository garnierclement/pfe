# Manticore

In the following, the words *core* and *manticore* with/without a capital letter are used indistinctly and refer to the same program.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Getting started](#getting-started)
- [Guide](#guide)
  - [Introduction](#introduction)
  - [Objectives](#objectives)
    - [What we want to achieve ?](#what-we-want-to-achieve-)
    - [How does it work ?](#how-does-it-work-)
  - [Note about the use of ZeroMQ Sockets](#note-about-the-use-of-zeromq-sockets)
    - [ZeroMQ sockets](#zeromq-sockets)
    - [ZeroMQ usage in Manticore](#zeromq-usage-in-manticore)
  - [Note about the use of mDNS](#note-about-the-use-of-mdns)
  - [Source files](#source-files)
  - [Data structures](#data-structures)
    - [Node](#node)
    - [Sensor](#sensor)
    - [Record](#record)
  - [The Core singleton](#the-core-singleton)
    - [Core attributes](#core-attributes)
    - [Core events](#core-events)
    - [Core methods](#core-methods)
  - [Inter-core messaging](#inter-core-messaging)
    - [Message structure](#message-structure)
    - [Message types and associated payloads](#message-types-and-associated-payloads)
  - [Embedded HTTP server](#embedded-http-server)
    - [External messaging with Manticore Web API](#external-messaging-with-manticore-web-api)
    - [User friendly Web interface](#user-friendly-web-interface)
  - [Play around with Manticore](#play-around-with-manticore)
    - [Interactive mode](#interactive-mode)
    - [Reading the log](#reading-the-log)
    - [Built-in endpoint](#built-in-endpoint)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
    - [Prerequisites on Mac OS X](#prerequisites-on-mac-os-x)
    - [Prerequisites on Raspbian (Raspberry Pi)](#prerequisites-on-raspbian-raspberry-pi)
    - [Prerequisites on Windows](#prerequisites-on-windows)
  - [Node.js module dependencies](#nodejs-module-dependencies)
  - [Let's go](#lets-go)
- [Known issues](#known-issues)
  - [Avahi warning on Linux](#avahi-warning-on-linux)
  - [Auto-detection on multiple interfaces](#auto-detection-on-multiple-interfaces)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

To start Manticore, you can either use node

	$ node app.js

or npm

	$ npm start

on Windows, use `node.exe`

	> node.exe app.js

> On the Raspberry Pi, you may be required to prepend `sudo` because some sensor's drivers may need root user rights

## Guide

### Introduction

The framework is composed of 4 elements : the **core**, the **client**, the **data-provider** and the **endpoint**.

* The core is the main element and it is basically a daemon running in the background that will make a node part of the network
* The client is the interface by which and user can interact with a core (e.g. for requesting a resource on remote node)
* The data-provider is the element responsible for sending the sensor's data, basically it can be Pure Data patch or a dedicated driver that formats the data in OSC packets and send it to the selected endpoint
* The endpoint is basically a socket set up by the user (manually or automatically) that listens for the data from the data-provider

The aim of this guide is to describe the core element that we call Manticore and its implementation.


### Objectives

#### What we want to achieve ?

* 	**Discovery**  
	How do we learn about other nodes on the network ?
* 	**Presence**  
	How do we track when others nodes come and go ?
* 	**Connectivity**  
	How do we connect one node to another ?
* 	**Group messaging** (a.k.a. multicast)  
	How do we send a message from one node to a group of other nodes ?
* 	**Point-to-point messaging**  
	How do we send a message from one node to another ?
*	**External communication**  
	How does a node communicate with process that are not *network nodes* ?
* 	**Content distribution**  
	How do we provide the requested resource data ? How do we send the data ?

#### How does it work ?

* 	At startup, a node **advertise** its **presence** by broadcasting a `_node._tcp` service on **Zeroconf**. Doing so, other nodes can simply browse this service to dynamically discover its presence.
* 	We assume that all the nodes are on the **same network segment** (i.e in the same subnet). Thus we can infer that they can directly address other nodes using the recipient IP address.
* 	Each node provides different **communication channels** relying on specific patterns : **uni-**, **bi-** or **multidirectional**, **synchronous** or **asynchronous**.
* 	The **group messaging** is achieved by a communication channel called *Information Channel (InCh)* implementing the publisher/subscriber network pattern. Hence, each node has 2 sockets : 
	+ the publisher socket solely used to send information to all its subscribers.
	+ the subscriber socket solely used to receive information from all other nodes.
*	The **point-to-point messaging** is achieved by another communication channel called *Main Channel (MaCh)* implementing the request/reply network pattern. According to the situation, this request/reply can either be synchronous (an immediate reply is requested and thus will block the execution) or asynchronous (we expect a response but not urgently).
*	To communicate with **external processes**, a HTTP server is embedded in each node and can provide a **web API**, accepting GET requests and serving JSON file or plain text status.
*	The **distribution of the resource** data is made using **OSC packets** on UDP datagrams. The main use case is a client that desire a resource provided on a specific node of the network. To achieve a proper delivery of the dynamic OSC data stream to this client, we use the information collected on both InCh and MaCh and execute the following procedure :
	1. A client issue a request on a local core to know the network status and resources available
	2. The server sends back a list of network nodes with its capabilities (this list is known by the core through 1. Browsing of `_node._tcp` service and 2. Listening on any published event on InCh)
	3. The client issue a request on a resource, binds an UDP reception socket and wait for the core's response
	4. The local core knows which node to ask and issue in turn a synchronous request using MaCh. This is a synchronous request, meaning that it will waits for a reply.
	5. The recipient core handles this request, check the availability of the requested resource, if so it sends a positive reply to the requester core. At the same time, it may generate a file and execute a program/driver that will send the data to the requester client.
	6. The local core receives the response, process it and can now answer the client.
	7. A OSC stream over UDP must now be flowing between from the node with the requested to resource to the client

**Note**: Both *MaCh* and *InCh* need to be reliable communication channels and thus use TCP as transport protocol.  
**Note 2**: These channels are solely used to inter-core communication. That is to say that any external communication with a core must use the built-in HTTP server.


### Note about the use of ZeroMQ Sockets

#### ZeroMQ sockets

* PUB to publish data
* SUB to subscribe to a PUB socket
* REQ to issue a synchronous request
* REP to issue a synchronous reply (not used actually, see ROUTER)
* ROUTER to issue asynchronous replies
* DEALER to issue asynchronous requests

We can think of REQ and DEALER sockets as "clients" and ROUTER sockets as "servers". That is why we bind the ROUTER sockets and connect REQ and DEALER sockets to them.

**Note**: For more information about ZeroMQ and the way these sockets work, refer to the ZeroMQ page "[Learn the basics]".

[Learn the basics]: http://zeromq.org/intro:read-the-manual

#### ZeroMQ usage in Manticore

Here are some simple examples mixing the use of the above defined communication channels and ZeroMQ sockets.

**SCENARIO 1**  

Here we have 2 nodes, denoted above as [1] and [2]. A client (on node [1]) wants to request a resource available on node [2]. The request resource procedure will exploit the main communication channel (MaCh) in a synchronous way.

	REQ[1] --request--> ROUTER[2] --ack|noack--> REQ[1]  
	
* After receiving a request of resource from a local client on the web API, node [1] will issue a `request` message to node [2] using a REQ socket on MaCh, here this procedure is blocking because we wait for node [2] to answer before responding to the local client and letting it know if the request of the resource  was successful.
* Node [2] receives this `request` message on its ROUTER socket, do the necessary processing to provide the requested resource and acknowledge positively (or negatively if an error occurred) by sending a `ack` message to node [1]. Note that the ROUTER socket can handle multiple requests from different nodes at the same time, and responding to one request does not say that other requests are ignored.
* Node [1] was waiting for the `ack` message and look into it to see whether it was successful or not.
* In turn, node [1] can now respond to the client and thus notify it of the status of the request resource procedure.

**SCENARIO 2**

	PUB[1] --remote--> SUB[N] | ROUTER[N] --output--> DEALER[1] --ack--> ROUTER[N]  
	

> // TODO : detail the second scenario mixing InCh and MaCh and used for remote command execution

### Note about the use of mDNS

We use the mdns module for Node.js. Each node of the network advertise its presence by providing a service called `_node._tcp`. When advertising, we also add the `id` of the node as a TXT record.

Then to monitor the come and go of nodes in the network, we can use the browser that will focus on other `_node._tcp` services and events will be emitted when node are discovered or disappear.

* To browse a `_node._tcp` service in the local network

		var mdns = require('mdns');
		var browser = mdns.createBrowser(mdns.tcp('node'));
		browser.start();
		
* Event `serviceUp` when a new node is discovered

		browser.on('serviceUp', function(service) {
			...
		});	
		
* Event `serviceDown` when a node disappear

		browser.on('serviceDown', function(service) {
			...
		});	

**Note**: For more information about this module, refer the documentation <http://agnat.github.io/node_mdns/user_guide.html>


### Source files

* Main file and entry point of the program : `app.js` that will handle the web interface and the `Core` events
* Manticore : `manticore.js` implements the `Core` singleton and set all sockets and communication channels
* Classes :
	+ Sensor in `sensor.js`
	+ Node in `node.js`
	+ Record in `record.js`
* Tools :
	+ `interactive.js` contains code for interactive commands in the shell

### Data structures

Manticore uses the following data structures :

* 	Node
* 	Sensor
* 	Record

#### Node

The node class is used to represent a node in the network. Each Manticore instance keeps a list of the node in the network in the array `Core.nodes`. 

* `id` an UUID to uniquely identify a node in the network
* `host` the hostname of a node
* `name` the name of a node
* `ip`	the IP address of a node
* `sensors` the sensors that the node has published (an array of Sensor objects, see below for details)
* `network_iface` the network interface on which the node has been discovered

#### Sensor

The Sensor class is used to represent a sensor in Manticore. A sensor object have the following properties :

*	`id` an UUID set a runtime to uniquely identify a sensor over the network
*	`name` a name to describe the sensor
*	`data`	the OSC format and the description of the data provided by the sensor

And the following method :

*	`request` to handle the request of the sensor's data

**Note**: To understand how this properties and methods are set, please refer to the Sensor documentation in the directory `sensors/` at the root of the directory.


#### Record

The Record class is used to keep track of requests, states and history of the core activity and communication. 

The implementation of the Record class is located in `record.js` and used either in the main application `app.js` and the Core `manticore.js`.

We distinguish 2 types of records :

* 	`active_resource` : these records track every resource that have been requested by another core node and are aware of : 
	+	the time of the reception of the `request` command on MaCh
	+	the core node id which requested the resource (so he can identify it in `core.nodes[]`)
	+	the IP address and port of the endpoint where to send the sensor data (namely OSC packets)
	+	ultimately if the core node that requested the resource is on the same machine as the client the IP address of the endpoint should match the IP of the node id (but this is not mandatory)
* 	`client_request` : these records track every request issued by a local client and is aware of :
	+	the time of the reception of the method GET `/request/[id]?[port]` on the built in HTTP server
	+	the IP address of the client (if local client, then 127.0.0.1)
	+	the port that the client requested that we sent data on
	+	the IP of the destination node that can provide the data (this is used as a commodity for the release resource procedure, so we do not need to look up the core.nodes[] and associated sensors[] to find the IP address)

These records works in pairs and at any time if a `client_request` is a valid record in one node (i.e. the client), you could fine an equivalent `active_resource` on another node of the network (i.e. the server). This `active_resource` is matching to the previously initiated `client_request`.

### The Core singleton

The `Core` object is implemented as a singleton (only a single instance of a class). This is achieved by the fact that the module does not export the constructor of the object but a new instance of it.

	module.exports = new Core();
	
Thus the first call to `require('manticore.js')` will create the object and all other require will look at the cache and return an pointer to the previously created object.

For more information about `require()` and modules in Node.js, refer to this article [How `require()` Actually Works]

[How `require()` Actually Works]: http://fredkschott.com/post/2014/06/require-and-the-module-system/

#### Core attributes

The `Core` object has the following attributes :

* `name` the hostname of the node
* `uuid` an unique identifier to identify the node (generated at runtime)
* `arch` the architecture of the node (ARM, x64, x86)
* `platform` the platform of the node (Linux, Darwin, Windows)
* `ip` the IP address of the node (corresponding to the network interface on which the service advertisement is done)
* `nodes` an array of Node objects corresponding to the other nodes discovered on the network
* `sensors` an array of Sensor objects corresponding to the sensors of the node
* `records` an array of Record objects (i.e. history of client requests and currently running data-providers
* `publisher` a PUB socket (ZeroMQ) to publish information to its subscribers
* `subscriber` a SUB socket (ZeroMQ) to receive information from the publisher it subscribed
* `requester` a DEALER socket (ZeroMQ) to issue asynchronous requests
* `mach` a ROUTER socket (ZeroMQ) to handle asynchronous requests
* `udp` a simple UDP socket
* `advertiser` a mdns object to advertise its presence as a `_node._tcp` service
* `browser` a mdns object to browse `_node._tcp` services
* `lastpublish` a timestamp of the last publication of the node's capabilities (i.e. sensors)

**Note**: `Core.nodes` will contain all nodes of the network (including itself). Indeed, this means that the advertisement was successful and the node discovered itself.

**Note 2**: Following the previous note, we set that the `Core.sensors` array also points to the attribute `sensors` of the Node object that represent itself in the `Core.nodes` array. Thus if we browse the content of all `sensors` attributes of each Node object in `Core.nodes`, then we have a collection of all sensors in the network (including the one connected on the current node).

#### Core events

* `ready` is triggered when **initialization finishes**
* `inch` is triggered when the **subscriber** socket **receives** some data (meaning *I've just received some data on the information channel* or *Another node just published some information*)
* `mach` is triggered when a **request** is **received** on MaCh (meaning *I've just received a request*)
* `reply` is triggered when a **response** to **previous request** is received
* `died` is triggered when we discover that a **node disappears** from the network
* `test` (for testing purpose only)

#### Core methods

These are the methods used by the Core singleton to interact with its state and its communication channels.

* `init()` will start mDNS advertising and browsing of `_node.tcp` service, bind sockets
* `publish()` will trigger a `inch` event on all subscribers
* `send()` will trigger a `mach` event on the recipient
* `syncSend()` will also trigger a `mach`
* `reply()`
* `close()`

> // TODO add missing important methods

### Inter-core messaging

#### Message structure

The message exchanged on the communication channels (InCh and MaCh) are JavaScript serialized objects (JSON) and have the following structure :

	{
	  "header": {
	    "src": "4626ca80-f211-11e3-8ad9-4df458080716",
	    "name": "clementpi",
	    "ip": "192.168.1.171",
	    "type": "request"
	  },
	  "payload": { ... }
	}

It is simply a Javascript object with 2 main parts :

* `header` contains the type of message and some information about the sender (uuid, hostname and IP address)
* `payload` can be any Javascript primitive data types (i.e. `String`, `Boolean` or `Number`), composite data types (i.e. `Object` or `Array`) or special data types (i.e. `null` or `undefined`). In the case of composite types, its structure will be related to the type of message specified in the header.

#### Message types and associated payloads

When nodes are exchanging information over the network, they can use the following type of messages. This messages are the base for all communication and custom protocols used in inter-core messaging.

* 	`raw` for messages containing raw data (mainly used for debug)

		"payload": "Anything can be put here"
		
* 	`request` is issued by a node requesting a resource on another node

		"payload": {
			"data": "UUID of the resource requested",
			"dst": "IP address of the endpoint",
			"port": "port of the endpoint"
		}
		
* 	`release` is issued by a node wanted to release a previously requested resource

		"payload": {
			"data": "UUID of the resource to release"
		}
	
* 	`ack` to simply acknowledge the reception of a message or to reply with a status (success or failure)

		"payload": {
			"status": true || false
		}

* `new_sensor` used by a node to publish its sensors (i.e. `Core.sensors`)

		"payload": {
			"sensors": {
				// Array of Sensor objects
			}
		}

* `exec` used to execute a command received from another node

### Embedded HTTP server 

Manticore has a embedded HTTP server built-in. This server has two main purposes: 

* The first being the platform for the Local Channel (Loch) that is to say, the communication channel between manticore and any local user client, such as but not limited to Max/MSP,
* The second being that this embedded HTTP server can also be used as a web user interface, that we also like to call the "universal client", because it will be accessible to the user very easily, and will most of all allow him to perform the same operations which are possible on a local user client like the one we have developed for Max/MSP.

The server thus routes, with the help of our favorite framework, namely Express, two kinds of requests:

* Requests for the web API, that enables the communication channel between manticore and any local user client,
* Requests for accessing the web user interface

In app.js, Express is called in the following manner :

	var express = require('express');
	var api = express();
	
We then set up routes for the web user interface in the following manner :

	api.get('/', function(req, res) {...});
	
And the route for the web API in the following manner :

	api.get('/nodes', function(req, res) {...});
	
	api.get('/request/:id', function(req, res) {...});

	api.get('/release/:id', function(req, res) {...});

	api.get('/kill/:pid', function(req, res) {...});

The parameters of each of these API functions are explained in the following section.



#### External messaging with Manticore Web API

The Manticore Web API creates an entry point for a local client to interact with the network.

The Manticore web API is inspired by REST API, in the sense the architecture used is a stateless client-server architecture, using unique identifiers to describe resources.
The API is based on the GET HTTP method, and is composed of 4 main types of requests :

* The **network information request** : upon this request, the requestor will be provided with a JSON string describing the current state of the network, that is to say information about the nodes in the network. The request is called in the following manner

		http:/localhost:3000/nodes/
		
* The **request resource request** : this request is called when one wishes to request a resource. The request is called in the following manner

		http:/localhost:3000/request/[id]?port=[portnumber]?dst=[endpoint]
 The `[id]`, `[portnumber]` and `[endpoint]` corresponds respectively to the requested resource's UUID, the port number and IP address of the endpoint to send the data to.
 
* The **release resource request** : this request is called when one wishes to release an already requested resource. The request is called in the following manner

		http:/localhost:3000/release/[id]
 The `[id]` corresponds to the resource's UUID.
 
* The **kill data-provider request** : this request is called when one wishes to kill the process which is providing the data from the request resource. The request is called in the following manner

		http:localhost:3000/kill/[pid]
	The `[pid]` is the Process identifier of the data providing process.


#### User friendly Web interface

The web user interface is designed with a templating engine called [Jade].

The most obvious purpose of this utility is to give the user an easy way to see the current network capability, that is to say the nodes that are currently present on the network, and their associated resources. This is done all thanks to [Jade] and [Bootstrap] Twitter which we have used to render a simple but efficient web user interface.

Another very important functionality is to allow users to use the web user interface as a "universal client", that is to say as a resource requestor, that bridges the gap between manticore and any application, as long as it is enabled with the capability of receiving UDP streams on a specific port.

In this manner, all the user needs to do is to create a UDP receiving socket bound to a specific port X on whatever application he wants to use, and just use his web browser to request the wanted resource to the same specific port X.

He will then also be able to release the data, and in extreme cases kill the data providing process which is sending the requested data from the remote or local node.

[Jade]: http://jade-lang.com/
[Bootstrap]: http://getbootstrap.com/


### Play around with Manticore

#### Interactive mode

When running Manticore in a shell, you can directly type some commands in your shell. This interactive mode, is really useful to debug the development.

* `debug` show core.nodes
* `eval [js]` use eval() javascript function to imitate REPL mechanism (not safe!)
* `log [js]` same as eval but will also show the result on stdout using console.log()
* `send [msg]` send a the string `msg` to the publish socket (every node will receive the raw message)
* `remote [cmd]` ask remote execution of `cmd` command (not secure, be careful but useful to `git pull` all nodes)
* `emit [event]` is equivalent to `core.emit('event')`, used for debug purpose only
* `exec [cmd]` execute a command in the shell (no need to quit the program or to open a new ssh session)  
* `exit` gracefully close sockets and exit (equivalent to Ctrl+C)
* `request [id]` to request the resource `id`

If you want to add or customize a command, you should edit the `interactive.js` file.


#### Reading the log

The logging have the following structure

	<symbol>[<subject>] <message>

Like this (starting procedure)

	+[CORE]	Core starting on macbook-cgarnier.local
	+[CORE]	Core id 506243e0-02b9-11e4-87f0-8dea239e7eaf
	+[HTTP]	Listening on 3000
	+[UDP]	UDP socket listening on 0.0.0.0:42424
	+[PUB]	Publisher socket listening on 32323
	+[CORE]	Advertising _node._tcp on 32323
	+[mDNS]	Start browsing for _node._tcp services
	+[MACH]	Socket listening on 45454

The `<symbol>` can be

*	`+` used for any relevant information
*	`>` used for incoming message
*	`!` used for errors
*	`-` used for the disappearance of a node
*	`:` used for debug

The `<subject>` can be

*	`CORE` for anything related to the core
*	`HTTP`	for any connection or event related to the Web user interface
*	`UDP`	for the creation and the reception on the built-in UDP socket
*	`mDNS`	for anything related to the mdns module (browsing and advertising)
*	`MACH`	for any message on the main channel (MaCh)
*	`INCH`	for any message on the information channel (InCh) 
*	`SYNC`	for any synchronous request
*	`ASYN`	for any asynchronous request
*	`RELR`	for the Release Resource procedure
*	`REQR`	for the Request Resource procedure
*	`REQ`	for anything related to a request (either synchronous or asynchronous)
*	`REP`	for anything related to a reply
*	`PUB`	for anything related to the publisher socket (used by InCh)
*	`SUB`	for anything related to the subscriber socket (used by InCh)
*	`EXEC`	for anything related to the execution of a command
*	`DTEC`	for anything related to the detection of a sensor
*	`DBUG` for anything related to debug

#### Built-in endpoint

Manticore has a built in endpoint. Indeed at startup, the core binds an UDP socket on port 42424. This is a simple endpoint that will only display the raw content of the received stream to stdout. Therefore it is used for debug purpose to test the web user interface and API or the request procedure without the need to manually set up an endpoint.

**Note**: It can be used in pair with the `request [id]` command in the interactive mode (therefore acting as a client).

#### Custom endpoint

If you need to manually create a simple endpoint of any computer in the network and you cannot run Manticore on it, you can use netcat

	$ nc -ul 42424

## Installation

### Prerequisites

Manticore is based on Node.js and exploits ZeroMQ and Zeroconf/Bonjour.

#### Prerequisites on Mac OS X

Clone this repository

	$ git clone https://github.com/garnierclement/pfe

Install the package manager [Homebrew]

	$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
	$ brew update

Install [Node.js] v0.10.28

	$ brew install nodejs

Install [ZeroMQ] 4.0.4

	$ brew install zeromq

**Note** : pkg-config may be required too (`brew install pkg-config`)

#### Prerequisites on Raspbian (Raspberry Pi)

Clone this repository

	$ git clone https://github.com/garnierclement/pfe

Update package manager

	$ sudo apt-get update

Install [Avahi] daemon and its tools

	$ sudo apt-get install avahi-daemon libnss-mdns
	$ sudo apt-get install avahi-utils

Install [Pure Data]

	$ sudo apt-get install puredata

Compile and install [Node.js] v0.10.28 from source tarball (**on the Raspberry Pi, it takes around 2 hours !**)

	$ wget http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
	$ tar xvzf node-v0.10.28.tar.gz
	$ cd node-v0.10.28
	$ ./configure
	$ make
	$ sudo make install
	$ sudo ldconfig
	$ rm zeromq-node-v0.10.28.tar.gz
	$ rm -rf node-v0.10.28

Alternatively, if you have already compiled it once (i.e. `make`) on a [Raspberry Pi], *tar* the compiled files, upload it to a another Pi, *untar* and you can directly do the following

	$ cd node-v0.10.28
	$ ln -fs out/Release/node node
	$ sudo /usr/bin/python tools/install.py install
	$ node -v 				# must display v0.10.28
	$ npm -v 				# must display v1.4.9	

Compile and install [ZeroMQ] v4.0.4 from source tarball (it also requires libtool, autoconf and automake, but they are provided by Raspbian)

	$ sudo apt-get install uuid-dev
	$ wget http://download.zeromq.org/zeromq-4.0.4.tar.gz
	$ tar xvzf zeromq-4.0.4.tar.gz
	$ cd zeromq-4.0.4
	$ ./configure --with-pgm
	$ make
	$ sudo make install
	$ sudo ldconfig
	$ rm zeromq-4.0.4.tar.gz
	$ rm -rf zeromq-4.0.4

#### Prerequisites on Windows

This is experimental and only tested on Windows 7 x64.

1. You need to download and install
	* 	[Node.js] v0.10.x  
	* 	[Bonjour SDK for Windows]  
		To download the SDK, you need to have an Apple Developer ID (it's free)  
		Bonjour SDK is required for the `dns_sd.h` header file used by the mdns module for Node.js  
		At the time of writing version 2.0.4 is the latest available  
	* 	[Python 2.7]  
		Python is required when installing the zmq module for Node.js  
		During the installation, check the box *add python.exe to PATH*  
	* 	[ZeroMQ 4.0.4]  
		During the installation, choose the **full** installation (with source code and compiled librairies)
		+ [Direct link for Windows x64](http://miru.hk/archive/ZeroMQ-4.0.4~miru1.0-x64.exe)  
		+ [Direct link for Windows x86](http://miru.hk/archive/ZeroMQ-4.0.4~miru1.0-x86.exe)  
	* 	[Git] or [GitHub for Windows]  (optional)
2. Reboot your system 

[Bonjour SDK for Windows]: https://developer.apple.com/downloads/index.action?q=Bonjour%20SDK%20for%20Windows#
[Python 2.7]: https://www.python.org/download/windows
[ZeroMQ 4.0.4]: http://zeromq.org/distro:microsoft-windows
[Git]: http://git-scm.com/download/win
[GitHub for Windows]: https://windows.github.com/

### Node.js module dependencies

Install Node.js module dependencies ([mdns] and [zmq]) with npm
(see `package.json` for more information about versions)

	$ npm install

If you encounter any issue with the automatic npm installation, you can manually install them one by one.

	$ npm install mdns
	$ npm install zmq
	$ npm install express
	$ npm install jade
	$ npm install uuid
	$ npm install underscore
	$ npm install async

**Note**: depending on the operating system [zmq] and [mdns] have other requirements (see the Prerequisites for your system above).

### Let's go

Now that everything is set up, you can move up to [Getting started](#getting-started)

## Known issues

### Avahi warning on Linux

On Linux distributions, we can see the following warning when executing the program

	*** WARNING *** The program 'node' uses the Apple Bonjour compatibility layer of Avahi.
	*** WARNING *** Please fix your application to use the native API of Avahi!
	*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node>
	*** WARNING *** The program 'node' called 'DNSServiceRegister()' which is not supported (or only supported partially) in the Apple Bonjour compatibility layer of Avahi.
	*** WARNING *** Please fix your application to use the native API of Avahi!
	*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node&f=DNSServiceRegister>

This must not be harmful and the warning can be hidden with the following environment variable

	$ export AVAHI_COMPAT_NOWARN=1

For further investigation, enquire <http://0pointer.de/avahi-compat?s=libdns_sd&e=node>

### mDNSResponder issues

You encounter some issues with the mDNSResponder that prevented the node to detect itself. We think that mDNSResponder bug and didn't refresh its cache and so the TXT record associated was not the one really advertised.

A simple way to solve it is to simply restart the daemon on Mac OS X

	$ sudo killall mDNSResponder
	
**Note**: mDNSResponder is a daemon invoked at boot time to implement Multicast DNS and DNS Service Discovery in Mac OS X, see `man mDNSResponder` for more information.

### Auto-detection on multiple interfaces

Because a node advertises a _node._tcp service and at the same time browses/discovers any node advertising the same _node._tcp service, it is ultimately going to see multiple instance of itself. 

Currently we only care about the first one it sees (but maybe it is not the one we want) and for the others, the log will show something like

	+[mDNS]	Service up: macbook-cgarnier at 192.168.190.1 (vmnet1)
	![CORE]	Node id 506243e0-02b9-11e4-87f0-8dea239e7eaf is already present

So when a computer have multiples network interfaces, it is going to see itself multiple time.

Note that this behavior is also shown with virtual interfaces such as `vmnet1` or `vmnet8` used by VMware.

[zmq]: https://www.npmjs.org/package/zmq
[mdns]: https://www.npmjs.org/package/mdns
[Homebrew]: http://brew.sh/
[Node.js]: http://nodejs.org/
[ZeroMQ]: http://zeromq.org/
[Raspberry Pi]: http://www.raspberrypi.org/
[Raspbian]: http://www.raspbian.org/
[Avahi]: http://avahi.org/
[Pure Data]: http://puredata.info/
