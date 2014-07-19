# Virtual sensor

This sensor is a virtual sensor that have no physical existence.  
It is solely used to do some testing with the parsing of the `description.json` file.

This folder must be ignored in production environment.

By default the detection of this sensor will fail if a file called `testfile` is missing in the directory.  
To make it successful you should create this missing file

	$ touch testfile

