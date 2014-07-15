#!/bin/sh

ip_dst=$1
port_dst=$2
output="../../var/run/"$3

sed -e '/^#X msg [0-9]* [0-9]* connect/s/connect [0-9a-z_.\-]* [0-9]*/connect '$ip_dst'\ '$port_dst'/' MIDI.pd > $output;


