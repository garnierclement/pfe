#!/usr/bin/python

# WARNING : Running this script requires root privileges

# README : With this script, the user is able, while having root privileges, to add a service to the /etc/avahi/services/ folder. 
#          The newly created service will have argv[1] as its name and argv[2] as its port.

import os
import random

MAX_PORT_NUMBER = 65536
MIN_PORT_NUMBER = 32000

f = open('/home/pi/clement/pfe/definitions/node-service.txt','r') #opening node-service.txt to get the node name from definition document
complete_nodename = f.readline()
nodename =[complete_nodename.find("_")+1:complete_nodename.find(".")]
print nodename

filename = nodename+'.service' 
path = '/etc/avahi/services/'+filename # create path to the /etc/avahi/services/ folder
os.system('sudo touch '+path) # create file with root privileges

f = open('/etc/hostname','r') #opening /etc/hostname to get the hostname
hostname = f.readline()



port = random.randrange(MIN_PORT_NUMBER, MAX_PORT_NUMBER) #choose a random port number between 65536 and 32000 to avoid collision
while ((';'+str(port)+';') in open('sample.csv').read()): # if another node service has this port number, assign a new port number
	port = random.randrange(MIN_PORT_NUMBER, MAX_PORT_NUMBER)



target = open(path, 'w')

line1 = '<?xml version="1.0" standalone=\'no\'?>'
line2 = '<!DOCTYPE service-group SYSTEM "avahi-service.dtd">'
line3 = '<service-group>'
line4 = '  <name replace-wildcards="yes">'+hostname+'</name>'
line5 = '  <service>'
line6 = '    <type>'+nodename+'</type>'
line7 = '    <port>'+str(port)+'</port>' 
# line8 = '    <txt-record>path=/data/shared/Music</txt-record>' # This line should be changed...not realy sure of what to put here.
line9 = '  </service>'
line10 = '</service-group>'


target.write(line1)
target.write("\n")
target.write(line2)
target.write("\n")
target.write(line3)
target.write("\n")
target.write(line4)
target.write("\n")
target.write(line5)
target.write("\n")
target.write(line6)
target.write("\n")
target.write(line7)
target.write("\n")
#target.write(line8)
#target.write("\n")
target.write(line9)
target.write("\n")
target.write(line10)
target.write("\n")

target.close()

os.system('sudo service avahi-daemon restart')  # restart avahi daemon






