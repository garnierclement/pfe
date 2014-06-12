# Manticore

In the following, the words *core* and *manticore* with/without a capital letter are used indistinctly and refer to the same program.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Manticore](#manticore)
  - [Getting started](#getting-started)
  - [Guide](#guide)
    - [Introduction](#introduction)
    - [Objectives](#objectives)
      - [What we want to achieve ?](#what-we-want-to-achieve-)
      - [How does it work ?](#how-does-it-work-)
      - [Note about the use of ZeroMQ Sockets](#note-about-the-use-of-zeromq-sockets)
      - [Use cases](#use-cases)
    - [Interactive commands](#interactive-commands)
    - [Events](#events)
    - [Core commands](#core-commands)
    - [Source files](#source-files)
  - [Prerequisites](#prerequisites)
    - [Prerequisites on Mac OS X](#prerequisites-on-mac-os-x)
    - [Prerequisites on Raspbian (Raspberry Pi)](#prerequisites-on-raspbian-raspberry-pi)
  - [Installation](#installation)
  - [Warning](#warning)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

To start Manticore, you can either use node

	$ node app.js

or npm

	$ npm start

## Guide

### Introduction

> // TODO : simply detail use case and present the associated objectives

### Objectives

#### What we want to achieve ?

* 	**Discovery**  
	How do we learn about other nodes on the network ?
* 	**Presence**  
	How do we track when others nodes come and go ?
* 	**Connectivity**  
	How do we connect one node to another ?
* 	**Group messaging** (a.k.a multicast)  
	How do we send a message from one node to a group of other nodes ?
* 	**Point-to-point messaging**  
	How do we send a message from one node to another ?
*	**External communication**  
	How does a node communicate with process that are not *network nodes* ?
* 	**Content distribution**  
	How do we provide the requested resource data ? How do we send the data ?

#### How does it work ?

* 	At startup, a node advertise its presence by broadcasting a `_node._tcp` service on Zeroconf. Doing so, other nodes can simply browse this service to dynamically discover its presence.
* 	We assume that all the nodes are on the same network segment (i.e in the same subnet). Thus we can infer that they can directly address other nodes using the recipient IP address.
* 	Each node provides different communication channels relying on a specific pattern : uni- or bidirectional, synchronous or asynchronous.
* 	The group messaging is achieved by a communication channel called **Information Channel (InCh)** implementing the publisher/subscriber network pattern. Hence, each node has 2 sockets : 
	+ the publisher socket solely used to send information to all its subscribers.
	+ the subscriber socket solely used to receive information from all other nodes.
*	The point-to-point messaging is achieved by another communication channel called **Main Channel (MaCh)** implementing the request/reply network pattern. According to the situation, this request/reply can either be synchronous (an immediate reply is requested and thus will block the execution) or asynchronous (we expect a response but not urgently).
*	To communicate with external processes, a HTTP server is embedded in each node and can provide a web API, accepting GET request and serving JSON file or raw status.
*	The distribution of the resource data is made using OSC packets on UDP datagrams. The main use case is a client that desire a resource provided on a specific node of the network. To achieve a proper delivery of the dynamic OSC data stream to this client, we use the information collected on both InCh and MaCh and execute the following procedure :
	1. A client issue a request on a local core to know the network status and resources available
	2. The server sends back a list of network nodes with its capabilities (this list is known by the core through 1. Browsing of `_node._tcp` service and 2. Listening on any published event on InCh)
	3. The client issue a request on a resource, binds an UDP reception socket and wait for the core's response
	4. The local core knows which node to ask and issue in turn a synchronous request using MaCh. This is a synchronous request, meaning that it will waits for a reply.
	5. The recipient core handles this request, check the availability of the requested resource, if so it sends a positive reply to the requester core. At the same time, it may generate a file and execute a program/driver that will send the data to the requester client.
	6. The local core receives the response, process it and can now answer the client.
	7. A OSC stream over UDP must now be flowing between from the node with the requested to resource to the client

**Note**: Both *MaCh* and *Inch* need to be reliable communication channels and thus use TCP as transport protocol.  
**Note 2**: These channels are solely used to inter-core communication. That is to say that any external communication with a core must use the built-in HTTP server.


#### Note about the use of ZeroMQ Sockets

* PUB to publish data
* SUB to subscribe to a PUB socket
* REQ to issue a synchronous request
* REP to issue a synchronous reply (not used actually, see DEALER)
* ROUTER to issue asynchronous requests
* DEALER to issue asynchronous replies

> //TODO: write about 0MQ sockets and pattern


#### Use cases

*   `PUB[1] --remote--> SUB[N] | ROUTER[N] --output--> DEALER[1] --ack--> ROUTER[N]` 
	(mixing InCh + MaCh and used for remote command execution)
* 	`REQ[1] --request--> ROUTER[2] --ack|noack--> REQ[1]`
	(using MaCh to request a resource)
	
> // TODO : detail the procedure

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
* `request`

### Events

* `ready` is triggered when **initialization finishes**
* `inch` is triggered when the **subscriber** socket **receives** some data (meaning *I've just received some data on the information channel* or *Another node just published some information*)
* `mach` is triggered when a **request** is **received** on MaCh (meaning *I've just received *)
* `reply` is triggered when a **response** to **previous request** is received
* `test` (for testing purpose only)

### Core commands

These are the methods used by the Core singleton to interact with its state and its communication channels.

* `init()` will start mDNS advertising and browsing of `_node.tcp` service, bind sockets
* `publish()` will trigger a `inch` event on all subscribers
* `send()` will trigger a `mach` event on the recipient
* `syncSend()` will also trigger a `mach`
* `reply()`
* `close()`

> // TODO : add commented examples


### Source files

* `app.js` is the main entry point of the program
* `manticore.js` is the module containing the core singleton
* `node.js` is the Node class
* `interactive.js` contains code for interactive commands in the shell
* `trigger.js` contains code for generating and executing processes

### Inter-core messaging

#### Message structure

The message exchanged on the communication channels (InCh and MaCh) are JSON files and have the following structure :

	{
	  "header": {
	    "src": "4626ca80-f211-11e3-8ad9-4df458080716",
	    "name": "clementpi",
	    "ip": "192.168.1.171",
	    "type": "raw"
	  },
	  "payload": {}
	}

It is simply a Javascript object with 2 main parts :

* `header` contains the type of message and some information about the sender (uuid, hostname and IP address)
* `payload` is a object or any other Javascript compliant type, its structure will depend on the type of the message

> // TODO : need to write about ZeroMQ Frame and envelope

#### Message types and associated payload

* 	`raw`
* 	`request`
* 	`ack`

## Prerequisites

### Prerequisites on Mac OS X

Clone this repository

	$ git clone https://github.com/garnierclement/pfe

Install the package manager [Homebrew]

	$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
	$ brew update

Install [Node.js] v0.10.28

	$ brew install nodejs

Install [ZeroMQ] 4.0.4

	$ brew install zeromq

### Prerequisites on Raspbian (Raspberry Pi)

Clone this repository

	$ git clone https://github.com/garnierclement/pfe

Update package manager

	$ sudo apt-get update

Install [Avahi] daemon and its tools

	$ sudo apt-get install avahi-daemon libnss-mdns
	$ sudo apt-get install avahi-utils

Install [Pure Data]

	$ sudo apt-get install puredata

Compile and install [Node.js] v0.10.28 from source tarball (**on the Pi, it takes around 2 hours !**)

	$ wget http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
	$ tar xvzf node-v0.10.28.tar.gz
	$ cd node-v0.10.28
	$ ./configure
	$ make
	$ sudo make install
	$ sudo ldconfig
	$ rm zeromq-node-v0.10.28.tar.gz
	$ rm -rf node-v0.10.28

Alternatively, if you have already compiled it once (i.e. `make`) on a [Raspberry Pi], you can directly do the following

	$ cd node-v0.10.28
	$ ln -fs out/Release/node node
	$ sudo /usr/bin/python tools/install.py install
	$ node -v 				# must display v.0.10.28
	$ npm -v 				# must display v1.4.9	

Compile and install [ZeroMQ] v4.0.4 from source tarball (it also requires libtool, autoconf and automake, but they are provided by Rapsbian)

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

## Installation

Install dependencies ([mdns] and [zmq]) with  
(see `package.json` for more information about versions)

	$ npm install

Manually

	$ npm install mdns
	$ npm install zmq
	$ npm install express
	$ npm install uuid

**Note**: [zmq] and [mdns] have other requirements, see the main README at the root of this repository

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

For further investigation, enquire <http://0pointer.de/avahi-compat?s=libdns_sd&e=node>


[zmq]: https://www.npmjs.org/package/zmq
[mdns]: https://www.npmjs.org/package/mdns
[Homebrew]: http://brew.sh/
[Node.js]: http://nodejs.org/
[ZeroMQ]: http://zeromq.org/
[Raspberry Pi]: http://www.raspberrypi.org/
[Raspbian]: http://www.raspbian.org/
[Avahi]: http://avahi.org/
[Pure Data]: http://puredata.info/
