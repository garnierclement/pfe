#!/bin/bash

sudo apt-get update

# Avahi daemon and tools
sudo apt-get install avahi-daemon libnss-mdns
sudo apt-get install avahi-utils
sudo apt-get install avahi-discover

# for local ARP scan on the network
sudo apt-get install arp-scan

# Node.js
sudo apt-get install nodejs

# for mDNS module in Node.js 
sudo apt-get install libavahi-compat-libdnssd-dev
