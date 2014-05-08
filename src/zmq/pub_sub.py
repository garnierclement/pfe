#!/usr/bin/python

import zmq
import sys
import os
import time


context = zmq.Context()

# PUBLISHING

f = open(os.path.dirname(os.path.abspath(__file__))+"/../../var/run/port",'r') #opening /var/run/port to get the my own port number
port = f.readline()

socket_pub = context.socket(zmq.PUB)
socket_pub.bind("tcp://*:%s" % port)



# SUBSCRIBING
while True :

	target = open(os.path.dirname(os.path.abspath(__file__))+"/../../scripts/avahi/node_list.csv",'r')

	addr_list = list()
	port_list = list()
	info_array = []

	for line in target :
		info_array = line.split(";")
		addr_list.append(info_array[1])
		port_list.append(info_array[2])

	print addr_list
	print port_list
	print info_array

	socket_list = list()

	for addr, port in zip(addr_list,port_list) :  #warning! verify that these two lists are of same length
		socket_sub = context.socket(zmq.SUB)
		socket_sub.connect("tcp://"+ addr +":"+ port)
		print "suscribe socket connected to " + addr + ":" + port

	time.sleep(120)




