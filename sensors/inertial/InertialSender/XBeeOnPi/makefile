xbeeObjs = xBeeReadSerial.o fun.o SensorNode.o arduPi.o  \
		 OscOutboundPacketStream.o OscTypes.o \
		IpEndpointName.o UdpSocket.o NetworkingUtils.o 

xBeeReadSerial : $(xbeeObjs)
	g++ -lrt -lpthread $(xbeeObjs) -o xBeeReadSerial 


xBeeReadSerial.o : xBeeReadSerial.cpp arduPi.h fun.h SensorNode.h \
		osc/OscOutboundPacketStream.h ip/UdpSocket.h 
	g++ -c xBeeReadSerial.cpp


SensorNode.o : SensorNode.cpp SensorNode.h
	g++ -c SensorNode.cpp

fun.o : fun.cpp fun.h
	g++ -c fun.cpp



arduPi.o : arduPi.cpp arduPi.h
	g++ -c arduPi.cpp


OscOutboundPacketStream.o : osc/OscOutboundPacketStream.cpp osc/OscOutboundPacketStream.h osc/OscHostEndianness.h
	g++ -c osc/OscOutboundPacketStream.cpp

OscTypes.o : osc/OscTypes.cpp osc/OscTypes.h
	g++ -c osc/OscTypes.cpp

IpEndpointName.o : ip/IpEndpointName.cpp ip/IpEndpointName.h ip/NetworkingUtils.h
	g++ -c ip/IpEndpointName.cpp

UdpSocket.o : ip/posix/UdpSocket.cpp ip/UdpSocket.h ip/PacketListener.h ip/TimerListener.h
	g++ -c ip/posix/UdpSocket.cpp

NetworkingUtils.o : ip/posix/NetworkingUtils.cpp ip/NetworkingUtils.h 
	g++ -c ip/posix/NetworkingUtils.cpp

.PHONY : clean 
clean : 
	rm -f xBeeReadSerial *.o
