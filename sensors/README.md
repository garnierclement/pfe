# Sensors

The main purpose of this project is to allow the use of sensors distributed over a network 

## Structure of `description.json`

*	`name`
	+	String
	+	mandatory
	+	must be the name of the folder containing the `description.json` file
*	`systems`
	+	Object containing System objects
	+	mandatory (at leat one child)
*	`bootstrap` mandatory
	+ 	Object
	+ 	mandatory
	+ 	
*	`data`
	+ Array
*	`request`


### System object

A system object is a data structure that describe the operating systems and architectures supported by a sensor. In a JSON file, that looks like the following :

	"alias_of_system": {
		"platform": "platform_of_system",
		"arch": "architecture_of_system"
	}

*	The value of the `alias_of_system` can be anything that describe correctly the system such as `linux`, `osx` or even `my_own_pc`.
	+ 	Currently the value used are `linux`, `pi`, `win` and `osx`.
*	The `platform` property is mandatory and must be equivalent to the value returned by `require('os').platform()` in Node.js.
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

### Data description object


## A simple commented example: the mouse sensor

## Tutorial: Adding a sensor

### Set up the workspace

As stated above, the repository contains a `sensors` folder wich contains all the sensors.

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



