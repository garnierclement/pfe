#!/bin/sh

PLIST_ID="com.github.garnierclement.pfe.manticore"

clear
sudo -v
sudo launchctl load "/Library/LaunchDaemons/$PLIST_ID.plist"
sleep 2
open http://localhost:3000/
read -p "Press Return to Close..."
