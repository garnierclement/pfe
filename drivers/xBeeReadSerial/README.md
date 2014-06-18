# xBeeReadSerial

Read raw data on serial bus and send OSC packets

## Dependencies

* [oscpack]: a simple C++ Open Sound Control (OSC) packet manipulation library

### Oscpack

Oscpach v1.1.0 is available in this repository in the following folder `libs/oscpack/`.

In order to compile and install this library globaly, go in this directory and type 

	$ make
	$ sudo make install

By default, oscpack libraires and headers are installed in `/usr/local/lib` and `/usr/local/include/ospack/` respectively.

## Guide

This driver is composed of the following elements

* `xBeeSerialSerial.cpp` is the main program, it is a driver that
	+ read from serial interface to get raw intertial data provided by the xBee chip
	+ calibrate the raw inertial data and package them into OSC packets
	+ send the forged OSC packets on UDP stream
* `SensorNode` and `SensorConfig` classes are located into the `SensorNode.cpp/.h` source files, the main program owns one instance of SensorConfig (i.e. a collection of SensorNode instances) and one SensorNode instance by intertial sensor
* `_config.txt` is a simple text file that specifies the number of intertial sensors and 
	+ the first line says the count of intertial sensors (it also corresponds to the number of following lines in the same file)
	+ each following line is divided into 2 columns separated by a tabulation like `A   node_a.txt`, the **first** element is the **name** (a letter) of the sensor and the **second** one is the path to the text file containing its **calibration** information
* `node_[letter].txt` contains calibration data for a sensor designated by a letter
* `fun.cpp/.h` source files contain useful tool functions used in the main program

## Compile 

Use `make`

> // TODO


[oscpack]: https://code.google.com/p/oscpack/