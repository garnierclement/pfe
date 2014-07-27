#!/bin/sh

# Variables
LAUNCHD_PLIST="com.github.garnierclement.pfe.manticore.plist"
MANTICORE_ROOT="/Applications/Manticore"

# Need sudo
sudo -v
# Remove Manticore
rm -Rf $MANTICORE_ROOT
# Remove launchd
sudo launchctl unload "/Library/LaunchDaemons/$LAUNCHD_PLIST"
# Remove some java libs in MAX 5 and 6.1
# Restore max.java.config.txt from bkp
# Remove ZeroMQ files in /usr/local/
# Remove Node.js files in /usr/local/