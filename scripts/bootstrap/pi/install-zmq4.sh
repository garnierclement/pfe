#!/bin/sh

# Installing stable ZeroMQ release 4.0.4 on Raspbian linux
# Instructions : http://zeromq.org/intro:get-the-software
# 
# launch script with sudo


echo "[Installing dependence uuid-dev]"
sudo apt-get install uuid-dev
# Node : others dependences are libtool, autoconf and automake (built-in Raspbian distro for Raspberry Pi)

echo "[Downloading 0MQ 4.0.4]"
wget http://download.zeromq.org/zeromq-4.0.4.tar.gz

echo "[Extracting]"
tar xvzf zeromq-4.0.4.tar.gz

echo "[configure && make]"
cd zeromq-4.0.4
./configure --with-pgm
make

echo "[Installation]"
sudo make install

echo "[Updating system’s shared library cache]"
sudo ldconfig

echo "[Cleaning]"
rm zeromq-4.0.4.tar.gz
rm -rf zeromq-4.0.4