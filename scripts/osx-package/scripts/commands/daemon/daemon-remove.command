#!/bin/sh

PLIST_ID="com.github.garnierclement.pfe.manticore"

sudo -v
sudo launchctl unload "/Library/LaunchDaemons/$PLIST_ID.plist"
sudo rm -v "/Library/LaunchDaemons/$PLIST_ID.plist"
read -p "Press Return to Close..."