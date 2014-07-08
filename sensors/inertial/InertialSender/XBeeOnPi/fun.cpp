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


// global function for determining cube's side 
// return : 1,2,3,4,5,6
int cube_side(char id, float y, float p, float r){



	if (id == 'A')
	{

		return cube_side_a(y ,p, r);


	}else if (id == 'B')
	{
		
		return cube_side_b(y ,p, r);

	}

	return 1; 
}



int cube_side_a(float y, float p, float r){

	static int res = 1;

		if ( ( p>=-12 && p<=8 ) && ( r>=-12 && r<=8 ) )
		{
			res = 1;
			return 1;
		}


		if ( ( p>=-85 && p<=-65 ) && ( (r>=170 && r<=180) || (r>=-180 && r<=-170) ) )
		{
			res = 2;
			return 2;
		}


		if ( ( p>=-5 && p<=15 ) && ( (r>=170 && r<=180) || (r>=-180 && r<=-170)) )
		{
			res = 3;
			return 3;
		}


		if ( ( p>=75 && p<=95 ) && ( (r>=170 && r<=180) || (r>=-180 && r<=-170)) )
		{
			res = 4;
			return 4;
		}


		if ( ( p>=-20 && p<=20 ) && ( r>=80&& r<=100 ) )
		{
			res = 5;
			return 5;
		}


		if ( ( p>=-20 && p<=20 ) && ( r>=-100 && r<=-80 ) )
		{
			res = 6;
			return 6;
		}

	return res;  

	
	}
int cube_side_b( float y, float p, float r){

	static int res = 1;

		if ( ( p>=-8 && p<=12 ) && ( r>=-12 && r<=8 ) )
		{
			res = 1;
			return 1;
		}


		if ( ( p>=77 && p<=97 ) &&  (r>=-10 && r<=10)   )
		{
			res = 2;
			return 2;
		}


		if ( ( p>=-10 && p<=10 ) && ( (r>=170 && r<=180) || (r>=-180 && r<=-170)) )
		{
			res = 3;
			return 3;
		}


		if ( ( p>=-88 && p<=-65 ) &&  ( (r>=170 && r<=180) || (r>=-180 && r<=-170)) )
		{
			res = 4;
			return 4;
		}


		if ( ( p>=-10 && p<=10 ) && ( r>=80&& r<=100 ) )
		{
			res = 5;
			return 5;
		}


		if (  ( p>=-10 && p<=10 )  && ( r>=-105 && r<=-85 ) )
		{
			res = 6;
			return 6;
		}

		return res;
	
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