This installer will by default install

* Manticore in `/Applications/Manticore`
* Launchd plist in `/Library/LaunchDaemons/` to run Manticore in the backgound and at startup

However other options are available depending on your system

* Install the dependencies
	+ Node.js v0.10.29
	+ ZeroMQ 4.0.4

By default the installer will try to look if you already have Node.js and ZeroMQ installed (looking at `/usr/loca/bin` and `/usr/local/lib`). We prefer to install dependencies with Homebrew but if they are missing, they will be installed.

* Add Java libraries and configuration to use a Manticore client in Max
	+ Java librairies for Max 5 
	+ Java librairies for Max 6.1

By default the installer will try look if Max/MSP is present on your computer by looking at `/Applications/Max5/` and `/Applications/Max 6.1/`