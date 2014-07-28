#!/bin/sh

# Variables
LAUNCHD_PLIST="com.github.garnierclement.pfe.manticore.plist"
MANTICORE_ROOT="/Applications/Manticore"
MAX6_JAVA_ROOT=/Applications/Max\ 6.1/Cycling\ \'74/java
MAX5_JAVA_ROOT=/Applications/Max5/Cycling\ \'74/java

# Need sudo
sudo -v

# Remove Manticore
read -p "Remove Manticore [yn]" rm_manticore
if [[ $rm_manticore = y ]]; then
	sudo rm -vRf $MANTICORE_ROOT
fi

# Remove launchd plist
read -p "Remove Manticore as a daemon [yn]" rm_daemon
if [[ $rm_daemon = y ]]; then
	sudo launchctl unload "/Library/LaunchDaemons/$LAUNCHD_PLIST"
	sudo rm -v /Library/LaunchDaemons/$LAUNCHD_PLIST
fi

# Remove some java libs in Max 5
read -p "Remove Max/MSP 5 java libs [yn]" rm_max5
if [[ $rm_max5 = y ]]; then
	rm -v "$MAX5_JAVA_ROOT"/lib/commons-beanutils-1.8.0.jar
	rm -v "$MAX5_JAVA_ROOT"/lib/commons-collections-3.2.1.jar
	rm -v "$MAX5_JAVA_ROOT"/lib/commons-lang-2.5.jar
	rm -v "$MAX5_JAVA_ROOT"/lib/commons-logging-1.1.3.jar
	rm -v "$MAX5_JAVA_ROOT"/lib/ezmorph-1.0.6.jar
	rm -v "$MAX5_JAVA_ROOT"/lib/json-lib-2.4-jdk15.jar
fi

# Remove some java libs in Max 6.1
read -p "Remove Max/MSP 6.1 java libs [yn]" rm_max5
if [[ $rm_max5 = y ]]; then
	rm -v "$MAX6_JAVA_ROOT"/lib/commons-beanutils-1.8.0.jar
	rm -v "$MAX6_JAVA_ROOT"/lib/commons-collections-3.2.1.jar
	rm -v "$MAX6_JAVA_ROOT"/lib/commons-lang-2.5.jar
	rm -v "$MAX6_JAVA_ROOT"/lib/commons-logging-1.1.3.jar
	rm -v "$MAX6_JAVA_ROOT"/lib/ezmorph-1.0.6.jar
	rm -v "$MAX6_JAVA_ROOT"/lib/json-lib-2.4-jdk15.jar
fi

# Restore max.java.config.txt from max.java.config.bkp
# TODO

# Remove ZeroMQ files in /usr/local/
read -p "Remove ZeroMQ [yn]" rm_zmq
if [[ $rm_zmq = y ]]; then
	rm -v /usr/local/bin/curve_keygen
	rm -v /usr/local/bin/pkg-config
	rm -v /usr/local/include/zmq.h
	rm -v /usr/local/include/zmq_utils.h
	rm -v /usr/local/lib/libzmq.*
	rm -v /usr/local/lib/pkgconfig/libzmq.pc
	rm -v /usr/local/share/aclocal/pkg.m4
	rm -vRf /usr/local/share/doc/pkg-config
	rm -v /usr/local/share/man/man1/pkg-config.1
	rm -v /usr/local/share/man/man3/zmq_*
	rm -v /usr/local/share/man/man7/zmq*
fi

# Remove Node.js files in /usr/local/
read -p "Remove Node.js [yn]" rm_node
if [[ $node_zmq = y ]]; then
	rm -v /usr/local/bin/node
	rm -v /usr/local/etc/bash_completion.d/npm
	rm -v -Rf /usr/local/include/node
	rm -v -Rf /usr/local/lib/dtrace/node.d
	rm -v -Rf /usr/local/libexec/npm
	rm -v -Rf /usr/local/share/man/man1/node.1
fi