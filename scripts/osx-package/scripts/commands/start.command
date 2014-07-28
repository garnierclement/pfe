#!/bin/sh

DIR=`dirname $0`
cd $DIR/projects/manticore
/usr/local/bin/node app.js
read -p "Press Return to Close..."
