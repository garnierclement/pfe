#!/bin/sh

# Installing stable release 3.2.4
# Instructions : http://zeromq.org/intro:get-the-software

sudo apt-get install uuid-dev

wget http://download.zeromq.org/zeromq-3.2.4.tar.gz

tar xvzf zeromq-3.2.4.tar.gz

./configure --with-pgm

make

sudo make install

sudo ldconfig