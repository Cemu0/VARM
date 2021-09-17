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

_debug_ = False
# import _thread
from time import sleep
from lib import KillThread
from lib import RobotInvertKinematic as rik
if not _debug_: from lib import SerialComunicate as SC

'''
class PositionAx:
    def __init__(self,a1=0,a2=0,a3=0,a4=0,a5=0):
        self.a1,self.a2,self.a3,self.aa4,self.a5 = a1,a2,a3,a4,a5
'''
#run enviroment
globalsParameter = {'__builtins__':None}
# if not _debug_: SC.ComunicateHost()
class RobotControler:
    def __init__(self):
        self.RIK = rik.RobotInvertKinematic()
        self.NowP = rik.PositionXy()
        self.LateAxis = [0,0,0,0,0,0]
        self.Thread = None
        self.Runingline = 0
        self.IsRuning = False
        #stack...no

    def toPosition(self,x,y,z,a,b):
        return rik.PositionXy(x,y,z,a,b)

    def addPosition(self,x,y,z,a,b):
        return self.NowP.add(x,y,z,a,b)

    def CAG(self,P):
        NowAxis = None
        try: # position out side the work area ... rase a error
            NowAxis = self.RIK.PositionCaculator(P)
        except:
            NowAxis = self.LateAxis
            print("false to cacular")
        datasend1 = ""
        datasend2 = ""
        # print("A1:",NowAxis[0])
        for i in range(3):
            if self.LateAxis[i] != NowAxis[i]:
                datasend1 += "A"+str(i+1)+'BG'+str(NowAxis[i])+'#'
                self.LateAxis[i] = NowAxis[i]
        for j in range(2):
            i = j+3
            if self.LateAxis[i] != NowAxis[i]:
                datasend2 += "A"+str(j+1)+'BG'+str(NowAxis[i])+'#'
                self.LateAxis[i] = NowAxis[i]   
        # if self.LateAxis[5] != NowAxis[5]:
        #         datasend2 += "A3BG"+NowAxis[5]+'#'
        #         self.LateAxis[5] = NowAxis[5]
        datasend1 += "."
        datasend2 += "."
        print("output:",datasend1,datasend2)
        if datasend1 != ".": 
            if not _debug_:SC.WriteSerial(SC.ser1,datasend1)
        if datasend2 != ".": 
            if not _debug_:SC.WriteSerial(SC.ser2,datasend2)
    
    def handle(self,number,h):
        if self.LateAxis[5] != h:
            self.Runingline = number
            self.LateAxis[5] = h
            datasend2 = "A3BG"+str(h)+"#."
            if not _debug_:SC.WriteSerial(SC.ser2,datasend2)
            sleep(0.5)

#addition
    def sensor(self,number,place):#A3BM#.
        self.Runingline = number
        # if not _debug_:SC.WriteSerial(SC.ser2,place+"BM#.")
        data = True
        if not _debug_:data = SC.Readone(SC.ser2,place+"BM#.")
        print(data)
        # check = False
        # try:
        #     if data.find("Y") != -1: check = True
        #     print("error when read:",data)
        # except: pass
        return data
#end

    def GoToXYZ(self,number,Position,speed = 140):
        self.Runingline = number
        # print("runing on", Runingline)
        # Position = self.RIK.PositionXy(x,y,z,a,b)
        # NP = self.NowP
        print("GoingTo:",Position.get())
        Sx,Sy,Sz,Salp,Sbet,t = self.RIK.SpeedOfOrbitLine(self.NowP,Position,speed)
        for i in range(t-1):
            # NP.add(Sx,Sy,Sz,Salp,Sbet)
            self.NowP = self.NowP.add(Sx,Sy,Sz,Salp,Sbet)
            self.CAG(self.NowP)
            sleep(0.09)
        self.CAG(Position)
        sleep(1)
        self.NowP = Position

    def GoToXYZFast(self,number,Position,speed = 140):
        self.Runingline = number
        # print("runing on", Runingline)
        # Position = self.RIK.PositionXy(x,y,z,a,b)
        # NP = self.NowP
        print("GoingTo:",Position.get())
        # Sx,Sy,Sz,Salp,Sbet,t = self.RIK.SpeedOfOrbitLine(self.NowP,Position,speed)
        # for i in range(t-1):
        #     # NP.add(Sx,Sy,Sz,Salp,Sbet)
        #     self.NowP = self.NowP.add(Sx,Sy,Sz,Salp,Sbet)
        #     self.CAG(self.NowP)
        #     sleep(0.09)
        self.CAG(Position)
        sleep(0.1)
        self.NowP = Position
    
    def Custom(self,Ad1,Ad2):
        if not _debug_:SC.WriteSerial(SC.ser1,Ad1)
        # sleep(0.05)
        if not _debug_:SC.WriteSerial(SC.ser2,Ad2)
        # sleep(0.05)

    def NowPosition(self):
        return self.NowP.get()

    def RunLine(self):
        return self.Runingline
    
    def Runing(self):#!!!
        return self.IsRuning

    def StartExcuted(self,filename):
        try: self.Thread.kill()
        except: pass
        self.Thread = KillThread.KThread(target=self.excuted,args=(filename,))
        self.Thread.start()
    
    def ResetExcuted(self):
        try: self.Thread.kill()
        except: pass

    def excuted(self,filename):
        self.IsRuning = True
        prgr = ""
        ln = 0
        with open(filename) as f:
            for line in f:
                ln+=1 
                #danh dau dong lenh
                prgr += line.replace("move(","move("+str(ln)+",").replace("sensor(","sensor("+str(ln)+",").replace("handle(","handle("+str(ln)+",")
                
        # print("numofline",ln)
        newglobalsParameter = globalsParameter
        localsParameter = {'move':self.GoToXYZ,
                           'wait':sleep,
                           'position':rik.PositionXy,
                           'handle':self.handle,
                           'sensor':self.sensor,
                           'range':range
                           }
        exec(compile(prgr,"runing","exec"),newglobalsParameter,localsParameter)
        self.IsRuning = False