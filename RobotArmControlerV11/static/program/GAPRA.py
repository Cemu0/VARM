a = position()
b = a.add(x=200,z=470,a=-90)
Pout = (b.add(x=138),
     b.add(x=23,y=222),
     b.add(x=-77,y=410),
     b.add(x=55,y=380))
Pin = (b.add(x=140,y=-290),
     b.add(x=140,y=-140),
     b.add(y=-140),
     b.add(y=-290))
handle(-200)
move(a.add(x=300,z=400),speed = 100)
wait(1)
move(b)
wait(1)
for j in range(4):
    i = 3-j
    move(Pin[i])
    wait(1)
    move(Pin[i].add(z=-190),speed=70)
    ss = sensor("A3")
    if not ss:
        move(Pin[i].add(z=-240),speed=70)
    while(not sensor("A3")): wait(0.5)
    wait(0.5)
    handle(255)
    handle(150)
    move(Pin[i].add(z=50),speed=70)
    move(Pout[i].add(z=50))
    if ss:
        move(Pout[i].add(z=-195),speed=70)
    else:
        move(Pout[i].add(z=-245),speed=70)
    handle(-100)
    move(Pout[i],speed=70)
move(b)
handle(255)
handle(100)
move(a)