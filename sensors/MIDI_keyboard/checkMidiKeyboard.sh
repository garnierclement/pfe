MIDI_PD="/home/pi/Desktop/pdemo/MIDI.pd"
LOG="/home/pi/log"
MIDI_KEY="Midiman"

while [ 1 ]
do 

	RES=`lsusb | grep $MIDI_KEY>/dev/null && echo yes`
	PROC=`ps -e | grep pd-ex>/dev/null && echo true`
	
	if [ $RES ]
	then
		echo "Midi Keyboard is well!!"
		
		if [ -z $PROC ]
		then
			sleep 8
			pd-extended -nogui  -oss -midiindev 1 -open $MIDI_PD  &>$LOG&
		fi
	else
		echo "Kill everything!"
		if [ $PROC ]
		then
			ps -e | grep pd-ex | awk '{print $1}' | xargs sudo kill
		fi
	fi
	
	sleep 3
done
