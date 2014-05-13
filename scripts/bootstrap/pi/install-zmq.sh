#!/bin/sh

# Installing stable release 3.2.4
# Instructions : http://zeromq.org/intro:get-the-software
# 
# launch script with sudo


echo "[Installing dependence uuid-dev]"
sudo apt-get install uuid-dev

echo "[Downloading 0MQ 3.2.4]"
wget http://download.zeromq.org/zeromq-3.2.4.tar.gz

echo "[Extracting]"
tar xvzf zeromq-3.2.4.tar.gz

echo "[configure && make]"
cd zeromq-3.2.4
./configure --with-pgm
make

echo "[Installation]"
sudo make install

echo "[Updating system’s shared library cache]"
sudo ldconfig