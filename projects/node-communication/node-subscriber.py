#!/usr/bin/python

import zmq

# Loading 0MQ context
context = zmq.Context()

# Configuration
tcpport = 'tcp://macbook-cgarnier.local:9999'
multicast = 'epgm://239.255.1.1:5555'

# Sockets
subscriber = context.socket(zmq.SUB)
subscriber.bind(tcpport)

while True:
	message = subscriber.recv_multipart()
	print message