# TODO

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Tasks and ideas](#tasks-and-ideas)
  - [Project](#project)
    - [Add a license to the project](#add-a-license-to-the-project)
  - [Manticore](#manticore)
    - [Running Manticore as a daemon](#running-manticore-as-a-daemon)
    - [Autostart of Manticore on Pi and Windows](#autostart-of-manticore-on-pi-and-windows)
    - [Ensure the unicity of Manticore on a node](#ensure-the-unicity-of-manticore-on-a-node)
    - [mDNS issues and ideas for service discovery](#mdns-issues-and-ideas-for-service-discovery)
    - [New feature: data-proxy](#new-feature-data-proxy)
    - [Handle several requests for the same sensor](#handle-several-requests-for-the-same-sensor)
  - [Raspberry Pi](#raspberry-pi)
    - [Using the processing capabilities of the Raspberry Pi](#using-the-processing-capabilities-of-the-raspberry-pi)
  - [Sensors](#sensors)
    - [Proper implementation of the detection of the inertial sensor](#proper-implementation-of-the-detection-of-the-inertial-sensor)
    - [Missing `data` description of inertial sensor](#missing-data-description-of-inertial-sensor)
    - ["polling" the presence of new sensors](#polling-the-presence-of-new-sensors)
    - [Mouse sensor on Linux and Windows](#mouse-sensor-on-linux-and-windows)
    - [MIDI keyboard testing and improvements](#midi-keyboard-testing-and-improvements)
  - [Package](#package)
    - [Package an OSX Installer](#package-an-osx-installer)
    - [Custom Raspbian for Raspberry Pi](#custom-raspbian-for-raspberry-pi)
  - [Demo](#demo)
    - [Create new client in another platform/language](#create-new-client-in-another-platformlanguage)
    - [Build a complete audio and visual demo with multiple sensors](#build-a-complete-audio-and-visual-demo-with-multiple-sensors)
  - [Network](#network)
    - [Using ad hoc Wi-Fi networks](#using-ad-hoc-wi-fi-networks)
    - [PUB/SUB with multicast](#pubsub-with-multicast)
    - [Wireless and wired testing](#wireless-and-wired-testing)
  - [Security](#security)
    - [Security issues in Manticore](#security-issues-in-manticore)
- [TODO List](#todo-list)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Tasks and ideas

## Project

### Add a license to the project

* ***description*** : Currently the project is freely available on GitHub.com but we haven't chosen any license. As the [licensing help on GitHub.com] mentions **"the absence of a license means that the default copyright laws apply. This means that you retain all rights to your source code and that nobody else may reproduce, distribute, or create derivative works from your work. This might not be what you intend"**. Do we open source it ? MIT ? BSD ? GPL ? What's the opinion of the WSN Lab and the Conservatory ?
* ***resources*** :
	+ [Which open source software license should I use?] (opensource.com)
	+ [How to choose a license for your own work ?] (gnu.org)


[licensing help on GitHub.com]: https://help.github.com/articles/open-source-licensing
[Which open source software license should I use?]: http://opensource.com/law/13/1/which-open-source-software-license-should-i-use
[How to choose a license for your own work ?]: https://www.gnu.org/licenses/license-recommendations.en.html


## Manticore

### Running Manticore as a daemon

* ***description*** : Running Manticore as a daemon (i.e. in the background). No need for OS X because we are using `launchd` (that puts programs in the background). Look for `forever` module for Node.js and `launch-manticore.js` in the Manticore project's folder, this can be a start. Maybe they are better ways.
* ***status*** : started

### Autostart of Manticore on Pi and Windows

* ***description*** : Autostart of Manticore on Pi and Windows. No need for OS X because we are using `launchd` (see `scripts/osx-package/`). On the Pi, look for `inetd` to make Manticore like a network service and `systemd` or the System V-style `init` daemon to start at boot time. For Windows, google it.

### Ensure the unicity of Manticore on a node

* ***description*** : On your computer, try to start one instance of Manticore. Then try to launch another one. This will fail in some weird way. This is because the second instance tries to bind its sockets on port that are not available anymore. So one should try to make this clean and just exits with a message when this happens.

### mDNS issues and ideas for service discovery

* ***description*** Sometimes we encounter some various issues (e.g. missing node) with Bonjour/Zeroconf and the `mans` Node.js module used in Manticore. When we started the project the module has not been maintained for quite a time, so we used a more recent fork called `mdns2`. After one month, we revert back to `mans` because some maintainers came back and there have been some discussion and development since (it's not dead !) and so we keep it for now. Remember that we use Zeroconf mainly for easily naming the node within the `.local` domain and also to discover `_node._tcp` services. Nonetheless it can be interesting to look whether it can be possible to change the mDNS implementation. One idea could be to change the module, see [mdns-js] which is a pure JavaScript implementation of mDNS (but still very young) or even to completely get rid of Zeroconf and use a custom approach to service discovery and distributed naming. For this purpose, we can also look at [ZRE] (ZeroMQ Realtime Exchange Protocol) which tries to achieve node discovery and presence with UDP beacons.
* ***status*** : just ideas

[mdns-js]: https://www.npmjs.org/package/mdns-js
[ZRE]: http://rfc.zeromq.org/spec:20

### New feature: data-proxy

* ***description*** : data-proxy
 

### Handle several requests for the same sensor

> TODO description

* ***description*** : Handle several requests for the same sensor

> Let's imagine a several users all request the same sensor data. Instead of having a communication channel delivering OSC packets from the sensor's node to each of these users individually, we would implement some sort of system that would aggregate this data and send it to all the users having requested the sensor data. Should this system be integrated at the core level? should it be integrated at the driver-level of the sensor?


## Raspberry Pi

### Using the processing capabilities of the Raspberry Pi

* ***description*** : Investigate the use of the processing capabilities of the Raspberry Pi in order to create/change sound. We had some workshops with FAUST and it can be used as a tool to distribute some processing over the network. 
* ***keywords*** : *Raspberry Pi, FAUST, distributed system, audio*

## Sensors

### Proper implementation of the detection of the inertial sensor

* ***description*** : Currently when Manticore checks for the presence of inertial sensors on the Raspberry Pi, this will always detect one, even if there is no Arduino board connected onto the Pi. Indeed according to the `description.json` file associated with the inertial sensor, this will execute the command `xBeeReadSerial -c` (`-c` for checking). But actually, if you look at the source code of `xBeeReadSerial.cpp` you will see that it does not do anything and just return 0 (i.e. success). To implement it properly, one should investigate about the serial communication between the Pi and the xBee chip on the Arduino board.
* ***status*** : hardly begun
* ***keywords*** : *inertial sensor, Arduino, xBee chip, C++, serial communication*

### Missing `data` description of inertial sensor

* ***description*** : The `description.json` file for Manticore has no `data`. One should look into the 

### "polling" the presence of new sensors

* ***description*** : one need to investigate on how and whether we should continuously poll for the presence of new sensors on a node

### Mouse sensor on Linux and Windows

* ***description*** Currently the mouse sensor is only completely defined on Mac OS X. Windows is lacking some `bootstrap` scripts and all the step for the `request` procedure to be performed. Linux and Pi are still missing the `execute` step in the `request` procedure. This also implies that Pure Data must be installed (and thus considered as a dependency).
* ***keywords*** : *Linux, Raspberry Pi, Windows, mouse, Pure Data*

### MIDI keyboard testing and improvements

* ***description*** : The MIDI keyboard has only been tested once or twice and should now work. But it requires more thorough testing and some decision to be made about the OSC data format that we are going to use.

## Package

### Package an OSX Installer

* ***description*** : Package an OS X Installer that can be easily distributed to end users
* ***status*** : almost completed !
* ***keywords*** : *pkgbuild, pkgutil, productbuild, Mac, .pkg*
* ***resources*** : see the folder `scripts/osx-package/` in the repository for more information and status about this task

### Custom Raspbian for Raspberry Pi

* ***description*** : Customize the latest [Raspbian] image to include Manticore, startup scripts, sensors and network configuration. Thus it would be easy to burn it onto a new SD card and to get a new Raspberry Pi working in the networks in few minutes.

[Raspbian]: http://www.raspbian.org/

## Demo

### Create new client in another platform/language

* ***description*** : Create a new client in Processing or openFrameworks or any other creative programming tool in order to provide more examples of what is a client. Currently the only available client are the web interface and the Max/MSP external.

### Build a complete audio and visual demo with multiple sensors

* ***description*** : Build a complete audio and visual demo with multiple sensors. With the sensors (3 inertial sensors and a MIDI Keyboard), Max/MSP and maybe one other visual client, one can create a real interactive working demo using Manticore behind-the-scene.

## Network

### Using ad hoc Wi-Fi networks

* ***description*** : At this time, we always used either a central router with infrastructure mode Wi-Fi network to connect the different nodes of the network. One interesting topic would be make it work on a completely ad hoc Wi-Fi networks and compare the performance. For the IP addressing, we could either rely on Link-local addresses (IPv4 with IPv4ll/APIPA that is part of Zeroconf, see [RFC3927] or built in IPv6) or elect a leader that will trigger a DHCP server for all the other one. On ad hoc networks, one should also address the topic of multi-hop communications and routing between nodes (see [802.11s] for mesh networking).

[RFC3927]: http://tools.ietf.org/html/rfc3927
[802.11s]: http://en.wikipedia.org/wiki/IEEE_802.11s

### PUB/SUB with multicast

* ***description*** : Change to PUB/SUB communication pattern to use a predefined multicast address and PGM or EPGM (thus over UDP). Test it against the way it is used now (currently every node subscribes to every other node in TCP).
* ***resources*** :
	+ [ZeroMQ PGM implementation]
	+ For PGM (Pragmatic General Multicast), see [RFC3208]
	
[ZeroMQ PGM implementation]: http://api.zeromq.org/2-1:zmq-pgm
[RFC3208]: http://tools.ietf.org/html/rfc3208

### Wireless and wired testing

* ***description*** : Some testing must be node to test the influence of the wireless networks used. We need to know when it is going to be a mess.

## Security

### Security issues in Manticore

* ***description*** : As the project is still in an early development stage, we focused more on the features but one should now starts to enquire the security breach that can be found into Manticore. Indeed, some functionalities we used to help the development must be removed or at least constrained in a production environment. For instance in the interactive command in Manticore we can remotely execute some commands. This was extremely useful to publish the command `git pull` to all nodes without the need to authenticate. Nevertheless used in a wrong way (bad commands) this can cause a severe damage to your computer.

## Updates

### Dependency updates

* ***description*** : As Node.js is still young one should care about the evolution of the framework. Now we are using the stable branch v0.10.X but when later migrating to new versions

# TODO List

The previous old TODO list below :

- [ ] Autostart of Manticore after the Pi has booted
- [x] Windows compatibility (never been tested)
- [x] Give a model to sensor
- [x] Insert new sensors : MIDI Keyboard + Inertial sensor
- [x] Design a proper message object with header + type + payload
- [x] Test with more than 5 nodes
- [ ] If request is too long or fail, timeout and return fail request resource
- [x] Keep track of local requested resource
- [ ] Handle soft/hard release in API 
- [x] Store this.ip reliabily
- [x] add a flag in nodes[] when it is itself
- [ ] design a simple client with processing/openFrameworks
- [x] try Max/MSP external ? Homère is on it with Java externals
- [ ] what about FAUST ? and its integration ?
- [ ] Create standard service/auto-start process for manticore on Linux (SysV-init) and OS X (launchd)
- [ ] Better logging library for Manticore ? see https://github.com/flatiron/winston
- [ ] Bootstrap process to install pd-extended on raspberry pi
- [ ] Find why the PoC (mouse sensor) doesn't work on Rapsberry Pi
- [ ] Write a documentation about Yang Fan's xBeeSerialReader
- [ ] Write a Q&A readme files for anything specific or not yet mentioned into the readme files
- [ ] Write a quick start developer guide
- [ ] Run Manticore as a daemon
- [ ] Forward data, advertise a sensor on a node that receives data from any computer/device that is not a node of the network
- [x] update web interface according to the use of senors
- [x] request sensor's uuid should not fail
- [x] Fully implement explicit release
- [x] Implement implicit release (when a node died, look if )
- [ ] Move the messaging structure into a message.js file
- [ ] Periodic publishing of node capabilities
- [ ] handle properly the crash of manticore is another instance of manticore is already running (ports already bound)
- [ ] implement the limitation on a specific mode of a specific procedure (number of maximum clients)
- [ ] periodic detection of sensors (or continusly polling devices and then send a signal to manticore)
- [ ] Idea: test different mdns module ofr Node.js, see mdns-js in pure js (no dependency) or reimplement a custom discovery and presence system
- [ ] Sensor "intertial" has no property `data` in its `description.json` file, need to look at the xBeeReadSerial to check the OSC format used
- [ ] Create a package .pkg for Mac OS X to install dependencies and then copy the repo in /Applications/Manticore and also install a launchd file in /Library/LaunchDaemons or ~/Library/LaunchDaemons 