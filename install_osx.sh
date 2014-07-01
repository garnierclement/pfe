#!/bin/sh


# Check if home brew is already installed.
check_brew() {

    if hash brew 2>/dev/null; then
    	echo "[INSTALL] Homebrew already installed. Checking for upgrade..."
       	brew update;
    else
    	echo "[INSTALL] Installing homebrew..."
       	ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
		brew update
    fi
}

# Check if Node JS is already installed.
install_node() {
	if hash node 2>/dev/null; then
		echo "[INSTALL] Node JS already installed."
	else
		echo "[INSTALL] Installing Node JS..."
		brew install node
	fi
}

# Install zmq
install_zmq() {
	echo "[INSTALL] Installing ZMQ..."
	brew install zeromq
}

# Check if pkg-config is already installed.
install_pkg() {
	if hash pkg-config 2>/dev/null; then
		echo "[INSTALL] pkg-config already installed."
	else
		echo "[INSTALL] Installing pkg-config..."
		brew install pkg-config
	fi

}

npm_install() {
	cd projects/manticore/
	npm install
}

install() {
	check_brew
	install_node
	install_zmq
	install_pkg
	npm_install
}



install



