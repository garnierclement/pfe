#!/usr/bin/python

import zmq

# Loading 0MQ context
context = zmq.Context()

# Configuration
local = 'ipc:///tmp/zmq0'

# Sockets
localsock = context.socket(zmq.PUB)
localsock.connect(local)

### stdin