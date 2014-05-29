wpfe
===

Projet de fin d'études - WSN Lab SJTU

## Installation on Mac OS X

Clone this repository

	$ git clone https://github.com/garnierclement/pfe

Install the package manager [Homebrew]

	$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
	$ brew update

Install Node.js v0.10.28

	$ brew install nodejs

## Installation on Raspbian (Raspberry Pi)

Clone this repository

	$ git clone https://github.com/garnierclement/pfe

Update package manager database

	$ sudo apt-get update

Install Avahi daemon and its tools

	$ sudo apt-get install avahi-daemon libnss-mdns
	$ sudo apt-get install avahi-utils

Install Pure Data

	$ sudo apt-get install puredata

Compile and install Node.js v0.10.28 from source tarball (**it takes around 2 hours !**)

	$ wget http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
	$ tar xvzf node-v0.10.28.tar.gz
	$ cd node-v0.10.28
	$ ./configure
	$ make
	$ sudo make install
	$ sudo ldconfig
	$ rm zeromq-node-v0.10.28.tar.gz
	$ rm -rf node-v0.10.28

Alternatively, if you have already compiled (i.e. `make`) it once on one Raspberry Pi, you can directly do

	$ cd node-v0.10.28
	$ ln -fs out/Release/node node
	$ sudo /usr/bin/python tools/install.py install
	$ node -v 				# must display v.0.10.28
	$ npm -v 				# must display v1.4.9	

Compile and install ZeroMQ v4.0.4 from source tarball (also requires libtool, autoconf and automake, but they are built-in Rapsbian)

	$ sudo apt-get install uuid-dev
	$ wget http://download.zeromq.org/zeromq-4.0.4.tar.gz
	$ tar xvzf zeromq-4.0.4.tar.gz
	$ cd zeromq-4.0.4
	$ ./configure --with-pgm
	$ make
	$ sudo make install
	$ sudo ldconfig
	$ rm zeromq-4.0.4.tar.gz
	$ rm -rf zeromq-4.0.4




[Homebrew]: http://brew.sh/
[Node.js]: http://nodejs.org/
