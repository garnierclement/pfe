#!/bin/sh

DIR=`dirname $0`
PLIST_ID="com.github.garnierclement.pfe.manticore"

cd $DIR
sudo -v
sudo cp -vRf "$PLIST_ID.plist" "/Library/LaunchDaemons/$PLIST_ID.plist"
sudo launchctl load "/Library/LaunchDaemons/$PLIST_ID.plist"
sleep 2
open http://localhost:3000/
read -p "Press Return to Close..."