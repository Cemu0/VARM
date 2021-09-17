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

import time
time.sleep(7)
import os
import numpy
from lib import RobotControling
from flask import Flask,request, render_template
from werkzeug.serving import WSGIRequestHandler
app = Flask(__name__)
WSGIRequestHandler.protocol_version = "HTTP/1.1"
ProgramDir = "/home/pi/Desktop/RobotArmControlerV11/static/program/"
# APP_ROOT = os.path.dirname(os.path.abspath(__file__))

RC = RobotControling.RobotControler()
LastPositionXY = RC.NowPosition()

@app.route('/')
def index():
    return render_template('programer.html')

@app.route('/old')
def old():
    return render_template('index.html')

@app.route('/setting')
def setting():
    return render_template('setting.html')

@app.route('/prgrsp')
def prgrsp():
    return render_template('prgrsp.html')

@app.route('/open', methods=['POST'])
def Open():
    if request.method == "POST": 
        # with open('\static\\program\\'+request.form["name"], 'w') as f:
        data = ""
        with open(ProgramDir+request.form["name"], 'r') as f:
            data = f.read()
        return data

@app.route('/save', methods=['POST'])
def save():
    if request.method == "POST": 
        # with open('\static\\program\\'+request.form["name"], 'w') as f:
        if(request.form["pass"]!="4123"):
                return "Nope"#lock save
        with open(ProgramDir+request.form["name"], 'w') as f:
            data = str(request.form["data"])

            print('writefile',f.write(data))
        return "OK"

@app.route('/filelist', methods=['POST'])
def filelist():
    if request.method == "POST": 
        lst = os.listdir(ProgramDir)
        rep = ""
        for i in lst:
            rep += str(i) + " "
        return rep

@app.route('/manual', methods = ['POST'])#manualMoving 
def SetStep():
    if request.method == "POST":
        RC.Custom(request.form["DT1"],request.form["DT2"])
        print("manual:",request.form["DT1"],request.form["DT2"])
        return "OK"

@app.route('/goto', methods = ['POST'])#PositionMoving, Old Mode ...
def Goto():
    if request.method == "POST":
        RC.GoToXYZFast(0,RC.toPosition(int(request.form["X"]),
                    int(request.form["Y"]),
                    int(request.form["Z"]),
                    int(request.form["A"]),
                    int(request.form["B"])),
                    int(request.form["S"])) #warning
        RC.handle(0,int(request.form["H"]))
        return "OK"

@app.route('/moveup', methods = ['POST'])#Position add Moving, Old Mode ...
def moveup():
    if request.method == "POST":
        RC.GoToXYZFast(0,RC.addPosition(int(request.form["X"]),
                    int(request.form["Y"]),
                    int(request.form["Z"]),
                    int(request.form["A"]),
                    int(request.form["B"])),
                    int(request.form["S"])) #warning
        RC.handle(0,int(request.form["H"]))
        return "OK"

@app.route('/nowp', methods = ['POST'])
def nowP():
        if request.method == "POST":
                LastPositionXY = RC.NowPosition()
                return str(RC.NowPosition())

@app.route('/cacldf', methods = ['POST'])#pull not ok
def cacldf():
        if request.method == "POST":
                rep = tuple(numpy.subtract(RC.NowPosition(),LastPositionXY))
                return str("position.add"+str(rep))

@app.route('/stop', methods = ['POST'])
def stop():
    if request.method == "POST":
        RC.Custom("A1BS#A2BS#A3BS#","A1BS#A2BS#A3BS#")
        return "OK"

# @app.route('/resume', methods = ['POST'])
# def resume():
#     if request.method == "POST":
#         RC.Custom("A1BE#A2BE#A3BE#","A1BE#A2BE#A3BE#")
#         return "OK"

@app.route('/run', methods = ['POST'])
def run():
    if request.method == "POST":
        filename = ProgramDir+request.form["file"]
        RC.StartExcuted(filename)
        return "OK"

@app.route('/reset', methods = ['POST'])
def pause():
    if request.method == "POST":
        RC.ResetExcuted()
        return "OK"

@app.route('/pull', methods = ['POST'])#pull not ok
def pull():
    if request.method == "POST":
        i = 0
        runline = RC.RunLine()
        runing = RC.Runing()
        # print("nowRunon",runline)
        while i<60:
            i+=1
            if(runline != RC.RunLine() or runing != RC.Runing()):
                return str(RC.RunLine())+"|"+str(RC.NowPosition())+"|"+str(RC.Runing())
            time.sleep(0.5)
        return "ni"

if __name__ == '__main__':
    app.run(host= '0.0.0.0',port=80,debug=True,threaded=True)
