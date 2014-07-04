#!/bin/sh

# use system_profiler | grep Trackpad or mouse
# system_profiler SPUSBDataType
# check for HI Device inputs

failure=1
success=0

echo "Checking for mouse or trackpad..."

if system_profiler SPUSBDataType | grep MOUSE 
then 
	echo "MOUSE detected!"
	exit $success 

elif system_profiler SPUSBDataType | grep Trackpad 
then 
	echo "Trackpad detected!"
	exit $success 

elif system_profiler SPUSBDataType | grep Mouse 
then 
	echo "Mouse detected!"
	exit $success

elif system_profiler SPUSBDataType | grep mouse
then
	echo "mouse detected!" 
	exit $success
else
	exit $failure
fi

