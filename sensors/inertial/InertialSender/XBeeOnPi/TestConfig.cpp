#include <stdio.h>

#include "SensorNode.h"
#include "fun.h"


int main(int argc, char *argv[])
{

	SensorConfig config("_config.txt");
	config.Disp();

	cout << config.calibrate('A',-28) << endl;
	cout << config.calibrate('A',-18)<< endl;
	cout << config.calibrate('A',-8)<< endl;
	cout << config.calibrate('A',0)<< endl;
	cout << config.calibrate('A',8)<< endl;
	cout << config.calibrate('A',13)<< endl;
	
	cout << config.calibrate('A',23)<< endl;
	cout << config.calibrate('A',33)<< endl;
	cout << config.calibrate('A',43)<< endl;
	cout << config.calibrate('A',53)<< endl;
	cout << config.calibrate('A',63)<< endl;
	cout << config.calibrate('A',93)<< endl;
	
	return 0;
}
