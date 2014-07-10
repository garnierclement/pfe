# Sensors

The main purpose of this project is to allow the use of sensors distributed over a network.
In the following, we propose a standardized procedure to describe a sensor and we also explain how it is incorporated within the framework.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Structure of `description.json`](#structure-of-descriptionjson)
  - [System object](#system-object)
  - [Command object](#command-object)
    - [Command structure](#command-structure)
    - [Command exit status](#command-exit-status)
  - [Data description object](#data-description-object)
  - [Bootstrap procedure](#bootstrap-procedure)
  - [Request procedure](#request-procedure)
    - [Mode](#mode)
    - [Options](#options)
    - [Steps: Check > Generate > Execute](#steps-check--generate--execute)
- [How is this description file used by Manticore ?](#how-is-this-description-file-used-by-manticore-)
- [Tutorial: Adding a sensor](#tutorial-adding-a-sensor)
  - [Setting up the workspace](#setting-up-the-workspace)
  - [Write the description file](#write-the-description-file)
  - [Write your scripts/programs](#write-your-scriptsprograms)
- [Custom procedure](#custom-procedure)
- [Further works](#further-works)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Structure of `description.json`

Each sensor **must** be described by a [JSON] file called `description.json`. This file **must** be located at the root of the sensor working directory folder (each sensor have its own folder in the `sensors/` directory of the repository). The purpose of the file is to report the instructions that Manticore should follow to detect the presence of the sensor and to handle the request on it.

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
	+	Describe the [Request] procedure so that a node can request the sensor's data. This procedure can have several *modes* and contains 3 main steps namely *check* to check whether the sensor is still available, *generate* in the case that we need to generate a file and finally *execute* that will trigger the commands to send the data to the requester's endpoint.

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
*	The `platform` property is **mandatory** and **must be equivalent** to a value returned by `require('os').platform()` in Node.js
*	The `arch`property is optional and if set then it **must be equivalent** to a value returned by `require('os').arch()` in Node.js

> For more information, refer to the [OS module](http://nodejs.org/api/os.html) in Node.js API

Pay attention to the difference between

	"linux": {
			"platform": "linux"
		}

and

	"pi": {
			"platform": "linux",
			"arch": "arm"
		}

The first one targets all Linux operating systems (regardless of the architecture) whereas the second one only targets those that run on ARM processors (but not specifically Raspberry Pi, the alias just implies it).

So if we have the following commands

	{
		"cmd": "./command_for_unix_systems.sh",
		"systems": [
			"linux",
			"osx"
		]
	},
	{
		"cmd": "./command_only_for_pi.sh",
		"systems": [
			"pi"
		]	
	}

On the Rapsberry Pi, Manticore will match on 2 aliases `linux` (because of the platform) and `pi` (because of the platform and architecture) and therefore execute both commands.

Here, we use the alias `pi` for because we use devices called Raspberry Pi. Nonetheless the alias `linux-arm` could also have been used because its meaning is more closely related to the platform and architecture description.

The important thing is to choose an alias that fits best to what you want to achieve and to be consistent in the way of describing a specific platform or architecture within one `description.json` file. Indeed, these system aliases are going to be used as a reference in the `systems` property of the [Command] object (described in the next section).

### Command object

The Command object is a data structure representing a command that must be executing to perform any action.

#### Command structure

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
	+	Parameters starting with a `$` (dollar sign) are variables. This means that they are going to be parsed and their value replaced by Manticore. For instance, the `$ADDRESS` and `$PORT` in the above example are variables.
*	The `systems` property is an *Array* of aliases to [System] objects that specifies on which systems you can apply the command. This property is **mandatory**.
*	The `sudo` property is optional and when sets to `true` implies that the command must be executed with superuser rights.

Thus, considering that we are in the sensor working directory, the result of the above example is equivalent to execute

	$ cd subfolder/scripts
	$ sudo ./myscript.sh --addr 127.0.0.1 --port 42424
	
Note that the variables `$ADDRESS` and `$PORT` have been respectively replaced by values `127.0.0.1` and `42424`.

#### Note about the execution of the command

You may notice that for a shell script the `cmd` often starts with `./myscript.sh`. This is because Manticore will create a subshell in the sensors folder and then execute the content `cmd` from there.

If you forget it, then it will try to execute `myscript.sh` and therefore look the environment variable `PATH` for it. Of course, the sensor folder is not in the `PATH` and you will get an error like `myscript.sh: command not found` or `myscript.sh: No such file or directory`.

#### Command exit status

For each sensor, Manticore is responsible for parsing the `description.json` file and thus executing the commands described in the Command object.

To achieve this goal, we are using the [Child Processes](http://nodejs.org/api/child_process.html) module in Node.js API. This means that Manticore will execute the command in a child process and will monitor its life cycle.

Indeed, when the child process exits, Manticore will inspect the command return value (or exit code). If it is a success then it will jump to the next command, otherwise an error/exception must be thrown.

By convention, a **success** is denoted by the **`0` value**. As a consequence, any other value that defers from `0` will be considered as a failure.

> In UNIX-like shells, the exit code of the precedent command can be displayed with `echo $?`


### Data description object

The Data object gives a description of the data provided by a sensor. 

	{
		"description": "X position of the mouse",
		"osc_format": "/mouse/x f"
	}

The object has a simple structure with 2 properties :

*	The `description` property provides a simple text description of the data 
*	The `osc_format` property shows the syntax of the OSC address pattern and type tag.
	+	In the above example, `/mouse/x` is the OSC address and `f` the type tag for floating-point numbers

>  For more information about OSC, refer to the [specification](http://opensoundcontrol.org/spec-1_0)

Remember that the OSC format must be in accordance with the program that is responsible to forge the OSC packets and to send send (i.e. the program triggered by the *execute* step in [Request] procedure). 

### Bootstrap procedure

The Bootstrap procedure corresponds to the commands that must be executed to detect the sensor on a node.

The structure is quite simple and is a simple array of [Command] objects for all supported systems

	"bootstrap": [
		{
			"cmd": "./detectionScript-osx.sh",
			"systems": [
				"osx"
			]
		},
		{
			"cmd": "./detectionScript-linux.sh",
			"systems": [
				"linux"
			]
		}
	]

When Manticore starts up, it will execute these commands to detect the presence of the sensor on the node. If it is a success then, the sensor's presence will be published across the network.

### Request procedure

The Request procedure corresponds to the ability to send the sensor's data in OSC format to another node that have requested it.

	"request": {
			"default": {
				"options": [
					"$ADDRESS",
					"$PORT",
					"$GENERATED_PATCH"
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

The request procedure is already implemented into Manticore, so it means that you can create new sensors and therefore no ad-hoc development should be required to make the request of the sensor's data available to other nodes. Everything is defined here in the description file.

#### Mode

As you can notice on the above excerpt of `request`, it has a property called `default`. We will refer in the following as the *mode* of the Request procedure. This will help us to give some granularity in the request procedure.  
Usually, there will only be one `mode` called `default`. Therefore the `default` mode is **mandatory**, others are optional.

How is this *mode* hierarchy be useful ? Let's consider a situation where we might want a slightly different type of the Request procedure. It is easy to implement it by just adding a new property after `default`.  
As previously defined, the `default` procedure objective is *to send the sensor's data in OSC format to some other node*. Here, we can think of other *modes* that can be *send the sensor's data with another type of format* or *to send the data over TCP (instead of UDP)*.

#### Limitation

The `limitation` property of the `default` mode of the Request procedure sets the maximum of concurrent clients that can request the data of a sensor.

This is to take in account the limitation of some sensors or drivers

> WARNING, this is a new specification that is not yet implemented in Manticore

#### Options

Each mode can have some options. These options corresponds to variables that will be set by Manticore at runtime.

The convention used here is to write them starting with a `$` (dollar sign).

The Request procedure have 3 options (in `default` mode) :

*	`$ADDRESS` corresponds to the IP address of the endpoint
*	`$PORT` corresponds to the port of the endpoint
*	`$GENERATED_PATCH` corresponds to the name of a generated file that can be needed before triggering the execution

The name of the option is just a way to remember and describe it. If your need to generate a script and not a patch, then you can call the third options `$MYSCRIPT` instead of `$GENERATED_PATCH` and use this name in your `description.json`. This will not affect the parsing of the file.

However the order is very important because Manticore will process these variables in the same order that are they described above (first the address, then the port and finally the generated file name). This means that for each *mode* of a certain procedure, the order and the number of the options must be consistent across all sensors' description files.

#### Steps: Check > Generate > Execute

The `default` mode of the Request procedure is divided into 3 steps that must be run one after another

1. `check` Check whether the sensor is still available
2. `generate` Generate an executable or a script at runtime (optional step)
3. `execute` Execute an existing or previously generated executable/script that will send the data to the endpoint that requests the resource

Each of the above mentioned steps are just arrays of [Command] objects that are going to be executed in order in regards of the `systems` property.  
For the two first steps, Manticore will monitor the exit code checking whether the `check` and `generate` steps were a success.
For the `execute` step, Manticore will run the command indefinitely until he gets a request for releasing the resource.

> For more details, you can look at the implementation in the *Sensor* constructor in `sensor.js` and especially the method  `request()` and the functions `executeCommand()`, `parseAndExecute()`, `parseExecuteAndDie()`.

## How is this description file used by Manticore ?

At the startup of Manticore, the program will try to detect the presence of sensors on the node. To achieve this goal, Manticore will browse the content of each folder in `sensors/`. Each of these folders are the working directories of a specific sensor and thus must contain a `description.js` file.

This description file -- which content is described in the previous section -- will be parsed by Manticore (for those interested in the implementation, you can refer to the method `Core.prototype.detectSensors` in `manticore.js`).

1.	The first element parsed is the `systems`. According to the node's platform and architecture, Manticore will determine which system aliases that the node is entitled.
2.	Then Manticore will try detect the sensor on the current node. To do so, it parses the `bootstrap` element and browses the [Command]. For each [Command], Manticore checks its `systems` property for matches with the system aliases. If it success, then the `cmd` is executed with `parameters`. In terms of implementation, this is done in the *Sensor* constructor (see `sensor.js` file), if the `bootstrap` fails (either because the sensor is not entitled to the node's system or because ), then constructor should not return a new *Sensor* object and fail. If it is a success, the new *Sensor* object is created and the *Core* singleton gets aware of it in its own `sensors` property. Thereafter all the detected sensors are published across the network.
3. When the *Sensor* object is created. Not only it detects it and sets up its properties(identifier, name and associated data) but also automatically implements a method `request()` matching the instructions of the Request procedure in the description file. 
	+	The prototype of this function is simple `request(mode, array_of_options)`. 
	+	The `mode` will try match the one in the description file (if not set, automatically use `default`). 
	+	The `array_of_options` are parameters set up by Manticore (e.g. after a request by another node) and therefore matched to the `options` in the description file.
4. Then Manticore will execute each step of the procedure one after another. The next step cannot be triggered if the previous step has not finished successfully. If one step fails then the procedure cannot come to a successful conclusion and an error is triggered.

> In the implementation, in order to avoid a callback hell and to give some modularity in the code, we are using the [async](https://github.com/caolan/async) module to execute the steps one after another

## Tutorial: Adding a sensor

### Setting up the workspace

As stated above, the repository contains a `sensors` folder which contains all the sensors.

	$ cd $REPO_ROOT/sensors
	$ mkdir my_new_sensor

You should now have the following tree view

	$REPO_ROOT
		|____sensors
		| |____inertial
		| | |____description.json
		| | |____ ...
		| |____mouse
		| | |____description.json
		| | |____ ...
		| |____my_new_sensor
		| | |____description.json

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

4. Add the `data` description object that will describe the type of data provided by the sensor

		{
			"name": "my_new_sensor",
			"systems": { ... },
			"data": [
				{
					"description": "some data float value",
					"osc_format": "/sensor/data f"
				},
				{
					"description": "some button on/off",
					"osc_format": "/sensor/button i"
				}
			]
		}

5. Describe the `bootstrap` procedure (i.e. the command used by Manticore at startup to detect the sensor). As we have stated above that the sensor is available on Linux, Mac OS X and Windows, we need to describe the commands accordingly.

		{
			"name": "my_new_sensor",
			"systems": { ... },
			"data": [ ... ],
			"bootstrap": [
				{
					"cmd": "./checkMySensor-unixlike.sh",
					"systems": [
						"osx",
						"linux"
					]
				},
				{
					"cmd": "checkMySensor-windows.bat",
					"systems": [
						"win"
					]
				}
			]
		}

6. Describe the `request` procedure and add a `default` mode (it's mandatory, at least one mode)

		{
			"name": "my_new_sensor",
			"systems": { ... },
			"data": [ ... ],
			"bootstrap": [ ... ],
			"request": {
				"default": {
				}
			}
		}

7. The `request` procedure is standardized with 3 options: the address of the endpoint (`$ADDRESS`), the port of the endpoint (`$PORT`) and a name for the generated script/executable if needed (`$GENERATED_PATCH`).

		{
			"name": "my_new_sensor",
			"systems": { ... },
			"data": [ ... ],
			"bootstrap": [ ... ],
			"request": {
				"default": {
					"options": [
						"$ADDRESS",
						"$PORT",
						"$GENERATED_PATCH"
					],
				}
			}
		}

8. For the `check` step, we will use the same scripts previously used in the `bootstrap` procedure

		{
			"name": "my_new_sensor",
			"systems": { ... },
			"data": [ ... ],
			"bootstrap": [ ... ],
			"request": {
				"default": {
					"options": [ ... ],
					"check": [
						{
							"cmd": "./checkMySensor-unixlike.sh",
							"systems": [
								"osx",
								"linux"
							]
						},
						{
							"cmd": "checkMySensor-windows.bat",
							"systems": [
								"win"
							]
						}
					]
				}
			}
		}

9. For the `generate` step, we will assume that no generation is required here (for instance, the mouse sensor need a Pure Data patch whereas the inertial sensor does not need anything)

		{
			"name": "my_new_sensor",
			"systems": { ... },
			"data": [ ... ],
			"bootstrap": [ ... ],
			"request": {
				"default": {
					"options": [ ... ],
					"check": [ ... ],
					"generate": [
						// empty !
					]
				}
			}
		}

10. For the `execute` step, we will use some parameters that are variables.

		{
			"name": "my_new_sensor",
			"systems": { ... },
			"data": [ ... ],
			"bootstrap": [ ... ],
			"request": {
				"default": {
					"options": [ ... ],
					"check": [ ... ],
					"generate": [],
					"execute": [
						{
							"cmd": "./sendData-unixlike.sh",
							"parameters": [
								"$ADDRESS",
								"$PORT"
							],
							"systems": [
								"osx",
								"linux"
							]
						},
						{
							"cmd": "sendData-windows.bat",
							"parameters": [
								"$ADDRESS",
								"$PORT"
							],
							"systems": [
								"win"
							]
						}
					]
				}
			}
		}

### Write your scripts/programs

According to the written `description.json` file, now you should write your scripts or dedicated programs and drivers.

For the `bootstrap` procedure and the `check` step of the `request` procedure

*	`checkMySensor-unixlike.sh`
*	`checkMySensor-windows.bat`

Both of these scripts must return an exit code `0` if the test is a success.

For the `execute` step of the `request` procedure

* `sendData-unixlike.sh` that takes 2 arguments (address and port)
*	`sendData-windows.bat` that takes 2 arguments (address and port)

Both of these scripts must trigger a program that will send OSC data to the endpoint

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

It is important to understand that -- contrary to the Request procedure -- any new procedure implies that some ad-hoc development must be done in Manticore in order to handle it.  
To implement, you should edit the constructor of the *Sensor* object (`sensor.js`) and implement a new method called `procedure_name()`. Doing so, you will then be able to call it in a standard way `my_sensor.procedure_name(mode, [args])` with `mode` being either `default` or `custom_mode` and the array of arguments matching to the `options` property of the considered mode.

## Further works

*	Find a way to create some JSON Schema and to validate the JSON description files, maybe see <http://json-schema.org/>
*	Automatic generation of methods regarding the custom procedure, we could parse all other procedure and get the method associated, that will use the `async` module to execute each step. The code will be then generated at runtime
*	We can think to develop a workaround for the limitation of some sensors driver in the case of multiples concurrent client requests. To do so, the data would always be sent to Manticore and Manticore would be responsible to duplicate the OSC data and to send them to multiple client at the same time. However, this means that we need to change the way Manticore handles and respond to requests
