from serial import Serial
import time 
ser = Serial('/dev/ttyACM0',115200,timeout=1,xonxoff = False)
# ser.write(b"A3BM#.")

# ser.close()
# ser.open()
# time.sleep(0.05) 
while True:
        ser.readline()
        ser.write('A3BM#.'.encode())
        data = ser.readline()
        string = data.decode()
        print(string.find("YES"))
        # time.sleep(1)
    