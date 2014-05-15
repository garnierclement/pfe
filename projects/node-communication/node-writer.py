#!/usr/bin/python

import zmq

# Loading 0MQ context
context = zmq.Context()

# Configuration
local = 'ipc:///tmp/zmq0'

# Local socket
localsock = context.socket(zmq.PUB)
localsock.connect(local)

while True:
	message = raw_input("Sending to "+local+" ")
	if message in ["Q","q"]: 
		print "Closing"
		break
	else:
		localsock.send_multipart(message)
