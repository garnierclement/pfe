# Sensors

The main purpose of this project is to allow the use of sensors distributed over a network ...

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Structure of `description.json`](#structure-of-descriptionjson)
  - [System object](#system-object)
  - [Command object](#command-object)
  - [Data description object](#data-description-object)
  - [Request procedure](#request-procedure)
- [A simple commented example: the mouse sensor](#a-simple-commented-example-the-mouse-sensor)
- [Tutorial: Adding a sensor](#tutorial-adding-a-sensor)
  - [Set up the workspace](#set-up-the-workspace)
  - [Write the description file](#write-the-description-file)
- [Further extension](#further-extension)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Structure of `description.json`

Each sensor must described by a JSON file called `description.json`. This file must be located at the root of the sensor working directory folder (i.e. each type of sensor have its own folder in the `sensors/` directory of the repository).

*	`name`
	+	*String*
	+	**mandatory**
	+	Name of the sensor and also the name of the folder containing the `description.json` file
*	`systems`
	+	*Object* containing *[System]* objects reference by an alias
	+	**mandatory** (at leat one *[Command]* child)
	+	Describe operating systems and architectures supported by the sensor. Each "system" is referenced by an alias used in the *[Command]* objects
*	`bootstrap`
	+ 	*Array* of *[Command]* objects
	+ 	**mandatory**
	+ 	Describe the command to be executing when Manticore starts in order to detect whether the sensor is present or not on the node
*	`data`
	+ 	*Array* of *[Data]* objects
	+ 	**mandatory** (at least one [Data] child)
	+ 	Describe the data and the related OSC format provided by a sensor
*	`request`
	+	*Object*
	+	**mandatory**
	+	Describe the [Request] procedure so that a node can request the sensors data. This procedure can have several *modes* and contains 3 mains steps namely *check* to check whether the sensor is still available, *generate* in the case that we need to generate a file and finally *execute* that will trigger the commands to send the data to some endpoint.

[Command]: #command-object
[System]: #system-object
[Request]: #request-procedure
[Data]: #data-description-object


### System object

A system object is a data structure that describe the operating systems and architectures supported by a sensor. In a JSON file, that looks like the following :

	"alias_of_system": {
		"platform": "platform_of_system",
		"arch": "architecture_of_system"
	}

*	The value of the `alias_of_system` can be anything that describe correctly the system such as `linux`, `osx` or even `my_own_pc`.
	+ 	Currently the value used are `linux`, `pi`, `win` and `osx`.
*	The `platform` property is **mandatory** and must be equivalent to the value returned by `require('os').platform()` in Node.js.
*	The `arch`property is optional and if set then it must be equivalent to the value returned by `require('os').arch()` in Node.js.

**Note**: for more information about the `OS` Node.js API, refer to <http://nodejs.org/api/os.html>

Pay attention to the difference between

	"linux": {
      "platform": "linux"
    }

and

	"pi": {
      "platform": "linux",
      "arch": "arm"
    }

The first one will target all Linux operating systems (regardless of the architecture) whereas the second one only targets those that run on ARM processors.  

Here, we use the alias `pi` for because we use devices called Raspberry Pi. Nonetheless the alias `linux-arm` could also have been used because its meaning is more closely related to the platform and architecture description.

The important thing is to choose an alias that fits best to what you want to achieve and to be consistent in the way of describing a specific platform or architecture within one `descritpion.json` file. Indeed, these system aliases are going to be used as a reference in the command object (described in the next section).

### Command object

The command object is data structure representing a command that must be executing to perform any action.

	{
	  "path": "subfolder/bin",
      "cmd": "./my_script.sh",
      "parameters": [
      	"-addr"
        "$ADDRESS",
        "--port",
        "$PORT",
      ],
      "systems": [
        "osx",
        "linux"
      ],
      "sudo": true
  	}

*	The `path` property is the place where the subshell will be executed. This property is optional if the command is in the environnement variable `PATH` or if the command/program is in the same directory as the `description.json` file.
*	The `cmd` property is the command that will be executed. This property is obviously mandatory.

### Data description object

### Request procedure


## A simple commented example: the mouse sensor

## Tutorial: Adding a sensor

### Set up the workspace

As stated above, the repository contains a `sensors` folder wich contains all the sensors.

	$ cd $REPO_ROOT/sensors
	$ mkdir my_new_sensor

### Write the description file

1. Create a `description.json` file with an empty object

	{
	}

2. Add the `name` property and sets its value to the name of sensor (which must also be the name of the folder containing the description file)

	{
		"name": "my_new_sensor"
	}

3. Add the `systems` perperty that will contain objects describing the platform and architecture supported by the sensor. Here we target Linux, Mac OS X and Windows operating (regardless of system versions and architecture)

	{
		"name": "my_new_sensor",
		"systems": {
			"linux": {
    		  	"platform": "linux"
    		},
    		"osx": {
    		  	"platform": "darwin"
    		},
    		"win": {
    		  	"platform": "win32"
    		}
		}
	}

## Further extension

