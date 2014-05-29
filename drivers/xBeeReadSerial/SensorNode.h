#ifndef SENSOR_NODE
#define SENSOR_NODE



#include "fun.h"


class SensorNode
{
	public:
		SensorNode();
		~SensorNode();
		SensorNode(char id);
		SensorNode(char id, char* filename);

		// read calibration data
		void setNodeData(char id, char* filename);
		void setNodeData();
		
		// use calibration data to calibrate
		float binary_match(float raw);

		void disp();

	public: 
			char _id;			// node id
			char* _calFile;		// calibration file name
			int	 _size;			// rows of calibration file, size of _nodeData
			DataRow* _nodeData;	// calibration data of this sensor

};

class SensorConfig
{
	public:
		SensorConfig(char* filename);
		~SensorConfig();

		void Disp();

		SensorNode* _sensorNodes;
		int  _size;
		
		float calibrate(char id, float raw);

};



#endif