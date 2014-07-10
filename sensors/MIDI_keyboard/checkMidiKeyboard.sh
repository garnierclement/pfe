#MIDI_PD="/home/pi/Desktop/pdemo/MIDI.pd"
#LOG="/home/pi/log"
MIDI_KEY="Midiman"
echo "+[SCPT]\tChecking for MIDI-Keyboard..."
	RES=`lsusb | grep $MIDI_KEY>/dev/null && echo yes`
	
	if [ $RES ]
	then
		echo "+[SCPT]\tMIDI-Keyboard detected!\c"
		exit 0
	else
		exit 1
	fi
	
