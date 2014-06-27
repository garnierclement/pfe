#include "arduPi.h"
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
  int ival;
} 
accelX;

union accelYU {
  byte b[2];
  int ival;
} 
accelY;

union accelZU {
  byte b[2];
  int ival;
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


 void receiveProcess(); 
void computeYPR();
void computeDCM();

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
  Serial.print("Syncing");
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
    sendProcess();
    if(printLoop){
      Serial.print("Loop Time:");
      Serial.print(millis()-timer);
      Serial.print(" Processing Time:");
      Serial.println(millis()-timerProc);
    }
    timer=millis();
  }
  
}





void receiveProcess()
{

  if(Serial.available() < 24)
  {
    dataToSend=false;
  }
  else{

    //read the full buffer 
    byte dataBuff[24];

    //Serial.print("Reading data received:"); 
    for(int i=0;i<24;i++){
      dataBuff[i]=Serial.read();
      //Serial.print(dataBuff[i],DEC);
      //Serial.print(":");
    }
    //Serial.println();
    oscAdr[6]=dataBuff[0];
    oscAdr1[6]=dataBuff[0];
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
    if(printStat){
      Serial.print("Stat: bad=");
      Serial.print(bad);
      Serial.print(" good=");
      Serial.println(good);      
    }
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
  
   
  Serial.print("#YPR ");
  Serial.print(yawRx.b,DEC); 
  Serial.print("\t"); 
  Serial.print(pitchRx.b,DEC);
    Serial.print("\t");
    Serial.print(rollRx.b,DEC);
    Serial.print("XYZ");
  Serial.print(accX,DEC); 
  Serial.print("\t"); 
  Serial.print(accY,DEC);
    Serial.print("\t");
    Serial.print(accZ,DEC);
    Serial.print("\n");
  
  /*
  client.send(&sendMes);
  sendMes.flush();
  sendMes.setAddress(destIp,destPort);
  sendMes.setZ_OSCMessage(oscAdr1,"fffffffff",dcmMat.b,dcmMat.b+4,dcmMat.b+8,dcmMat.b+12,dcmMat.b+16,dcmMat.b+20,dcmMat.b+24,dcmMat.b+28,dcmMat.b+32);
  client.send(&sendMes);
  sendMes.flush();*/
}





