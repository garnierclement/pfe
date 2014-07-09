# Sensors

The main purpose of this project is to allow the use of sensors distributed over a network.
In the following, we propose a standardized procedure to describe a sensor and we also explain how it is incorporated within the framework.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Structure of `description.json`](#structure-of-descriptionjson)
  - [System object](#system-object)
  - [Command object](#command-object)
  - [Data description object](#data-description-object)
  - [Request procedure](#request-procedure)
    - [Mode](#mode)
    - [Options](#options)
    - [Check/Generate/Execute](#checkgenerateexecute)
- [A simple explained example: the mouse sensor](#a-simple-explained-example-the-mouse-sensor)
- [Tutorial: Adding a sensor](#tutorial-adding-a-sensor)
  - [Set up the workspace](#set-up-the-workspace)
  - [Write the description file](#write-the-description-file)
- [How is this description file used by Manticore ?](#how-is-this-description-file-used-by-manticore-)
- [Further works and customization](#further-works-and-customization)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Structure of `description.json`

Each sensor **must** be described by a [JSON] file called `description.json`. This file **must** be located at the root of the sensor working directory folder (each sensor have its own folder in the `sensors/` directory of the repository).

*	`name`
	+	*String*
	+	**mandatory**
	+	Name of the sensor and also the name of the folder containing the `description.json` file
*	`systems`
	+	*Object* containing *[System]* objects indexed by an alias
	+	**mandatory** (at least one *[Command]* child)
	+	Describe operating systems and architectures supported by the sensor. Each *[System]* is indexed by an alias that will be referenced by the `systems`property` of the *[Command]* objects
*	`bootstrap`
	+ 	*Array* of *[Command]* objects
	+ 	**mandatory**
	+ 	Describe the commands to be executing when Manticore starts in order to detect whether the sensor is present or not on the node
*	`data`
	+ 	*Array* of *[Data]* objects
	+ 	**mandatory** (at least one *[Data]* child)
	+ 	Describe the data and the related [OSC] format provided by a sensor
*	`request`
	+	*Object*
	+	**mandatory**
	+	Describe the [Request] procedure so that a node can request the sensor's data. This procedure can have several *modes* and contains 3 main steps namely *check* to check whether the sensor is still available, *generate* in the case that we need to generate a file and finally *execute* that will trigger the commands to send the data to some endpoint.

[Command]: #command-object
[System]: #system-object
[Request]: #request-procedure
[Data]: #data-description-object
[OSC]: http://opensoundcontrol.org/introduction-osc
[JSON]: http://json.org/


### System object

A system object is a data structure that describes the operating systems and architectures supported by a sensor. In the description file, that looks like the following :

	"alias_of_system": {
	  "platform": "platform_of_system",
	  "arch": "architecture_of_system"
	}

*	The value of the `alias_of_system` can be anything that gives an understandable description to the system such as `linux`, `osx` or even `my_own_pc`.
	+ 	Currently we use the following values `linux`, `pi`, `win` and `osx`
	+ 	These aliases are custom-made and does not rely on Node.js API or terminology
*	The `platform` property is **mandatory** and *must be equivalent* to a value returned by `require('os').platform()` in Node.js
*	The `arch`property is optional and if set then it *must be equivalent* to a value returned by `require('os').arch()` in Node.js

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

The first one will target all Linux operating systems (regardless of the architecture) whereas the second one only targets those that run on ARM processors (but not specifically Raspberry Pi, the alias just implies it).

Here, we use the alias `pi` for because we use devices called Raspberry Pi. Nonetheless the alias `linux-arm` could also have been used because its meaning is more closely related to the platform and architecture description.

The important thing is to choose an alias that fits best to what you want to achieve and to be consistent in the way of describing a specific platform or architecture within one `description.json` file. Indeed, these system aliases are going to be used as a reference in the [Command] object (described in the next section).

### Command object

The Command object is data structure representing a command that must be executing to perform any action.

	{
	  "path": "subfolder/scripts",
      "cmd": "./my_script.sh",
      "parameters": [
      	"--addr"
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

*	The `path` property is the place where the subshell will be executed. This property is optional if the command is in the environment variable `PATH` or if the command/program is in the same directory as the `description.json` file.
*	The `cmd` property is the command that will be executed. This property is obviously **mandatory**.
*	The `parameters`is an *Array* of arguments that will be passed to the command specified in the `cmd` property
	+	Parameters starting with a `$` (dollar sign) are variables, this means that there are going to be parsed and their value replaced by Manticore. For instance, the `$ADDRESS` and `$PORT` in the above example are variables.
*	The `systems` property is an *Array* of aliases to [System] objects that specifies on which systems you can apply the command. This property is **mandatory**.
*	The `sudo` property is optional and when sets to `true` implies that the command must be executed with the superuser rights.

Thus, considering that we are in the sensor working directory, the result of the above example is equivalent to execute

	$ cd subfolder/scripts
	$ sudo ./myscript.sh --addr [$ADDRESS] --port [$PORT]

### Data description object

The Data object gives a description of the data provided by the sensor. 

	{
      "description": "X position of the mouse",
      "osc_format": "/mouse/x f"
    }

The object has a simple structure with 2 properties :

*	The `descriptionn` property provides a simple text description of the data 
*	The `osc_format` property shows the syntax of the OSC address pattern and type tag. For more information about OSC, refer to the [specifications](http://opensoundcontrol.org/spec-1_0)

Remember that the OSC format must be in accordance with the program that is responsible to forge the OSC packets and to send send (i.e. the program triggered by the *execute* step in [Request] procedure). 

### Request procedure

The Request procedure corresponds to the ability for the 

	"request": {
      "default": {
        "options": [
 			// some options
        ],
        "check": [
        	// some Command objects
        ],
        "generate": [
        	// some Command objects
        ],
        "execute": [
        	// some Command objects
        ],
      }
	}



#### Mode

As you can notice on the above excerpt of `request`, it has a property called `default`. We will refer in the following as the *mode* of the Request procedure. his will help us to give some granularity in the case of we need to consider different types of a procedure. 

Usually, there will be only one `mode` called default is mandatory and obviously will be the default way of the procedure to be called.

#### Options

Each mode can have some options. These options corresponds to 

The convention used here is to write them starting with a `$` (dollar sign)

#### Steps: Check > Generate > Execute

The 'default' mode of the Request procedure is divided into 3 steps that must be run one after another

1. Check whether the sensor is still available
2. Generate an executable or a script at runtime
3. Execute an existing or previously generated executable/script that will send the data to the endpoint that requests the resource

Each of these steps are just some arrays of [Command]. At each step, Manticore will monitor the exit code of the command. We use the standard C convention, 0 means that it is a success and so we can jump to the next step, any other value means that an error occurred a

For those interested in the implementation, you can refer to the 

## A simple explained example: the mouse sensor

## Tutorial: Adding a sensor

### Setting up the workspace

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

3. Add the `systems` property that will contain objects describing the platform and architecture supported by the sensor. Here we target Linux, Mac OS X and Windows operating (regardless of system versions and architecture)

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

## How is this description file used by Manticore ?

At the startup of Manticore, the program will try to detect the presence of sensors on the node. To achieve this goal, Manticore will browse the content of each folder in `sensors/`. Each of these folders are the working directories of a specific sensor and thus must contain a `description.js` file.

This description file -- which content is described in the previous section -- will be parsed by Manticore (for those interested in the implementation, you can refer to the method `Core.prototype.detectSensors` in `manticore.js`).

1.	The first element parsed is the `systems`. According to the node's platform and architecture, Manticore will determine which system aliases that the node is entitled.
2.	Then Manticore will try detect the sensor on the current node. To do so, it parses the `bootstrap` element and browses the [Command]. For each [Command], Manticore checks its `systems` property for matches with the system aliases. If it success, then the `cmd` is executed with `parameters`. In terms of implementation, this is done in the Sensor constructor (see `sensor.js` file), if the `bootstrap` fails (either because the sensor is not entitled to the node's system or because ), then constructor should not return a new *Sensor* object. If it is a success, the Sensor is created and the Core singleton get aware of it in its own `sensors` property.


## Custom procedure

If you want to create a custom procedure for your sensor. We can look at the [Request] procedure or the skeleton below.

	"procedure_name": {
      "default": {
        "options": [
 			// some options
        ],
        "step_1": [
        	// some Command objects
        ],
        "step_2": [
        	// some Command objects
        ],
      },
      "custom_mode": {
        "options": [
 			// some options
        ],
        "step_1": [
        	// some Command objects
        ],
        "step_2": [
        	// some Command objects
        ],
      },
	}

It is important to understand that any new procedure implies that some ad-hoc development must be done in Manticore in order to handle it. To implement, you should edit the constructor of the *Sensor* object (`sensor.js`) and implement a new method called `procedure_name`. Doing so, you will then be able to call it in a standard way `my_sensor.procedure_name(mode, [args])` with `mode` being either `default` or `custom_mode` and the array of arguments matching to the `options` property of the considered mode.

## Further works

*	Find a way to create some JSON Schema and to validate the JSON description files, maybe see <http://json-schema.org/>
*	Automatic generation of methods regarding the custom procedure, we could parse all other procedure and get the method associated, that will use the `async` module to execute each step. The code will be then generated at runtime

