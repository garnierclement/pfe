#!/usr/bin/python

import os
# import commands

# service_type = commands.getoutput("cat ../../definitions/node-services.txt") 
# out = commands.getoutput("avahi-browse -rt ")

# print(service_type)

import subprocess

hostname = subprocess.check_output("avahi-browse -rt "+"_node._tcp"+" | grep hostname", shell=True)
hostname_array = hostname.split("\n")

address = subprocess.check_output("avahi-browse -rt "+"_node._tcp"+" | grep address", shell=True)
address_array = address.split("\n")

port = subprocess.check_output("avahi-browse -rt "+"_node._tcp"+" | grep port", shell=True)
port_array = port.split("\n")

info = subprocess.check_output("avahi-browse -rt "+"_node._tcp"+" | grep txt", shell=True)
info_array = info.split("\n")


target = open('node_list.csv','w')


for i in range(len(hostname_array)):
	content = hostname_array[i][hostname_array[i].find("[")+1:hostname_array[i].find("]")]+';'+\
	          address_array[i][address_array[i].find("[")+1:address_array[i].find("]")]+';'+\
	          port_array[i][port_array[i].find("[")+1:port_array[i].find("]")]+';'+\
	          info_array[i][info_array[i].find("[")+1:info_array[i].find("]")]+';'+"\n"
	target.write(content)

target.close()

os.system('cp node_list.csv ../../projects/node/service-discovery/public/var/node_list.csv')

