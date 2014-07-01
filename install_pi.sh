#!/bin/sh


install_node() {
	if hash node 2>/dev/null; then
		echo "[INSTALL] Node JS already installed."
	else
		echo "[INSTALL] Installing Node JS..."
		wget http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
		tar xvzf node-v0.10.28.tar.gz
		cd node-v0.10.28
		echo "[INSTALL] Go have a beer, this might take a while..."
		./configure
		make
		sudo make install
		sudo ldconfig
		rm zeromq-node-v0.10.28.tar.gz
		rm -rf node-v0.10.28
	fi
}

install_avahi_daemon() {
	if hash avahi-daemon 2>/dev/null; then
		echo "[INSTALL] Avahi-daemon already installed."
	else
		echo "[INSTALL] Installing Avahi-daemon..."
		sudo apt-get install avahi-daemon libnss-mdns

}

install_avahi_utils() {
	if hash avahi-utils 2>/dev/null; then
		echo "[INSTALL] Avahi-utils already installed."
	else
		echo "[INSTALL] Installing Avahi-utils..."
		sudo apt-get install avahi-utils
}


install_pd() {
	if hash puredata 2>/dev/null; then
		echo "[INSTALL] PureData already installed."
	else
		echo "[INSTALL] Installing Avahi-utils..."
		sudo apt-get install puredata
}

install_zmq() {
	echo "[INSTALL] Installing Zero MQ..."
	sudo apt-get install uuid-dev
	wget http://download.zeromq.org/zeromq-4.0.4.tar.gz
	tar xvzf zeromq-4.0.4.tar.gz
	cd zeromq-4.0.4
	./configure --with-pgm
	make
	sudo make install
	sudo ldconfig
	rm zeromq-4.0.4.tar.gz
	rm -rf zeromq-4.0.4
}

npm_install() {
	cd projects/manticore/
	npm install
}


install(){
	sudo apt-get update
	install_node
	install_avahi_daemon
	install_avahi_utils
	install_pd
	install_zmq
	npm_install
}


install