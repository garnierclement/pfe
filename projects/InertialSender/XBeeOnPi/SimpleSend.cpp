/* 
    Simple example of sending an OSC message using oscpack.
*/
#include <cstdio>
#include <iostream>
using namespace std;
#include "osc/OscOutboundPacketStream.h"
#include "ip/UdpSocket.h"


#define ADDRESS "127.0.0.1"
#define PORT 7000

#define OUTPUT_BUFFER_SIZE 1024


/*int main(int argc, char* argv[])
{
    /*(void) argc;  suppress unused parameter warnings*/
	/*char ip[50];
	int port,j;
	int i=0;

while (true)
{       printf("ip:port=?\n");
        scanf("%c:%d", &ip[i], &port);
	   i+=1;

}
    if ( std::strcmp( argv[0], "To" ) == 0 )
    {

    UdpTransmitSocket transmitSocket( IpEndpointName( ADDRESS, PORT ) );
    
    char buffer[OUTPUT_BUFFER_SIZE];
    osc::OutboundPacketStream p( buffer, OUTPUT_BUFFER_SIZE );

    p << osc::BeginBundleImmediate
        << osc::BeginMessage( "/pi/config/new_ip_port") 
             << true << 23 << (float)3.1415 << "hello" << osc::EndMessage
        << osc::EndBundle;

	  for (j=0;j<=i;j++)
     {    p << osc::BeginBundleImmediate
          << osc::BeginMessage( "%c:%d",&ip[j],&port) 
                 << osc::EndMessage
		<< osc::EndBundle;
	   }
    
    transmitSocket.Send( p.Data(), p.Size() );
	    std::cout << "success";
	return(0);}
	else {return(0);}
	(void) port,i,j,ip[],port;
}*/



int main(int argc, char* argv[])
{
    (void) argc; // suppress unused parameter warnings
    (void) argv; // suppress unused parameter warnings

    UdpTransmitSocket transmitSocket( IpEndpointName( ADDRESS, PORT ) );
    
    char buffer[OUTPUT_BUFFER_SIZE];
    osc::OutboundPacketStream p( buffer, OUTPUT_BUFFER_SIZE );

		char ip[50] = {0};
		int port,i;
		int index = 0;
		float var = 11.11;
		/*cout << "please input ip[50]:";*/

		
	while(true){
	   printf("input adress ip:port\n");
       scanf("%s %d",ip,&port);
if (ip[0]!='q')
{
    p << osc::BeginBundleImmediate
        << osc::BeginMessage( "/pi/config/new_ip_port" ) 
             << ip  << port  << osc::EndMessage
        << osc::EndBundle;

	/*var += 0.01;*/
    		   cout << "success \n" << ip ;
    transmitSocket.Send( p.Data(), p.Size() );
		p.Clear();
} 
else{return(0);}


	}
}