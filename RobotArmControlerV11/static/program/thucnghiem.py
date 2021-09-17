a = position()
b = a.add(x=200,z=450,a=-90)
c = a.add(x=200,z=500,a=-90)
bovat = c.add(x=50,y=-550)
b = b.add(y=300)
gapvat = b.add(x=23,y=222)

handle(-200)
move(c)

for i in range(7):
    move(gapvat)
    move(gapvat.add(z=-250))
    wait(1)
    while(not sensor("A3")): wait(0.5)
    handle(255)
    handle(150)
    move(gapvat)
    if not sensor("A3"):
        handle(-200)
        continue

    move(bovat)
    wait(1)
    handle(-200)

move(c)
handle(150)
move(a)