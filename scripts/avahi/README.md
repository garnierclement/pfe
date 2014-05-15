
# Introduction

[Avahi] is a [Zeroconf] implementation for Linux and BSD. This implementation is compatible with Apple's implementation called [Bonjour].

In this project, Avahi is used to assign a `.local` domain to each node (i.e. Raspberry Pi) of the network. Doing so, we are able to easily find our nodes without static IP addressing.

Besides we use the tool to advertise information about nodes capabilities (i.e. the devices/sensors connected to them and how to reach them).



# Zeroconf

[Zeroconf] is a generic appellation for a group of protocols that aims at creating automatically an IP network without any manual configuration.

Among others, the Zeroconf protocols helps on these 2 topics:

* **Naming** with [mDNS] (multicast DNS)
* **Discovery** with [DNS-SD] (Service Discovery)

## Naming

[mDNS] allow name resolution without centralized DNS server:

* mDNS is using the multicast address `224.0.0.251` on UDP port `5353`
* a device is using a custom hostname with the `.local` suffix

## Discovery

//TODO

# Installation

## Linux

	$ sudo apt-get install avahi-daemon
	$ sudo apt-get install avahi-utils

## Mac OS X

Apple provides its own implementation Bonjour and it is built in OS X.

# Usage

## Linux

### avahi-daemon

The configuration file for the avahi daemon is located in `/etc/avahi/avahi-ademon.conf`.

The `/etc/avahi/services/` directory contains all the services that are advertised by the daemon. Below is an example of a `*.service` file, it specifies the *name* `<name>` of the service, the *type* `<type>`, the *port* `<port>` and some custom *parameters* `<txt-record>`.

	<?xml version="1.0" standalone='no'?>
	<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
	<service-group>
	  <name replace-wildcards="yes">Service Name</name>
	  <service>
	    <type>_http._tcp</type>
	    <port>XX</port>
	    <txt-record>path=/tmp/</txt-record>
	  </service>
	</service-group>
	
### avahi-utils

The `avahi-browse` command is available from the `avahi-utils` package and can be used to discover the services available in the local network.

Browse all services

	$ avahi-browse -all

Browse a defined service (_node._tcp) and display detailed information (resolving discovered hostnames)

	$ avahi-browse -rt _node_.tcp
	
	
## Mac OS X

### dns-sd built-in tool

On OS X, the `dns-sd` command is a tool for Multicast DNS ([mDNS]) and DNS Service Discovery ([DNS-SD]) networking protocols:

	$ dns-sd -E                              (Enumerate recommended registration domains)
	$ dns-sd -F                                  (Enumerate recommended browsing domains)
	$ dns-sd -R <Name> <Type> <Domain> <Port> [<TXT>...]             (Register a service)
	$ dns-sd -B        <Type> <Domain>                    (Browse for services instances)
	$ dns-sd -L <Name> <Type> <Domain>                       (Look up a service instance)
	$ dns-sd -P <Name> <Type> <Domain> <Port> <Host> <IP> [<TXT>...]              (Proxy)
	$ dns-sd -q <name> <rrtype> <rrclass>             (Generic query for any record type)
	$ dns-sd -D <name> <rrtype> <rrclass>(Validate query for any record type with DNSSEC)
	$ dns-sd -Z        <Type> <Domain>               (Output results in Zone File format)
	$ dns-sd -G     v4/v6/v4v6 <name>              (Get address information for hostname)
	$ dns-sd -g v4/v6/v4v6 <name>        (Validate address info for hostname with DNSSEC)
	$ dns-sd -V                (Get version of currently running daemon / system service)
	
Advertise a HTTP server on the service called "My service" 

	$ dns-sd -R "HTTP Server" _http._tcp . 80
	
Browse all HTTP services on the local domain

	$ dns-sd -B _http._tcp


### Bonjour Browser

A nice GUI for OS X is available here [http://www.tildesoft.com/files/BonjourBrowser.dmg](http://www.tildesoft.com/files/BonjourBrowser.dmg)

![image](bonjour-browser.png)


[Avahi]: http://avahi.org/
[Bonjour]: http://en.wikipedia.org/wiki/Bonjour_%28software%29
[Zeroconf]: http://en.wikipedia.org/wiki/Zero-configuration_networking
[mDNS]: http://en.wikipedia.org/wiki/Multicast_DNS
[DNS-SD]: http://en.wikipedia.org/wiki/DNS-SD#DNS-SD

