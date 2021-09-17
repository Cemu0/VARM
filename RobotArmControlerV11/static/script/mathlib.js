/*This lib is no more use */
var mathlib = function () {
    const L1 = 532; //mm
    const L2 = 630; //mm
    const L3 = 450; //mm
    const L4 = 50;
    const L5 = 100;
    const L6 = 60;
    /*    const L4 = 70;
    const L5 = 200;
    const L6 = 211;*/
    const A0gr = 32/2 * (48 / 13) * (69 / 17) * (69 / 17) * 6;
    const A1gr = 32/2 * (48 / 13) * (69 / 17) * (69 / 17) * 6;
    const A2gr = 32/2 * (48 / 13) * (41 / 12) * (41 / 12) * 6;
    const A3gr = 79 * (41 / 12) * (41 / 12) * 4 // using when rotation y axis
    const A3grrt=79 * (41 / 12) * (41 / 12) * 4 * (16 / 10) // using when rotation z axis

    var falpha = 0;
    var beta = 0;
    var alpha = 0;

    this.a1 = 0;
    this.a2 = 0;
    this.a3 = 0;
    this.a4 = 0;
    this.a5 = 0;

    var px = 0;
    var py = 0;
    var pz = 0;

    var dx = 0;
    var dy = 0;
    var dz = 0;

    ///start point
    // Px = L4
    // Py = 0
    // Pz = L1+(L2-L3)+L5
    // alpha = -(pi/2) #-90degree
    // beta = 0

    var sqr = function (input) {
        return input * input;
    };
    var sq = function (input) {
        return input * input;
    };

    this.changexyz = function (x, y, z, alpha, beta) {
        var palpha = (alpha*Math.PI)/180;
        var nbeta = (beta*Math.PI)/180;

        var nalpha = palpha + Math.atan(L4/L5);
        var DP = Math.sqrt(sq(L4) + sq(L5));

        var dx = x - Math.round(DP*Math.cos(nbeta)*Math.cos(nalpha));
        var dy = y - DP*Math.cos(nalpha)*Math.sin(nbeta);
        var dz = z - Math.abs(DP*Math.sin(nalpha));
        // console.log(dx,dy,dz)
        var a1 = Math.atan2(dy, dx);
        this.a1 = Math.round(a1*A0gr/(2*Math.PI));

        var A1M = Math.sqrt(sq(dx) + sq(dy));
        var A1A3 = Math.sqrt(sq(dz - L1) + sq(A1M));
        var cosa3 = (sq(L2) + sq(L3) - sq(A1A3)) / (2 * L2 * L3);
        var a3 = Math.atan2(Math.sqrt(1 - sq(cosa3)), cosa3);
        this.a3 = -Math.round(a3*A2gr/(2*Math.PI));

        var muy = Math.atan2((dz-L1),Math.sqrt(sq(dx)+sq(dy)));
        var roy = Math.atan2(L3*Math.sin(Math.PI - a3),(L2+L3*Math.cos(Math.PI - a3)));
        var a2 = Math.PI/2 - (muy + roy);
        this.a2 = Math.round((a2)*A1gr/(2*Math.PI));

        var al = (Math.PI/2-a2) - (Math.PI-a3) - (nalpha - Math.atan(L4/L5));//roll 
        var bt = a1 - nbeta;

        var a4 = -Math.round(al*A3gr/(2*Math.PI));
        var a5 = Math.round(al*A3gr/(2*Math.PI));
        if(alpha == -180){
        a4 += Math.round(bt*A3gr/(2*Math.PI));
        a5 += Math.round(bt*A3gr/(2*Math.PI));
        }
        this.a4 = a4;
        this.a5 = a5;
    }
}
/* //runing code here
var MT = new mathlib();
var LastMathInputFrom = [0, 0, 0, 0, 0];
var MathInputFrom = [0, 0, 0, 0, 0];

MathInputFrom[0] = document.getElementById("X");
MathInputFrom[1] = document.getElementById("Y");
MathInputFrom[2] = document.getElementById("Z");
MathInputFrom[3] = document.getElementById("alpha");
MathInputFrom[4] = document.getElementById("beta");
setInterval(AutoCacular, 100);

var SInputFrom = [0, 0, 0, 0, 0, 0];
for (var a = 1; a <= 5; a++) {
    SInputFrom[a - 1] = document.getElementById("A" + a);
}
SInputFrom[5] = document.getElementById("HP");
// SInputFrom[0].value = 20;
function AutoCacular() {
    var change = false;
    for (var a = 0; a < 5; a++)
        if (MathInputFrom[a].value != LastMathInputFrom[a]) change = true;
    if (change) {
        for (var a = 0; a < 5; a++) LastMathInputFrom[a] = MathInputFrom[a].value;
        MT.changexyz(parseInt(MathInputFrom[0].value),
            parseInt(MathInputFrom[1].value),
            parseInt(MathInputFrom[2].value),
            parseInt(MathInputFrom[3].value),
            parseInt(MathInputFrom[4].value));
        SInputFrom[0].value = MT.a1;
        SInputFrom[1].value = MT.a2;
        SInputFrom[2].value = MT.a3;
        SInputFrom[3].value = MT.a4;
        SInputFrom[4].value = MT.a5;
    }
}
*/