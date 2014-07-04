#!/bin/sh

# use system_profiler | grep Trackpad or mouse
# system_profiler SPUSBDataType
# check for HI Device inputs

failure=1
success=0

echo "+[SCPT]\tChecking for mouse or trackpad..."

if system_profiler SPUSBDataType | grep MOUSE 
then 
	echo "+[SCPT]\tMOUSE detected!\c"
	exit $success 

elif system_profiler SPUSBDataType | grep Trackpad 
then 
	echo "+[SCPT]\tTrackpad detected!\c"
	exit $success 

elif system_profiler SPUSBDataType | grep Mouse 
then 
	echo "+[SCPT]\tMouse detected!\c"
	exit $success

elif system_profiler SPUSBDataType | grep mouse
then
	echo "+[SCPT]\tmouse detected!\c" 
	exit $success
else
	exit $failure
fi

