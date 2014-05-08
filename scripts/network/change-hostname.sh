#!/bin/sh

# WARNING : need debug
# you need to be root to use this script

oldname=$(cat /etc/hostname)
newname=$1

hostname "$newname"
echo "Hostname changed from $oldname to $newname"

cat /etc/hosts | sed s/"$oldname"/"$newname"/ > /tmp/newhosts
mv /tmp/newhosts /etc/hosts
echo "The /etc/hosts file has been updated with the new hostname"
