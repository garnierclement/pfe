#!/bin/sh

# use
# ls /dev/input/by-path/ | grep -i mouse
# and
# ls /dev/input/by-id/ | grep -i mouse


failure=1
success=0

echo "+[SCPT]\tChecking for mouse..."

if ls /dev/input/by-id/ | grep -i mouse >/dev/null
then 
	echo "+[SCPT]\tMouse detected!\c"
	exit $success 

elif  ls /dev/input/by-path/ | grep -i mouse >/dev/null
then 
	echo "+[SCPT]\tMouse detected!\c"
	exit $success 
else
	exit $failure
fi