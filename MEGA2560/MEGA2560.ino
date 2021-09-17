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

const long speed = 9600;
const byte timeout = 200;
bool stoped,stage,rs1,rs2,rs3 = false;
int stopButton = A0;
unsigned long time = 0;
String data1,data2,data3;//data
void sendto(char a,String data) {
  switch (a) {
    case '1': Serial1.print(data);data1 = data; break;
    case '2': Serial2.print(data);data2 = data;break;
    case '3': Serial3.print(data);data3 = data;break;
  }
}
String readfrom(char a) {
  switch (a) {
    case '1': return(Serial1.readStringUntil('#')); 
    break;
    case '2': return(Serial2.readStringUntil('#'));
    break;
    case '3': return(Serial3.readStringUntil('#')); 
//    String re = "";
//    while(Serial3.available()){
//      char data = (char)Serial3.read();
//      if(data=='#')return(re);
//      re += String(data);
//    }
    break;
  }
}
void setup() {
  // put your setup code here, to run once:
pinMode(LED_BUILTIN, OUTPUT);
pinMode(stopButton,INPUT_PULLUP);
Serial.begin(115200); Serial.setTimeout(timeout * 2);
Serial1.begin(speed); Serial1.setTimeout(timeout);
Serial2.begin(speed); Serial2.setTimeout(timeout);
Serial3.begin(speed); Serial3.setTimeout(timeout);
}

void loop() {
  if(millis() - time > 500){
    digitalWrite(LED_BUILTIN,stage);
    stage = !stage; 
    time = millis();
  }
  if(digitalRead(stopButton)==LOW){
    digitalWrite(LED_BUILTIN,HIGH);
    if(!stoped){
    for(char i='1';i<='3';i++)sendto(i,"BS#");
    Serial.print("AASTOP");
    }
    stoped = true;
  }else{
    if(stoped == true){digitalWrite(LED_BUILTIN,LOW);
    for(char i='1';i<='3';i++)sendto(i,"BE#");
    stoped = false;}
  }
}
void serialEvent(){ //input A0BG123#. or A1BG1#A1BG2#A3BG4#.
    digitalWrite(LED_BUILTIN,HIGH);
    String Indata0 = Serial.readStringUntil('.');
//    data = "";
    int BeginChar = Indata0.indexOf("A");
    if(Indata0.indexOf("M") != -1){ //sensor on A? ... A3 iknow that v; A3BM#
        int EndChar = Indata0.indexOf("#");
        char AW = Indata0[BeginChar+1];
        String o = Indata0.substring(BeginChar+2,EndChar+1);
        sendto(AW,o);
        delay(10);
        String s = (readfrom(AW).indexOf("Y") != -1)?"YES":"NO";
//        s = "FuckYou!"; // why this work ???
        delay(50);
//        for(int i=0;i<=3;i++){
        Serial.println(s);
//        }
        return; //one pertime ...
      };
    while(BeginChar != -1){
      int EndChar = Indata0.indexOf("#");
      char To = Indata0[BeginChar+1];
      if(To < '1' && To > '3')break;
      String Comand0 = Indata0.substring(BeginChar+2,EndChar+1);
      sendto(To,Comand0);
//      data += Comand0;
      Indata0 = Indata0.substring(EndChar+1,Indata0.length());
      BeginChar = Indata0.indexOf("A");
    }
    digitalWrite(LED_BUILTIN,HIGH);
}
/*
void serialEvent1(){
    checkwork(Serial1.readStringUntil('#'),'1');
}
void serialEvent2(){
    checkwork(Serial2.readStringUntil('#'),'2');
}
void serialEvent3(){
    checkwork(Serial3.readStringUntil('#'),'3');
}

void checkwork(String Indata, char n){
    int BeginChar = Indata.indexOf("B");
    String Comand = Indata.substring(BeginChar,Indata.length()) + "#";
    if(Comand[1] = "M"){
      Serial.print("A");
      Serial.print(n);
      Serial.print(Comand);
     return; 
    }
    int check = data.indexOf(Comand);
    if(check != -1){
      data = data.substring(1,check+1)+data.substring(check+Comand.length(),data.length());
    }
    if(data=="")Serial.print("ok");
}
*/
