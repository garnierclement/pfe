#include "fun.h"

static  DataRow NodeData[100];

int sizeOfNodeData = 0;
float testData[100] = {0.0};

////

int CountLines(char *filename)//��ȡ�ļ�������
{
ifstream ReadFile;
int n=0;
string temp;
ReadFile.open(filename,ios::in);//ios::in ��ʾ��ֻ���ķ�ʽ��ȡ�ļ�
if(ReadFile.fail())//�ļ���ʧ��:����0
{
   return 0;
}
else//�ļ�����,�����ļ�����
{
   while(getline(ReadFile,temp))
   {
    n++;
   }
   return n;
}
ReadFile.close();
}


void read_calibration(){

	ifstream myfile("config_sensors.txt");

}

void read_calibration(const char* filename){
 
  ifstream myfile(filename);
  if (myfile.is_open())
  {
	  int i = 0;
	while(!myfile.eof()) //��ȡ���ݵ�����
	{ 

	myfile>> NodeData[i].out; 
	myfile>> NodeData[i].raw; 

	i++; 
	} 
	myfile.close(); //�ر��ļ�
  }

  else cout << "Unable to open myfile"; 

}

// search for the correct calibrate value
float binary_search(float raw){
	// int size = CountLines(CountLines); =36
	// int times = log(size); = 5
	int i = 0 ;
	for (int k=0; k<5 ; k++ )
	{
		if ( NodeData[i].raw >= raw  ) // raw ��ǰһ��
		{
			if( i-1 >= 0 && NodeData[i-1].raw < raw  )// i-1�Ѿ�С�� raw,���˳�
				break;
			else/**/
				i = i - 36 / pow(2, k+1);
		}else{
			
			if( i+1 < 36 && NodeData[i+1].raw > raw  ) // i+1�Ѿ����� raw,���˳�
				break;
			else/**/
			i = i + 36 / pow(2, k+1);
		} 
	//cout << "i: " << i << "\tk: " << k << "\t NodeData[i]: " << NodeData[i].raw << "\t Real: " << raw <<  endl;

	}


	return NodeData[i].out + (raw - NodeData[i].raw)*10/( NodeData[i+1].raw - NodeData[i].raw);

	//cout  << "cal: " << cal << "\t i: " << i << "\t NodeData[i]: " << NodeData[i].raw << "\t Real: " << raw <<  endl;


}

void readTest(const char* filename){

	  ifstream myfile(filename);
	  if (myfile.is_open())
	  {
		  int i = 0;
		while(!myfile.eof()) //��ȡ���ݵ�����
		{ 

		myfile>> testData[i]; 
		cout << testData[i] << endl;

		i++; 
		} 
		myfile.close(); //�ر��ļ�
	  }

	  else cout << "Unable to open myfile"; 

}
/*
int main () {

	read_calibration("node_a.txt");
	cout << "read testdata_2:" <<endl;
	readTest("testData_2.txt");

	cout << "Read Complete! \n" <<endl;

	
	cout << "begin calib" <<endl;

	int i = 0;
	while(testData[i]!=0.0 && i<100){
		cout << i <<"\t"<< testData[i] <<endl;
		binary_search(testData[i]);
		i++;
		cout <<endl;


	}





  return 0;
}	*/


	/*int i = 0;
	while(NodeData[i].raw !=0 && i<100){
		cout << NodeData[i].out <<"\t" <<NodeData[i].raw<< endl;
		i++;
	}*/