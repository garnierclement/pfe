#!/bin/sh

# Where we are storing our version of node
sudo mkdir /opt/node

# Get latest version of Node.js here http://nodejs.org/dist
sudo wget http://nodejs.org/dist/v0.11.3/node-v0.11.3-linux-arm-pi.tar.gz

# Extract .tar.gz
tar xvzf node-v0.11.3-linux-arm-pi.tar.gz

# Copy files to destination 
sudo cp -r node-v0.11.3-linux-arm-pi/* /opt/node

# Create symlinks // or add /opt/node/bin to path
sudo ln -s /opt/node/bin/node /usr/local/bin/node
sudo ln -s /opt/node/bin/npm /usr/local/bin/npm

source ~/.bashrc

# Verification
node -v
npm -v

# Clean up
rm -rf node-v0.11.3-linux-arm-pi*


# en recompilant
# wget http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
# 
# pour installer
# ln -fs out/Release/node node
# /usr/bin/python tools/install.py install
