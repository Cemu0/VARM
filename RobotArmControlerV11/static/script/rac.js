loadDoc()
// pullStream()
var NowStep = 0;
var LastStep = 0;
var StopRunRepeat = true;
var Var_Table = [];
var table = document.getElementById('Ltable');
var lastlsid = "";
var LastInputFrom = [0,0,0,0,0,0,0,0]
var InputFrom = [0,0,0,0,0,0,0,0]

InputFrom[0]=document.getElementById("X");
InputFrom[1]=document.getElementById("Y");
InputFrom[2]=document.getElementById("Z");
InputFrom[3]=document.getElementById("alpha");
InputFrom[4]=document.getElementById("beta");
InputFrom[5]=document.getElementById("HP");
InputFrom[6]=document.getElementById("Speed");
InputFrom[7]=document.getElementById("TimeWait");

setInterval(SetStep,100); //auto setstep if change
//file interaface v:
function loadDoc() { 
    LastStep = "lsid0"; 
    var xhttp = new XMLHttpRequest(); 
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            //pass//////////////////////////////////////
        }
    }
    xhttp.open('GET', '/static/prg1.py', true);
    xhttp.send();
}

function saveDoc() {
    datasend = "D=";
    for(i in Var_Table){
        for(a in Var_Table[i]){
            datasend+=Var_Table[i][a] + '\t';
        }
        datasend=datasend.slice(0, -1);
        datasend += '\n';
    }
    datasend=datasend.slice(0, -1);
    var xhttp = new XMLHttpRequest(); 
    xhttp.open('POST',"/save", true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send(datasend);
}

function ReloadTable(){
    var tb = "<tr><th>X</th><th>Y</th><th>Z</th><th>α</th><th>β</th><th>HP</th><th>Speed</th><th>Time Wait</th></tr>";
    var idnum = 0
    for(i in Var_Table){
        tb+="<tr onclick='SSBN("+idnum+")' id=\'lsid"+idnum+"\'>";
        for(a in Var_Table[i]){
            tb+="<td>"+Var_Table[i][a]+"</td>";
        }
        tb+="</tr>";
        idnum++;
    }
    table.innerHTML = tb;
}

function newStep(){
    data = []
    for(a in InputFrom){
        data.push(InputFrom[a].value);
    }
    Var_Table.splice(NowStep+1,0,data);
    ReloadTable();
}

function SetStep(){
    var change = false
    for (var a = 0; a < 5; a++)
        if (InputFrom[a].value != LastInputFrom[a]){
            change = true;
            LastInputFrom[a]=InputFrom[a].value
        }

   if(change){
        var datasend = "X="+parseInt(InputFrom[0].value)+"&"+ // not the most effec.. way
                   "Y="+parseInt(InputFrom[1].value)+"&"+
                   "Z="+parseInt(InputFrom[2].value)+"&"+
                   "A="+parseInt(InputFrom[3].value)+"&"+
                   "B="+parseInt(InputFrom[4].value)+"&"+
                   "H="+parseInt(InputFrom[5].value)+"&"+
                   "S="+parseInt(InputFrom[6].value)+" ";
       var xhttp = new XMLHttpRequest(); 
       xhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200){}
           else if (this.readyState == 4 && this.status == 404){}
       }
       xhttp.open('POST','/goto', true);
       xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
       xhttp.send(datasend);
   }
}

function BackZero(){
    InputFrom[0].value = 50;
    InputFrom[1].value = 0;
    InputFrom[2].value = 812;
    InputFrom[3].value = -90;
    InputFrom[4].value = 0;
}

//sys out
window.onbeforeunload = function(){
    // Do something
 }
 // OR
 window.addEventListener("beforeunload", function(e){
    // Do something
 }, false);