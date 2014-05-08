#!/bin/bash

servicename="server"
type="_node._tcp"
port=80

dns-sd -R "$servicename" $type . $port