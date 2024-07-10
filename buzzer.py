from gpiozero import Buzzer
from time import sleep

bz = Buzzer(4)
if not bz.is_active:
	bz.on()
	sleep(1)
	bz.off()
