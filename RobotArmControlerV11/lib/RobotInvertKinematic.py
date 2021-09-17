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

import math as Math

class PositionXy:
    def __init__(self,x=50,y=0,z=812,a=-90,b=0):
        self.x,self.y,self.z,self.a,self.b = x,y,z,a,b

    # def sadd(self,Sx,Sy,Sz,Salp,Sbet):
    #     self.x += Sx
    #     self.y += Sy
    #     self.z += Sz
    #     self.a += Salp
    #     self.b += Sbet

    def get(self):
        return round(self.x),round(self.y),round(self.z),round(self.a),round(self.b)
    
    def add(self,x=0,y=0,z=0,a=0,b=0):
        return PositionXy(self.x+x,self.y+y,self.z+z,self.a+a,self.b+b)

class RobotInvertKinematic:
    L1 = 532#mm
    L2 = 630#mm
    L3 = 450#mm
    L4 = 50#mm
    L5 = 100#mm
    #L6 = 60#mm

    A0gr = (32/2) * (48 / 13) * (69 / 17) * (69 / 17) * 6 * 2 * 0.9765370782668266
    A1gr = (32/2) * (48 / 13) * (69 / 17) * (69 / 17) * 6 * 2 * 0.9765370782668266
    A2gr = (32/2) * (48 / 13) * (41 / 12) * (41 / 12) * 6 * 2
    A3gr = 79 * (41 / 12) * (41 / 12) * 4 * 2# using when rotation y axis
    A3grrt = 79 * (41 / 12) * (41 / 12) * 4 * (16 / 10) * 2 # using when rotation z axis

    def sq(self,input):
        return input * input

    def PositionCaculator(self,PositionXy):
        x,y,z,alpha,beta = PositionXy.get()

        palpha = (alpha*Math.pi)/180
        nbeta = (beta*Math.pi)/180

        nalpha = palpha + Math.atan(self.L4/self.L5)
        DP = Math.sqrt(self.sq(self.L4) + self.sq(self.L5))

        dx = x - round(DP*Math.cos(nbeta)*Math.cos(nalpha))
        dy = y - DP*Math.cos(nalpha)*Math.sin(nbeta)
        dz = z - abs(DP*Math.sin(nalpha))

        a1 = Math.atan2(dy, dx)
        ReturnA1 = round(a1*self.A0gr/(2*Math.pi))

        A1M = Math.sqrt(self.sq(dx) + self.sq(dy))
        A1A3 = Math.sqrt(self.sq(dz - self.L1) + self.sq(A1M))
        cosa3 = (self.sq(self.L2) + self.sq(self.L3) - self.sq(A1A3)) / (2 * self.L2 * self.L3)
        a3 = Math.atan2(Math.sqrt(1 - self.sq(cosa3)), cosa3)
        ReturnA3 = -round(a3*self.A2gr/(2*Math.pi))

        muy = Math.atan2((dz-self.L1),Math.sqrt(self.sq(dx)+self.sq(dy)))
        roy = Math.atan2(self.L3*Math.sin(Math.pi - a3),(self.L2+self.L3*Math.cos(Math.pi - a3)))
        a2 = Math.pi/2 - (muy + roy)
        ReturnA2 = round((a2)*self.A1gr/(2*Math.pi))

        al = (Math.pi/2-a2) - (Math.pi-a3) - (nalpha - Math.atan(self.L4/self.L5))#roll 
        bt = a1 - nbeta

        a4 = -round(al*self.A3gr/(2*Math.pi))
        a5 = round(al*self.A3gr/(2*Math.pi))
        if alpha == -180:
            a4 += round(bt*self.A3grrt/(2*Math.pi))
            a5 += round(bt*self.A3grrt/(2*Math.pi))
        ReturnA4 = a4
        ReturnA5 = a5
        return (ReturnA1,ReturnA2,ReturnA3,ReturnA4,ReturnA5)

    def SpeedOfOrbitLine(self,FP,SP,speed):
        x,y,z,alp,bet = FP.get()
        xd,yd,zd,alpd,betd = SP.get()

        Vx = xd - x
        Vy = yd - y
        Vz = zd - z
        Deta_alp = alpd - alp
        Deta_bet = betd - bet

        ab = Math.sqrt(Vx*Vx + Vy*Vy + Vz*Vz)

        dsp = speed/10
        t = k = ab/dsp
        #1mm/s = 0.1mm/ds
        if ab == 0:
            t = k = 1

        Sx = Vx/k
        Sy = Vy/k
        Sz = Vz/k
        Salp = Deta_alp/t
        Sbet = Deta_bet/t
        return(Sx,Sy,Sz,Salp,Sbet,round(t))
