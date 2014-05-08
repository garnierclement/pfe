#!/usr/bin/python

# import os
# import commands

# service_type = commands.getoutput("cat ../../definitions/node-services.txt") 
# out = commands.getoutput("avahi-browse -rt ")

# print(service_type)

import subprocess

out = subprocess.check_output("avahi-browse -rt "+"_node._tcp"+" | grep hostname", shell=True)
print(out)
