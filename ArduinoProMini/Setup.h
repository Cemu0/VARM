#ifndef SETUP_H
#define SETUP_H

const byte CS = A2; // curentsensor
const byte spoint=A3; //cam bien tiem can :v
const byte encodPinA1=2;  // encoder A pin
const byte encodPinB1=4; // encoder B pin


volatile double encoderPos = 0;
//double kp = 7, ki = 0, kd = 1, input = 0, output = 0, setpoint = 0,Speed = 100;
double kp = 4, ki = 0, kd = 0.5, input = 0, output = 0, setpoint = 0,Speed = 100;
PID myPID(&input, &output, &setpoint, kp, ki, kd, DIRECT);

#if BTS7960 == TRUE
  const byte M1        =9;                       
  const byte M2        =10;                      
  const byte L_EN      =7;
  const byte R_EN      =8;
#define SETUP pinMode(M1,OUTPUT);\
              pinMode(M2,OUTPUT);\
              pinMode(L_EN,OUTPUT);\
              pinMode(R_EN,OUTPUT);\
              enable(true);\
              TCCR1A = _BV(COM1A1) | _BV(COM1B1);\
              TCCR1B = _BV(WGM13) | _BV(CS10);\
              ICR1 = 400 ;\
              OCR1A = 0;\
              OCR1B = 328;
  void pwmOut(int out) { 
  if (out > 0) {
    analogWrite(M1, out);
    analogWrite(M2, 0);
    }
  else {
    analogWrite(M1, 0);
    analogWrite(M2, abs(out));
    }
  }
  void enable(bool stage){
     digitalWrite(R_EN,stage);
     digitalWrite(L_EN,stage);
  }
#elif BTS7960 == FALSE
  const byte PWM=9;                       
  const byte spoint=A2;
  const byte enPin = 11;
  const byte PA1 = 7;
  const byte PA2 = 8;
#define SETUP pinMode(CS, INPUT);\
              pinMode(PWM,OUTPUT);\
              pinMode(enPin,OUTPUT);\
              pinMode(PA1,OUTPUT);\
              pinMode(PA2,OUTPUT);\
              enable(true);
  void pwmOut(int out) {                                
    if (out > 0) {
      analogWrite(PWM, out);                           
    digitalWrite(PA1,HIGH);
    digitalWrite(PA2,LOW);
    } 
    else if(out == 0){
    analogWrite(PWM,0);
    digitalWrite(PA1,LOW);
    digitalWrite(PA2,LOW);
    }
    else {
    analogWrite(PWM, abs(out));
    digitalWrite(PA1,LOW);
    digitalWrite(PA2,HIGH);
    }
  }
    void enable(bool stage){
     digitalWrite(enPin,stage);
  }
#endif
void encoder(){
  if(digitalRead(encodPinB1)==digitalRead(encodPinA1))encoderPos--; //!!!!!!!!!!!!!
  else encoderPos++;
}
void Stop(){
  enable(false);
  setpoint = encoderPos;
}
#endif
