#!/bin/bash

servicename="MacBook Clément node"
type="_node._tcp"
port=56789

dns-sd -R "$servicename" $type . $port