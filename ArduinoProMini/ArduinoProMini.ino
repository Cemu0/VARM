// MIT License

// Copyright (c) 2019 Nguyen Do Quoc Anh (Cemu0)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

#include <PID_v1.h>
#include "setup.h"
#define BTS7960 TRUE //doi TRUE thanh FALSE nay neu la VNH2SP30
unsigned int SampleTime = 1;
void setup() {
SETUP;
pinMode(encodPinA1, INPUT_PULLUP);
pinMode(encodPinB1, INPUT_PULLUP);
pinMode(LED_BUILTIN,OUTPUT); 
//attachInterrupt(0, encoder, FALLING);
attachInterrupt(0, encoder, CHANGE);
myPID.SetMode(AUTOMATIC);
myPID.SetSampleTime(SampleTime);
//myPID.SetOutputLimits(-255, 255);
myPID.SetOutputLimits(-250, 250);    
Serial.begin(9600);
Serial.setTimeout(100);
Serial.print("ok");
}

void loop() {
input = encoderPos;
if(myPID.Compute())pwmOut(output);
}

void serialEvent(){
  digitalWrite(LED_BUILTIN,HIGH);
  String Indata = Serial.readStringUntil('#');
  int BeginChar = Indata.indexOf("B");
  char work = Indata[BeginChar+1];
  if(BeginChar == -1)return;
  String Comand = Indata.substring(BeginChar+2,Indata.length());
//  Serial.print(Comand);
  if(work=='!')Stop();//B!#
  if(work=='S')Stop();//B!#
  if(work=='G'){setpoint = Comand.toInt();};//BG-1630# Serial.print("BG"+String((unsigned int)setpoint)+"#");
  if(work=='R'){encoderPos = setpoint = Comand.toInt();}; //Serial.print("BR"+String((unsigned int)setpoint)+"#");
  if(work=='E'){enable(true);};//Serial.print("BE#");
  if(work=='P'){
  int IP = Comand.indexOf("I");
  int DP = Comand.indexOf("D");
  kp = Comand.substring(0,IP).toInt();
  ki = Comand.substring(IP+1,DP).toInt(); 
  kd = Comand.substring(DP+1,Indata.length()).toInt();
  PID mysubPID(&input, &output, &setpoint, kp, ki, kd, DIRECT);
  mysubPID.SetMode(AUTOMATIC);
  mysubPID.SetSampleTime(SampleTime);
  mysubPID.SetOutputLimits(-250, 250);
  myPID = mysubPID;//c++ power
  Serial.print("BP"+String((unsigned int)kp)+"I"+String((unsigned int)ki)+"D"+String((unsigned int)kd)+"#");
  };
  if(work=='Z'){int sp = Comand.toInt(); backZero(sp);Serial.println("BZ"+Comand+"#");};//BZ-100#
  digitalWrite(LED_BUILTIN,LOW);
}
void backZero(int Speed){
  pwmOut(Speed);
  bool checkpoint = digitalRead(spoint);
//  Serial.print("StartGoZero");
//  Serial.print(digitalRead(spoint));
  while(checkpoint == digitalRead(spoint)){
    if(Serial.available())break;
//    Serial.print(digitalRead(spoint));
  }
//  Serial.print(digitalRead(spoint));
  pwmOut(0);
  setpoint = encoderPos;
//  Serial.print(encoderPos);
}
