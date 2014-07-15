#!/bin/sh

# $1 is IP address of the endpoint
ip_dst=$1
# $2 is port of the endpoint
port_dst=$2
# $3 is the name of the generated pure data file
output="../../var/run/"$3

# Copy the mousePosition.pd file and change the 'connect' endpoint
sed -e '/^#X msg [0-9]* [0-9]* connect/s/connect [0-9a-z_.\-]* [0-9]*/connect '$ip_dst'\ '$port_dst'/' MIDI.pd > $output;

