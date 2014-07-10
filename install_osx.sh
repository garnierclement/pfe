#!/bin/sh

# Script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if home brew is already installed.
check_brew() {

    if hash brew 2>/dev/null; then
    	echo "[INSTALL] Homebrew already installed. Checking for update..."
       	brew update;
    else
    	echo "[INSTALL] Installing homebrew..."
       	ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
		brew update
    fi
}

# Check if Node.js is already installed.
install_node() {
	if hash node 2>/dev/null; then
		echo "[INSTALL] Node.js already installed."
	else
		echo "[INSTALL] Installing Node.js..."
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

install_java_libraries() {

	echo "[INSTALLING] Installing Java libraries..."
	if [ -d /Applications/Max5/ ]; then
		echo "[INSTALL] Installing necessary Java libraries to Max 5"
		echo "[INSTALL] Copying necessary Java libraries to /Applications/Max 5/Cycling '74/java/lib/"
		cp -v $DIR/projects/MAX/max_externals/lib/*.jar /Applications/Max5/Cycling\ \'74/java/lib/
		echo "[INSTALL] Editing binary and library paths in max.java.config.txt"
		cp -v /Applications/Max5/Cycling\ \'74/java/max.java.config.txt /Applications/Max5/Cycling\ \'74/java/max.java.config.bkp
		sed -i "" '19c\
		max.dynamic.class.dir '$DIR'/projects/MAX/max_externals/bin/\
		' /Applications/Max5/Cycling\ \'74/java/max.java.config.txt
		sed -i "" '22c\
		max.dynamic.class.dir '$DIR'/projects/MAX/max_externals/lib/\
		' /Applications/Max5/Cycling\ \'74/java/max.java.config.txt
	elif [ -d /Applications/Max\ 6.1/ ]; then
		echo "[INSTALL] Installing necessary Java libraries to Max 6"
		echo "[INSTALL] Copying necessary Java libraries to /Applications/Max 6/Cycling '74/java/lib/"
		cp -v $DIR/projects/MAX/max_externals/lib/*.jar /Applications/Max\ 6.1/Cycling\ \'74/java/lib/
		echo "[INSTALL] Editing binary and library paths in max.java.config.txt" 
		cp -v /Applications/Max\ 6.1/Cycling\ \'74/java/max.java.config.txt /Applications/Max\ 6.1/Cycling\ \'74/java/max.java.config.bkp
		sed -i "" '37c\
		max.dynamic.class.dir '$DIR'/projects/MAX/max_externals/bin/\
		' /Applications/Max\ 6.1/Cycling\ \'74/java/max.java.config.txt
		sed -i "" '40c\
		max.dynamic.class.dir '$DIR'/projects/MAX/max_externals/lib/\' 
		/Applications/Max\ 6.1/Cycling\ \'74/java/max.java.config.txt
	fi
}

install() {
	check_brew
	install_node
	install_zmq
	install_pkg
	npm_install
	install_java_libraries
	add_launchd
}

add_launchd() {

	echo '[INSTALL] Adding manticore to /Library/LaunchDaemons...'
	sudo echo -e '<?xml version="1.0" encoding="UTF-8"?>
	<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
	<plist version="1.0">
	\t<dict>
	\t\t<key>Label</key>
	\t\t<string>local.manticore</string>
	\t\t<key>Program</key>
	\t\t<string>'$DIR'/projects/manticore/launch-manticore.sh</string>
	\t\t<key>RunAtLoad</key>
	\t\t<true/>
	\t\t<key>KeepAlive</key>
	\t\t<true/>
	\t\t<key>StandardInPath</key>
	\t\t<string>/tmp/launch-manticore-daemon.stdin</string>
	\t\t<key>StandardOutPath</key>
	\t\t<string>/tmp/launch-manticore-daemon.stdout</string>
	\t\t<key>StandardErrorPath</key>
	\t\t<string>/tmp/launch-manticore-daemon.stderr</string>
	\t</dict>
	</plist>' >/Library/LaunchDaemons/local.manticore.plist

	echo '[INSTALL] Loading Manticore Daemon...'
	sudo launchctl load /Library/LaunchDaemons/local.manticore.plist

	echo '[INSTALL] Started Manticore Daemon...'
	sudo launchctl start /Library/LaunchDaemons/local.manticore.plist



}

install



