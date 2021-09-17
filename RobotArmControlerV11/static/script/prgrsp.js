var LastPosition = document.getElementById("P1");
var NowPosition  = document.getElementById("P2");
//var u=d=c=q=f=l=r=b=0;
var Dimentions = [0,0,0,0,0,0];
var LastDimentions = [0,0,0,0,0];
var butt = [0,0,0,0,0,0,0,0];
var send = false;
var lastsend = 1;
reset();
setInterval(UpdateButton,200);
// function UpdateButton(){}
function UpdateButton(){
    send = false;
    for(var i=0;i<=5;i++){
        if(parseInt(butt[i])!=0){
            send = true;
            if(Math.abs(butt[i]) <= 15){
            // console.log(i,butt[i]);
            if(lastsend > 5){
                butt[i]=parseInt(butt[i]) + parseInt(butt[i]);
            }
            lastsend += 1; 
        }
        Dimentions[i] = parseInt(butt[i]) + parseInt(Dimentions[i]);
        /*
        Dimentions[0]+=butt[0];
        Dimentions[1]+=butt[1];
        Dimentions[2]+=butt[2];
        Dimentions[3]+=butt[3];
        Dimentions[4]+=butt[4];*/
    }
}
    if(send){
        //sendmove();
        NowPosition.value = String(Dimentions);
        sgoto();
    }
}
/*
butt[0] //X
1 Y
2 Z
3 A
4 B
5 H
*/
function up(){butt[2]+=1;UpdateButton();}
function cw(){butt[4]+=1;UpdateButton();}
function ru(){butt[3]+=1;UpdateButton();}
function rd(){butt[3]-=1;UpdateButton();}
function cc(){butt[4]-=1;UpdateButton();}
function dw(){butt[2]-=1;UpdateButton();}
function fw(){butt[0]+=1;UpdateButton();}
function lt(){butt[1]+=1;UpdateButton();}
function rt(){butt[1]-=1;UpdateButton();}
function bk(){butt[0]-=1;UpdateButton();}
function cl(){
    for(var i=0;i<=5;i++)butt[i]=0;
    lastsend = 1;
    /*
    clearTimeout();
    lastsend = false;
    setTimeout(() => {
        //cacldf ...
        SendData("cacldf","",NowPosition);
    }, 250);
    */
}

function reset(){
    //nowp
    SendData("nowp","",LastPosition);
}

function sgoto(){
    //moveup
    //x = Math.max(...butt)
    var speed = 1
    if(lastsend<7){speed=lastsend*2;}else{speed = 60;}
    data = "X="+Dimentions[0]+"&Y="+Dimentions[1]+"&Z="+Dimentions[2]+"&A="+Dimentions[3]+
           "&B="+Dimentions[4]+"&S="+String(speed)+"&H=0";
    SendData("goto",data);
}

function sendmove(){
    //moveup
    //x = Math.max(...butt)
    data = "X="+butt[0]+"&Y="+butt[1]+"&Z="+butt[2]+"&A="+butt[3]+
           "&B="+butt[4]+"&S=50"+"&H=0";
    SendData("moveup",data);
}

function SendData(link,data,objc=null){//input A0BG123#. or A1BG1#A1BG2#A3BG4#.
    var xhttp = new XMLHttpRequest(); 
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            if(objc!=null){
            if(objc == LastPosition){
                Dimentions = this.responseText.replace("(","").replace(")","").replace(/ /g,"").split(",");
                objc.value = String(Dimentions);
            // }else{
            //     objc.value = this.responseText;
            }
            }
        }
        else if (this.readyState == 4 && this.status == 404){}
    }
    xhttp.open('POST','/'+link, true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send(data);
}
/*
setInterval(safe,500);
function safe(){
     if(u==0 && d==0 && c==0 
        && q==0 && f==0 && l==0 
        && r==0 && b==0;){
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
*/
