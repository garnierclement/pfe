#!/bin/sh

PLIST_ID="com.github.garnierclement.pfe.manticore"

clear
sudo -v
sudo launchctl load "/Library/LaunchDaemons/$LAUNCHD_PLIST.plist"
read -p "Press Return to Close..."
