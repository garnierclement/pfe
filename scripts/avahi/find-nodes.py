#!/usr/bin/python

import os
# import commands

# service_type = commands.getoutput("cat ../../definitions/node-services.txt") 
# out = commands.getoutput("avahi-browse -rt ")

# print(service_type)

import subprocess

out = subprocess.check_output("avahi-browse -rt "+"_node._tcp"+" | grep hostname", shell=True)

filename = 'test'
target = open(filename, 'w')
target.write(out)
target.close()

hostname_array = []
with open("test", "r") as f:
  for line in f:
    hostname_array.append(line)

print hostname_array[1]
print hostname_array[0]

