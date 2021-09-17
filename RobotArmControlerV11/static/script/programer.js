//init
var saved = false;
var onrun = false;
var runlinenumber = 0;
var LateHighLight = 0;
var openingfile = "";
var CBUTTON = document.getElementById("cbutton");
var editor = CodeMirror(document.getElementById("CodeEditor"), {
    // value: "def saysomething:\n\tprint('hello')",
    mode:  "python",
    theme: "cobalt",
    lineNumbers: true,
    readOnly:false
    });
editor.setSize("100%","60vh");
editor.setOption("readOnly",false);
editor.on("change", function() {
    saved = false;
});

function SendData(url,data=""){
    var xhttp = new XMLHttpRequest(); 
    xhttp.open('POST',url, true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send(data);
}

function getfilelist(){
    var xhttp = new XMLHttpRequest(); 
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            data = this.responseText.split(" ");
            rep = "<option value=\"NewProgram\">NewProgram</option>";
            for(v in data){
                if(data[v]=="")continue;
                select = "";
                if(data[v]==openingfile)select = "selected"; 
                rep+="<option value=\""+data[v]+"\""+select+">"+data[v]+"</option>";
                // console.log(rep);
            }
            // console.log(rep)
            document.getElementById("ProgramList").innerHTML = rep;
        }
    }
    xhttp.open('POST', '/filelist', true);
    xhttp.send();
}

function read(){
    openingfile = document.getElementById("ProgramList").value;
    if((openingfile == "NewProgram") || (openingfile == "")){
        editor.setValue("# write your program here");
        return;
    }
    var xhttp = new XMLHttpRequest(); 
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
            editor.setValue(this.responseText)
            saved = true;
    }
    // xhttp.open('GET', 'static/program/'+String(openingfile), true);
    xhttp.open('POST', '/open', true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send("name="+String(openingfile));
}

function save(){
    // var xhttp = new XMLHttpRequest(); 
    // xhttp.open('POST', '/save', true);
    // xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // xhttp.send("name="+openingfile+"&data="+String(editor.getValue()));
    openingfile = document.getElementById("ProgramList");
    if (openingfile.value == "NewProgram"){
        var filename = prompt("Please enter a file name", "Program1");

        if (filename == null || filename == "") {
            alert("file not saved");
            return;
        } else {
            openingfile.value = filename;
        }
    }
    var password = prompt("Please enter password", "pass");
    SendData('/save',"name="+openingfile.value+"&data="+String(editor.getValue())+"&pass="+String(password))
    saved = true;
    setTimeout(function(){
        getfilelist();
        // read(); 
    }(),800);
    setTimeout(read(),1000);

}

function stop(){
    SendData('/stop')
}

function run(){
    if (!saved)if(!confirm("File not saved, continue ?"))return;
    if(!confirm("Are You Sure ?"))return;
    SendData('/run',"file="+document.getElementById("ProgramList").value)
    editor.setOption("readOnly",true);
}

function reset(){
    SendData('/reset')
    editor.setOption("readOnly",false);
}

function pull(){
    var xhttp = new XMLHttpRequest(); 
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            //return value {linerun,Position} split by "|"
            if(this.responseText != "ni"){
            data = this.responseText.split("|");
            ln = parseInt(data[0])-1; //runing on this line !
            editor.setCursor(ln);
            editor.markText({line:LateHighLight,ch:0},{line:LateHighLight,ch:100},{css:"background-color:#002240"});
            editor.markText({line:ln,ch:0},{line:ln,ch:100},{css:"background-color:#3caa24"});
            LateHighLight = ln;
            if(data[2] == "True"){
                if(onrun == false){
                    onrun = true;
                    CBUTTON.innerHTML = "RESET";
                    CBUTTON.onclick = reset;
                    CBUTTON.className = "bt w3-button w3-yellow w3-round-large";
                    editor.setOption("readOnly",true);
                }
            }else{
                if(onrun == true){
                    onrun = false;
                    CBUTTON.innerHTML = "RUN";
                    CBUTTON.onclick = run;
                    CBUTTON.className = "bt w3-button w3-green w3-round-large";
                    editor.setOption("readOnly",false);
                    editor.markText({line:LateHighLight,ch:0},{line:LateHighLight,ch:100},{css:"background-color:#002240"});
                }
            }

            }else{
                editor.markText({line:LateHighLight,ch:0},{line:LateHighLight,ch:100},{css:"background-color:#002240"});
            }
            pull();
        }
    }
    xhttp.open('POST', '/pull', true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send();
}
//set event here

//run here
getfilelist();
setTimeout(read(),500);
pull();