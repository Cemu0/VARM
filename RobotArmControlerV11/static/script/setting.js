// var controllib = function () {
    /*if(work=='!')Stop();//B!#
  if(work=='S')Stop();//B!#
  //if(work=='M')Serial.println("ferture not ready");
  if(work=='G'){setpoint = Comand.toInt();Serial.print("BG"+String((unsigned int)setpoint)+"#");};//BG-1630#
  if(work=='R'){encoderPos = setpoint = Comand.toInt();Serial.print("BG"+String((unsigned int)setpoint)+"#");};
    if(work=='E'){enable(true);Serial.print("BE#");};
  if(work=='P'){
  int IP = Comand.indexOf("I");
  int DP = Comand.indexOf("D");
  kp = Comand.substring(0,IP).toInt();
  ki = Comand.substring(IP+1,DP).toInt(); 
  kd = Comand.substring(DP+1,Indata.length()).toInt();
  Serial.print("BP"+String((unsigned int)kp)+"I"+String((unsigned int)ki)+"D"+String((unsigned int)kd)+"#");
  };
  if(work=='Z'){int sp = Comand.toInt(); backZero(sp);Serial.println("BZ"+Comand+"#");};//BZ-100#
  digitalWrite(LED_BUILTIN,LOW);*/

var AxisLastInputFrom = [0,0,0,0,0,0,0,0]
var AxisInputFrom = [0,0,0,0,0,0,0,0]
// function start(){
//     setInterval(SetStep,100); 
// }

setInterval(SetStep,100); 

for(var a = 1;a<=8;a++){
    AxisInputFrom[a-1] = document.getElementById("A"+a);
}

function SetStep(){
    var datasend_1 = "";
    var datasend_2 = "";
    for(var a = 1;a<=3;a++){
       var Idata = AxisInputFrom[a-1].value;
       if(Idata != AxisLastInputFrom[a-1]){
           datasend_1 += "A"+a+'BG'+Idata+'#';
           AxisLastInputFrom[a-1] = Idata;
       }
    }
    for(var b = 4;b<=6;b++){
       var Idata = AxisInputFrom[b-1].value;
       if(Idata != AxisLastInputFrom[b-1]){
           datasend_2 += "A"+(b-3)+'BG'+Idata+'#';
           AxisLastInputFrom[b-1] = Idata;
       }
   }

   if((AxisInputFrom[6].value != AxisLastInputFrom[6]) || (AxisInputFrom[7].value != AxisLastInputFrom[7])){
    AxisLastInputFrom[6]=AxisInputFrom[6].value;
    AxisLastInputFrom[7]=AxisInputFrom[7].value;
    var a =parseInt(AxisInputFrom[6].value);
    var b =-parseInt(AxisInputFrom[6].value);
    AxisInputFrom[3].value=a+parseInt(AxisInputFrom[7].value);
    AxisInputFrom[4].value=b+parseInt(AxisInputFrom[7].value);
    //  console.log(AxisInputFrom[6].value);
   }


   if(datasend_1!="")datasend_1 += ".";
   if(datasend_2!="")datasend_2 += ".";
   datasend = "DT1="+datasend_1 +"&DT2="+ datasend_2;
   if(datasend != "DT1=&DT2="){
       var xhttp = new XMLHttpRequest(); 
       xhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200){}
           else if (this.readyState == 4 && this.status == 404){}
       }
       xhttp.open('POST','/manual', true);
       xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
       xhttp.send(datasend);
   }
}

var  SetPointA1 = 400;
var  SetPointA2 = 324;
var  SetPointA3 = 89;

var  MoveSpeedA1 = -150;
var  MoveSpeedA2 = -160; 
var  MoveSpeedA3 = -140;
// }

function STOP(){//input A0BG123#. or A1BG1#A1BG2#A3BG4#.
    // var xhttp = new XMLHttpRequest(); 
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200){}
    //     else if (this.readyState == 4 && this.status == 404){}
    // }
    // xhttp.open('POST','/manual', true);
    // xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // xhttp.send("DT1=A1BS#A2BS#A3BS#.&DT2=A1BS#A2BS#A3BS#.");
    SendData("A1BS#A2BS#A3BS#","A1BS#A2BS#A3BS#");
}  
function RESUME(){//input A0BG123#. or A1BG1#A1BG2#A3BG4#.
    // var xhttp = new XMLHttpRequest(); 
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200){}
    //     else if (this.readyState == 4 && this.status == 404){}
    // }
    // xhttp.open('POST','/manual', true);
    // xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // xhttp.send("DT1=A1BE#A2BE#A3BE#.&DT2=A1BE#A2BE#A3BE#.");
    SendData("A1BE#A2BE#A3BE#","A1BE#A2BE#A3BE#");
}
function Go(a){
    data = a+"BZ"+document.getElementById("GD"+a).value+"#";
    SendData(data,"");
}
function AUTOSETZERO(){//input A0BG123#. or A1BG1#A1BG2#A3BG4#.
 ///pass 
    // setTimeout((document.getElementsByTagName("st").innerHTML = "moving to start position"),10);
    data = "A1BZ"+MoveSpeedA1+
            "#A2BZ"+MoveSpeedA2+
            "#A3BZ"+MoveSpeedA3+"#";
    SendData(data,"");
    // setTimeout(SetPosition(true,true,true),5000);
    // setTimeout((document.getElementsByTagName("st").innerHTML = "moving to zero position"),5000);
    setTimeout(SetZero,5000);
    setTimeout(GotoBeginPoint,5500);
    setTimeout(SetZero,9000);
    // setTimeout(document.getElementsByTagName("st").innerHTML = "",6000);
}
function GotoBeginPoint(){
    data = "A1BG"+SetPointA1+
            "#A2BG"+SetPointA2+
            "#A3BG"+SetPointA3+"#";
    SendData(data,"");
}
// function SetPosition(a,b,c){
//     SP1 = SetPointA1;
//     SP2 = SetPointA2;
//     SP3 = SetPointA3;
//     data = "A1BR"+SP1+
//             "#A2BR"+SP2+
//             "#A3BR"+SP3+"#";
//     SendData(data,"");
// }
function GoZero(){
    AxisInputFrom[0].value = 0;
    AxisInputFrom[1].value = 0;
    AxisInputFrom[2].value = 0;
    AxisInputFrom[3].value = 0;
    AxisInputFrom[4].value = 0;
    AxisInputFrom[5].value = 0;
    AxisInputFrom[6].value = 0;
    AxisInputFrom[7].value = 0;
    SendData("A1BG0#A2BG0#A3BG0#","A1BG0#A2BG0#A3BG0#");
}
function SetZero(){
    // InputFrom[0].value = 0;
    // InputFrom[1].value = 0;
    // InputFrom[2].value = 0;
    // InputFrom[3].value = 0;
    // InputFrom[4].value = 0;
    SendData("A1BR0#A2BR0#A3BR0#","A1BR0#A2BR0#A3BR0#");
}
function SetPID(i){
    var a = i;
    if(i>3){
        a = i-3;
    }
    data = "A"+a+"BP"+document.getElementById("P"+i).value+
            "I"+document.getElementById("I"+i).value+
            "D"+document.getElementById("D"+i).value+"#";
    if(i<=3) SendData(data,"");
    else SendData("",data);
}
function SendToMega(){
    SendData(document.getElementById("M1").value,document.getElementById("M2").value);
}
function SendData(DT1,DT2){//input A0BG123#. or A1BG1#A1BG2#A3BG4#.
    var xhttp = new XMLHttpRequest(); 
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){}
        else if (this.readyState == 4 && this.status == 404){}
    }
    xhttp.open('POST','/manual', true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // xhttp.send("DT1=A1BE#A2BE#A3BE#.&DT2=A1BE#A2BE#A3BE#.");
    xhttp.send("DT1="+DT1+".&DT2="+DT2+".");
} 