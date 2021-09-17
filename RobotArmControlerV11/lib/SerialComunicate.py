# MIT License

# Copyright (c) 2019 Nguyen Do Quoc Anh (Cemu0)

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import serial
import _thread
import time

ser1 = serial.Serial(        
	port='/dev/ttyACM0',
	baudrate = 115200,
	# parity=serial.PARITY_NONE,
	# stopbits=serial.STOPBITS_ONE,
	# bytesize=serial.EIGHTBITS,
	# xonxoff = False,
	timeout=1
	)

ser2 = serial.Serial(        
	port='/dev/ttyACM1',
	baudrate = 115200,
	# parity=serial.PARITY_NONE,
	# stopbits=serial.STOPBITS_ONE,
	# bytesize=serial.EIGHTBITS,
	# xonxoff = False,
	timeout=1
	)

def Readone(ser,inp):
	try:
		# ser.readline()#'A3BM#.'
		ser.write(inp.encode())
		data = ser.readline()
		string = data.decode()
		# print(string)
		return(string.find("Y")!=-1)
	except:
		pass

def ReadSerial(ser,name):
	# seq = []
	# count = 1
	
	while True:
		# data = b''
		try:
			data = ser.readline()
			if(data!=b'\r\n' and data != b'\n\r' and data != b''):
				data = data.decode('utf-8')[:-2]
				# ser1.flush()		
				if data != "": 
					print("serial:",data)
			
		except:
			pass
			# print(name,"somelittleBug:",data)
			# if data == b"":print("FUck YOU BI")

		# for c in ser.read():
		# 	seq.append(chr(c)) #convert from ANSII
		# 	joined_seq = ''.join(str(v) for v in seq) #Make a string from array

		# 	if chr(c) == '\n':
		# 		print("Line " + str(count) + ': ' + joined_seq)
		# 		seq = []
		# 		count += 1
		# 		break
		#data = ser.readline()
		# print(data)
		#if(data!=b''):print(data)#data.decode("utf-8"))

def WriteSerial(ser,data1,data2=None):
	ser.write(data1.encode())
	ser.flush()
    # ser2.write(data2.encode())

def ComunicateHost():
	try:
		_thread.start_new_thread(ReadSerial,(ser1,"S1:",))
	except:
		print("Error: unable to start thread read Serial")
	try:
		_thread.start_new_thread(ReadSerial,(ser2,"S2:",))
	except:
		print("Error: unable to start thread read Serial")