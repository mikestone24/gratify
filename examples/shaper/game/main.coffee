Gratify.gravity=new b2Vec2(0,  0)
maindude={} ; asteroids=[]
mouseangle = mousex = mousey = 0
imgObj = new Image(1922,1212)

keypress = (which) ->   
	maindude.ApplyForce( { x:Math.cos(mouseangle) * 142.5 , y:Math.sin(mouseangle) * 142.5 },
	maindude.GetWorldCenter() ) 
	
mousedown = ->
	distf=vecfromangle(maindude.GetPosition().x,maindude.GetPosition().y,0.9,mouseangle);
	bullet = box(world, distf.x,distf.y,0.3,0.3,{user_data:"bullet"})
	bullet.SetBullet(true);
	force = new b2Vec2(Math.cos(mouseangle) * 13.5 , Math.sin(mouseangle) * 13.5);
	bullet.ApplyImpulse(force,bullet.GetWorldCenter());
	bullet.drawbefore = =>
		ctx.strokeStyle = "#0000F7";
		
drawbefore = ->
	ctx.save()
	ctx.scale(0.7,0.7);
	ctx.drawImage(imgObj,-maindude.GetPosition().x,-maindude.GetPosition().y);
	ctx.restore()
	ctx.strokeStyle = "#006837"
	ctx.lineWidth=5
	ctx.fillStyle = "rgba(40, 40, 40, 0.5)"
	
init = -> 
	imgObj.src = 'graphics/background.png'
	maindude=polygon(world,20,20,1,1,3)	
	maindude.drawbefore = =>
		ctx.strokeStyle = "#0000F7";
	Gratify.follow=maindude
	#astroids			
	for x in [1..17]
		for y in [1..17]
			ast=polygon(world, 5+(x*9)+random(0,2) , (y*9)+random(0,2), random(1,3),random(1,3),random(4,9),{user_data:"ast"}); 
			ast=circle(world, 5+(x*9)+random(0,2) , (y*9)+random(0,2)+5, random(1,3),{user_data:"ast"}); 
			asteroids.push(ast)
			
mousemove = (mouse_x,mouse_y) ->
	mousex=mouse_x
	mousey=mouse_y
	p = get_real(new b2Vec2(mouse_x, mouse_y))
	mouseangle = Math.atan2((mouse_x)-(window.innerWidth/2)+0.5, (mouse_y)-(window.innerHeight/2))-Math.PI/2;		
	maindude.SetPositionAndAngle( maindude.GetPosition(), mouseangle ); 
	maindude.SetAngularVelocity(0);	

collision = (contact,impulse) ->
	bodyA = contact.GetFixtureA().GetBody();
	bodyB = contact.GetFixtureB().GetBody();
	if (bodyA.GetUserData()=='bullet'||bodyB.GetUserData()=='bullet')
		bodyB.drawbefore = bodyA.drawbefore = =>
			ctx.strokeStyle = "#FF0000";