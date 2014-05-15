#!/usr/bin/python

import zmq

# Loading 0MQ context
context = zmq.Context()

# Configuration
tcpport = 'tcp://*:9999'
multicast = 'epgm://239.255.1.1:5555'
local = 'ipc:///tmp/zmq0'

# Sockets
localsock = context.socket(zmq.SUB)
localsock.connect(local)
publisher = context.socket(zmq.PUB)
publisher.bind(tcpport)

while True:
	message = localsock.recv_multipart()
	publisher.send_multipart(message)
