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

const byte PWM=9;                       
const byte spoint=A3;
const byte CS = A2;
const byte enPin = 11;
int PA1 = 7;
int PA2 = 8;
const byte led_builtin =  LED_BUILTIN;
String lastComand;
volatile long encoderPos = 0;
bool stage,onoff = 1;
unsigned long time = 0;

void enable(bool stage){
     digitalWrite(enPin,stage);
}
void Stop(){
  enable(false);
}
void pwmOut(int out) {                                // to H-Bridge board
  if (out > 0) {
    analogWrite(PWM, out);                             // drive motor CW
  digitalWrite(PA1,HIGH);
  digitalWrite(PA2,LOW);
  } 
  else if(out == 0){
  analogWrite(PWM,0);
  digitalWrite(PA1,LOW);
  digitalWrite(PA2,LOW);
  }
  else {
  analogWrite(PWM, abs(out));                        // drive motor CCW
  digitalWrite(PA1,LOW);
  digitalWrite(PA2,HIGH);
  }
}

void setup() {
  pinMode(CS, INPUT);
  pinMode(PWM,OUTPUT);
  pinMode(enPin,OUTPUT);
  pinMode(PA1,OUTPUT);
  pinMode(PA2,OUTPUT);
  pinMode(led_builtin,OUTPUT);
  digitalWrite(enPin,HIGH);
  pwmOut(0);
//  attachInterrupt(0, encoder, FALLING);               // update encoder position
  Serial.begin(9600);                              // for working
  Serial.setTimeout(100);
}
 
void loop() {
//  if(millis() - time > 500){
//    digitalWrite(LED_BUILTIN,stage);
//    stage = !stage; 
//    time = millis();
//  } 
}
void serialEvent(){
  digitalWrite(LED_BUILTIN,HIGH);
    String Indata = Serial.readStringUntil('#');
    int BeginChar = Indata.indexOf("B");
    char work = Indata[BeginChar+1];
    if(BeginChar == -1)return;
    String Comand = Indata.substring(BeginChar+2,Indata.length());
    if(work=='!')Stop();//B!#
    if(work=='S')Stop();//B!#
    if(work=='R')pwmOut(0);
    if(work=='E'){enable(true);Serial.print("BE");};
    if(work=='M'){Serial.print(digitalRead(CS)?"NO":"YES");delay(10);}
    if(work=='G'){
//      if(lastComand != Comand){
        int value = Comand.toInt();
        pwmOut(value);
//        (value>0)?pwmOut(value+100):pwmOut(value-100);
        delay(200);
        lastComand = Comand;
        pwmOut(0);
//      }
    }
  //  if(Comand==1 & onoff == 0){
  //    pwmOut(255);
  //    delay(500);
  //    onoff = 1;
  //  }
  //  if(Comand==0 & onoff == 1){
  //    pwmOut(-255);
  //    delay(150);
  //    onoff = 0;
  //  }
  //  if(Comand<0){
  //    pwmOut(-255);
  //    delay(150);
  //  }
  //  if(Comand<0){
  //    pwmOut(255);
  //    delay(500);
  //  }
    digitalWrite(led_builtin,LOW);
}


