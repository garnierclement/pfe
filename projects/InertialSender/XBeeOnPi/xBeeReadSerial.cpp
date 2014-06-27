#ifndef M_PI
#define M_PI 3.14159265
#endif

#include "arduPi.h"


#include "SensorNode.h"
#include "fun.h"



#include <cmath>
#include <cstdio>
#include <cstdlib>

//////////////////////////////////////////////////
// add for OSC sent
/////////////////////////////////////////////////

#include "osc/OscOutboundPacketStream.h"
#include "ip/UdpSocket.h"

// Parameters for OSC packets desternation
#define ADDRESS "192.168.0.2"
#define PORT 7101


/*#define ADDRESS "127.0.0.1"
#define PORT 7000*/

#define OUTPUT_BUFFER_SIZE 1024

	
// OSC initialization
UdpTransmitSocket * transmitSocket = NULL;

char buffer[OUTPUT_BUFFER_SIZE];
osc::OutboundPacketStream  sendStream( buffer, OUTPUT_BUFFER_SIZE );

///////////////////////////////////////////////////


/*-----------------------------------------------------*/
//		Config for calibration
/*-----------------------------------------------------*/
SensorConfig* config = NULL;



// this is for Gyroscope mega board, Node C
/*
    byte myMac[] = { 
      0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
    byte myIp[]  = { 
      192, 168, 0, 111 };
*/
/*
#include <Z_OSC.h>

#include <SPI.h>
#include <Ethernet.h> 
*/


byte myMac[] = { 
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte myIp[]  = { 
  192, 168, 0, 111 };
byte destIp[] =  { 
  192, 168, 0, 101 };


int destPort = 7101;


boolean dataToSend=false;
char oscAdr[] = "/node/X/yprAxAyAz";
char oscAdr1[] = "/node/X/dcmMat";
char oscAdr2[] = "/node/X/side";
boolean printLoop=false;
boolean printStat=false;
long int good=0;
long int bad=0;

union yawU {
  byte b[4];
  float fval;
} 
yawRx;

union pitchU {
  byte b[4];
  float fval;
} 
pitchRx;

union rollU {
  byte b[4];
  float fval;
} 
rollRx;

union accelXU {
  byte b[2];
  int16_t ival; // signed int 16 bits
  //uint16_t  ival; // unsigned int 16 bits  
} 
accelX;

union accelYU {
  byte b[2];
  int16_t ival;// signed int 16 bits
  //uint16_t  ival; // unsigned int 16 bits
} 
accelY;

union accelZU {
  byte b[2];
  int16_t ival;// signed int 16 bits
  //uint16_t  ival; // unsigned int 16 bits
} 
accelZ;

union dcmMU{
  byte b[36];
  float val[3][3];
} 
dcmMat; 

union QuatU{
  byte b[16];
  float val[4]; 
} 
quat;


void sendProcess();
 void receiveProcess(); 
void computeYPR();
void computeDCM();

float toDegree(float rad){
	return rad*180/M_PI;
}


float toRad(float degree){
	return degree*M_PI/180;
}

//////////////////////////////////////////////////////
//  add by Yangfan, receive commands from MacBook
//  date: 2013/5/20
/////////////////////////////////////////////////////





//float yawRx, pitchRx, rollRx;  //double ?
//int accelX, accelY, accelZ;
//float dcmMat [3][3];

void setup()
{
  Serial.begin(57600);



}

void syncroData(){
  printf("Syncing");
  boolean stop=false;
  while(!stop){
    if(Serial.available()>0){
      if(Serial.read()=='*'){
        stop=true;
      }
    }
  }

}

long timer=0;
long timerProc=0;

void loop()
{
  timerProc=millis();
  receiveProcess(); 
  
  if(dataToSend){
	 ////printf("We have enough buff, ready to send!");
    sendProcess();
	/*
    if(printLoop){
      printf("Loop Time:");
      printf(millis()-timer);
      printf(" Processing Time:");
      printfln(millis()-timerProc);
    }*/
    timer=millis();
  }
  
}





void receiveProcess()
{
	//printf("In receiveProcess()");
//	printf("Serial.available() = %d\n",Serial.available());

  if(Serial.available() < 24)
  {

    dataToSend=false;
  }
  else{

    //read the full buffer 
    byte dataBuff[24];

    //printf("Reading data received:"); 
    for(int i=0;i<24;i++){
      dataBuff[i]=Serial.read();
      //printf(dataBuff[i],DEC);
      //printf(":");
    }
    //printfln();

	// We get the node ID from the message, i.e. 'A'/'B'/'C'
    oscAdr[6]=dataBuff[0];
    oscAdr1[6]=dataBuff[0];
    oscAdr2[6]=dataBuff[0];


    //retrieve the data from the buffer
    for(int i=0;i<2;i++){ 
      accelX.b[i]=dataBuff[1+i];
      accelY.b[i]=dataBuff[3+i];
      accelZ.b[i]=dataBuff[5+i];
    }
    for(int i=0;i<16;i++){ 
      quat.b[i]=dataBuff[7+i];
    }
    if((dataBuff[23]!='*')){
      syncroData();
      dataToSend=false;
      bad++;
    }
    else{
      dataToSend=true;
      good++;
    }

	//printf("databuff is - %s\n",dataBuff);
    /*if(printStat){
      printf("Stat: bad=");
      printf(bad);
      printf(" good=");
      printfln(good);      
    }*/
  }
  
  
}

void computeYPR(){
  yawRx.fval=atan2(dcmMat.val[1][0],dcmMat.val[0][0]);
  pitchRx.fval= -asin(dcmMat.val[2][0]);
  rollRx.fval=atan2(dcmMat.val[2][1],dcmMat.val[2][2]);  
}

void computeDCM(){
  dcmMat.val[0][0]=1-2*pow(quat.val[1],2)-2*pow(quat.val[2],2);
  dcmMat.val[1][1]=1-2*pow(quat.val[0],2)-2*pow(quat.val[2],2);
  dcmMat.val[2][2]=1-2*pow(quat.val[0],2)-2*pow(quat.val[1],2);
  
  dcmMat.val[0][1]=2*(quat.val[0]*quat.val[1]-quat.val[2]*quat.val[3]);
  dcmMat.val[0][2]=2*(quat.val[0]*quat.val[2]+quat.val[1]*quat.val[3]);
  
  dcmMat.val[1][0]=2*(quat.val[0]*quat.val[1]+quat.val[2]*quat.val[3]);
  dcmMat.val[1][2]=2*(quat.val[1]*quat.val[2]-quat.val[0]*quat.val[3]);
  
  dcmMat.val[2][0]=2*(quat.val[0]*quat.val[2]-quat.val[1]*quat.val[3]);
  dcmMat.val[2][1]=2*(quat.val[0]*quat.val[3]+quat.val[1]*quat.val[2]);

}

void sendProcess()
{
  long int accX;
  long int accY;
  long int accZ;
  accX=accelX.ival;
  accY=accelY.ival;
  accZ=accelZ.ival;
  computeDCM();
  computeYPR();

  //sendMes.setAddress(destIp,destPort);
  //sendMes.setZ_OSCMessage(oscAdr,"fffiii",yawRx.b,pitchRx.b,rollRx.b,&accX,&accY,&accZ);

   float yaw = config->calibrate(oscAdr[6],  toDegree(yawRx.fval));

   yawRx.fval = toRad(yaw);

  printf("#YPR ");
  printf("%f\t%f\t%f |", yaw ,toDegree(pitchRx.fval),toDegree(rollRx.fval)); 

int side = cube_side(oscAdr[6], yaw ,toDegree(pitchRx.fval),toDegree(rollRx.fval));

cout<< "side is:\t"<< side  << '\n';

 // printf("%f\t%f\t%f |",  toDegree(yawRx.fval),toDegree(pitchRx.fval),toDegree(rollRx.fval)); 

//    printf("XYZ %d\t%d\t%d\t\n",accX,accY,accZ);

////////////////////////////////////////////////////////
// OSC send

/*
	sendStream << osc::BeginBundleImmediate
	<< osc::BeginMessage( oscAdr ) 
		<< yawRx.fval << pitchRx.fval <<  rollRx.fval << accX << accY <<  accZ  << osc::EndMessage
	<< osc::EndBundle;

	transmitSocket->Send( sendStream.Data(), sendStream.Size() );
	sendStream.Clear();


	sendStream << osc::BeginBundleImmediate
	<< osc::BeginMessage( oscAdr1 ) 
		<<  dcmMat.val[0][0] <<  dcmMat.val[0][1]<<  dcmMat.val[0][2]<<  dcmMat.val[1][0]<<  dcmMat.val[1][1]<<  dcmMat.val[1][2]<<  dcmMat.val[2][0]<<     dcmMat.val[2][1]<<  dcmMat.val[2][2]<< osc::EndMessage
	<< osc::EndBundle;
*/

	sendStream << osc::BeginBundleImmediate
	<< osc::BeginMessage( oscAdr2 ) 
		<< side << osc::EndMessage
	<< osc::EndBundle;


	transmitSocket->Send( sendStream.Data(), sendStream.Size() );
	sendStream.Clear();
/**/
////////////////////////////////////////////////////////

  
  /*
  client.send(&sendMes);
  sendMes.flush();
  sendMes.setAddress(destIp,destPort);
  sendMes.setZ_OSCMessage(oscAdr1,"fffffffff",dcmMat.b,dcmMat.b+4,dcmMat.b+8,dcmMat.b+12,dcmMat.b+16,dcmMat.b+20,dcmMat.b+24,dcmMat.b+28,dcmMat.b+32);
  client.send(&sendMes);
  sendMes.flush();*/
}

/*-----------------------------------------
¸ñÊ½£º

xBeeReadSerial IPaddress portNum


-----------------------------------------*/

int main (int argc, char* argv[]){

	if( argc >= 2){	
		printf("You type Address is %s, port is %d", argv[1] ,atoi(argv[2]));

		
		transmitSocket = new UdpTransmitSocket( IpEndpointName( argv[1], atoi(argv[2]) ) );

	}else{

		transmitSocket = new UdpTransmitSocket( IpEndpointName( ADDRESS, PORT ) );
	}

	config = new SensorConfig("_config.txt"); // read gyro calibration data

	

	setup();
	while(1){
		loop();
	}

	delete transmitSocket;
	transmitSocket = NULL;

	delete config;
	config = NULL;

	return (0);
}
