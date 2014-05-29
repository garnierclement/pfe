#include "SensorNode.h"
#include <cstdio>
#include <cstring>
#include <cstdlib>


SensorNode::SensorNode(){
	_id = 0;	
	_calFile = NULL;
	
	_size = 0;
	_nodeData = NULL;

}


SensorNode::SensorNode(char id){
	_id = id;
	
	_calFile = new char[30];
	sprintf(_calFile,"node_%c",_id);
	
	_size = 0;
	_nodeData = NULL;

	setNodeData();



}

SensorNode::SensorNode(char id, char* filename){
	_id = id;

	int leng = strlen(filename) + 1;	
	_calFile = new char[leng];
	sprintf(_calFile,"%s",filename);
	
	_size = 0;
	_nodeData = NULL;

	setNodeData();

}


void SensorNode::setNodeData(){

	if( _calFile != NULL){ // file name is ok
				
	  ifstream myfile(_calFile);
	  if (myfile.is_open())
	  {
		  int i = 0;

		  myfile>> _size;  // first row is size
		  _nodeData = new DataRow[_size];


		while( i<_size) //读取数据到数组
		{ 

		myfile>> _nodeData[i].out; 
		myfile>> _nodeData[i].raw; 

		cout << _nodeData[i].out << endl;

		i++; 
		} 
		myfile.close(); //关闭文件
	  }
	  else cout << "Unable to open _calFile"; 

	  disp();
	
	}

}




 void SensorNode::setNodeData(char id, char* filename){

	 cout << "SensorNode::setNodeData" <<endl;

	 _id = id;

	int leng = strlen(filename) + 1;	
	_calFile = new char[leng];
	sprintf(_calFile,"%s",filename);

	cout << _id << "\t" <<_calFile <<  endl;
	
	_size = 0;
	_nodeData = NULL;

	setNodeData();


}


float  SensorNode::binary_match(float raw){

/*
	if ( raw >= _nodeData[_size-1].raw ) // max_sample_value < raw <= 180
	{
		//return 180 - (raw - _nodeData[_size-1].raw)*10 / (180 - _nodeData[_size-1].raw ) ;
		return raw
	}
	if ( raw <= _nodeData[0].raw ) // -180 =< raw < min_sample_value
	{
		//return  _nodeData[0].raw - (raw - _nodeData[0].raw )*10 / (-180 - _nodeData[0].raw  );
		return raw;
	}*/


	if ( raw >= _nodeData[_size-1].raw || raw <= _nodeData[0].raw ) // max_sample_value < raw <= 180
	{
		//return 180 - (raw - _nodeData[_size-1].raw)*10 / (180 - _nodeData[_size-1].raw ) ;
		return raw;
	}

	// int size = CountLines(CountLines); =36
	 int times = log(_size) / log(2);// = 5
	// cout << "times: \t" << times << "\t |"<<endl;
	int i = 0;
	for (int k=0; k<times ; k++ )
	{
		if ( _nodeData[i].raw >= raw  ) // raw 在前一半
		{
			if( i-1 >= 0 && _nodeData[i-1].raw < raw  )// i-1已经小于 raw,则退出
				break;
			else/**/
				i = i - _size / pow(2, k+1);
		}else{
			
			if( i+1 < _size && _nodeData[i+1].raw > raw  ) // i+1已经大于 raw,则退出
				break;
			else/**/
			i = i + _size / pow(2, k+1);
		} 
	//cout << "i: " << i << "\tk: " << k << "\t _nodeData[i]: " << _nodeData[i].raw << "\t Real: " << raw <<  endl;

	}


	return _nodeData[i].out + (raw - _nodeData[i].raw)*10/( _nodeData[i+1].raw - _nodeData[i].raw);


}

SensorNode::~SensorNode(){

	if (_calFile != NULL ){
		delete[] _calFile;
		_calFile = NULL;
	}

	
	if (_nodeData != NULL ){
		delete[] _nodeData;
		_nodeData = NULL;
	}

	_id = 0;
	_size = 0;

}


void SensorNode::disp(){

	if ( _id != 0 && _size!=0)
	{
		cout << "node id: \t" << _id << "size: \t" << _size << "data: \t" << _calFile <<endl;
		for (int i=0; i<_size; i++ )
		{
			cout << _nodeData[i].out << " \t" << _nodeData[i].raw << endl;
		}
	}else{
		cout << "READ ERROR!"<< endl;
	}

}


/* --------------------------------------------------------------- */
//			SensorConfig		
//
/* --------------------------------------------------------------- */

SensorConfig::SensorConfig(char* filename){

	_sensorNodes = NULL;


	ifstream myfile(filename);
	  if (myfile.is_open())
	  {

		  char tid;
		  char tfile[30] = {0};

		  myfile >>_size;
		  cout <<  "total sensor num:\t" << _size <<endl;


		  int i = 0; 
		 _sensorNodes = new SensorNode[_size];

		while(i<_size) //读取数据到数组
		{ 

		myfile>> tid >> tfile;

		cout << tid << "\t" << tfile <<endl;
		_sensorNodes[i].setNodeData(tid, tfile);

		tid = 0;
		memset(tfile,0, strlen(tfile)+1);

		i++; 
		} 

	if (_sensorNodes != NULL)
		{
		for (int i=0;i<_size ; i++ )
		{
			_sensorNodes[i].disp();
		}
		}else{

	
		cout << " _sensorNodes is NULL!" <<endl;
		}

		myfile.close(); //关闭文件
	  }
	  else {
		  cout << "Unable to open config File！ program stop!"; 
		  exit(1);
	  }

}


SensorConfig::~SensorConfig(){

	if (_sensorNodes != NULL)
	{
		delete[] _sensorNodes;
		_sensorNodes = NULL;
	}

}

void SensorConfig::Disp(){
	
	cout << " SensorConfig::Disp()" <<endl;
	if (_sensorNodes != NULL)
	{
		cout << _size <<endl;
		for (int i=0;i<_size ; i++ )
		{
			_sensorNodes[i].disp();

		}
	}else{

	
	cout << " _sensorNodes is NULL!" <<endl;
	}

}
		
float SensorConfig::calibrate(char id, float raw){

	for(int i = 0; i< _size; i++ ){

		if ( id == _sensorNodes[i]._id ) // if we match, we use it as 
		{

			// binary match
			// int size = CountLines(CountLines); =36
			// int times = log(size); = 5
			
		return 	_sensorNodes[i].binary_match(raw);

		}
	}

	return raw; // we dont match, remain the same

}

 