#ifndef FUN_H
#define FUN_H


#include <iostream>
#include <fstream>
#include <string>
#include <cmath>
using namespace std;


struct DataRow
{
	int out;
	float raw;

	DataRow(){
		out = 0;
		raw = 0.0;
	}
};

// reading a text file

int CountLines(char *filename);
void read_calibration();
void read_calibration(const char* filename);

// search for the correct calibrate value
float binary_search(float raw);
void readTest(const char* filename);




#endif