a = position()
move(a)
handle(100)
'''
a = position() #start position
b = a.add(x=200,z=450,a=-90)
Pin = (b.add(y=150),
     b.add(x=150,y=150),
     b.add(y=300),
     b.add(x=150,y=300))
Pout = (b.add(x=150,y=-300),
     b.add(y=-300),
     b.add(x=150,y=-150),
     b.add(y=-150))
handle(-200)# open hand
#move(a)# move to begin position
#wait(5)
move(a.add(x=300,z=400),speed = 100)
wait(1)
move(b)
wait(1)
#handle(150)#openhand
for i in range(4):
    move(Pin[i])
    move(Pin[i].add(z=-190),speed=70)
    ss = sensor("A3")
    if not ss:
        move(Pin[i].add(z=-230),speed=70)
    while(not sensor("A3")): wait(1)
    handle(255)
    handle(150)
    move(Pin[i])
    move(Pout[i])
    if not ss:
        move(Pout[i].add(z=-210),speed=70)
    else:
        move(Pout[i].add(z=-200),speed=70)
    handle(-140)
    move(Pout[i])
move(b)
handle(255)
handle(100)
move(a)
'''

