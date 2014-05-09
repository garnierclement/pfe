#!/bin/bash

servicename=$(hostname)
type="_node._tcp"
port=56789

dns-sd -R "$servicename" $type . $port