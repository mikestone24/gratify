window.requestAnimFrame = (function(){
   return  window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 1000 / 60);
           };
 })(); 
 
var b2Vec2 = Box2D.Common.Math.b2Vec2, 
 	b2AABB = Box2D.Collision.b2AABB, 
 	b2BodyDef = Box2D.Dynamics.b2BodyDef,  
 	b2Math = Box2D.Common.Math.b2Math, 
 	b2Body = Box2D.Dynamics.b2Body, 
 	b2FixtureDef = Box2D.Dynamics.b2FixtureDef, 
 	b2World = Box2D.Dynamics.b2World, 
 	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, 
 	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, 
 	b2DebugDraw = Box2D.Dynamics.b2DebugDraw, 
 	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef, 
 	b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef,
 	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef, 
 	b2WeldJointDef =  Box2D.Dynamics.Joints.b2WeldJointDef,
 	b2RopeJointDef=Box2D.Dynamics.Joints.b2RopeJointDef;

b2Body.prototype.render=function()
{
	var position = this.GetPosition();	
	ctx.save();
	ctx.translate(position.x*Gratify.scale,position.y*Gratify.scale); 
	ctx.rotate(this.GetAngle());		
	ctx.scale(Gratify.scale,Gratify.scale);
	ctx.lineWidth/=Gratify.scale;
	typeof this.drawbefore == 'function' && this.drawbefore()
	this.draw();
	typeof drawafter == 'function' && this.drawafter()
	ctx.restore();
}

b2Body.prototype.draw=function()
{
	var shape = this.GetFixtureList().GetShape();
	var shapeType = shape.GetType();
	var position = this.GetPosition();		
	if (this.m_userData && this.m_userData.imgsrc) {
		var size = this.m_userData.imgsize;
		var imgObj = new Image(size,this.m_userData.imgh);
		imgObj.src = this.m_userData.imgsrc;
		ctx.save();
		var s2 = (this.m_userData.imgsize/-2);
		var s3 = (this.m_userData.imgh/-2);
		var scale = this.m_userData.bodysize/-s2;
		ctx.scale(this.m_userData.imgsc,-this.m_userData.imgsc);
		ctx.scale(1/Gratify.scale,1/Gratify.scale);
		ctx.drawImage(imgObj,s2,s3);
		ctx.restore();
	}	
	else if (shapeType == 0) {
		ctx.beginPath();
		ctx.arc(0,0,shape.GetRadius(),0,Math.PI*2,true);
		ctx.closePath();
	}	
	else if (shapeType == 1) {
		var vert = shape.GetVertices();
		ctx.beginPath();
		ctx.moveTo(vert[0].x, vert[0].y);
		for (var i = 0; i < vert.length; i++) 
			ctx.lineTo(vert[i].x, vert[i].y);
		
		ctx.lineTo(vert[0].x,  vert[0].y);
		ctx.closePath();
	}
	ctx.fill();
	ctx.stroke();
	
	
}	 
	

function gratify(opts){	
	opts = opts || {};
	Gratify.init(opts.canvas,opts.scale,opts.postprocessing);
}

var Gratify={
	self : this,
	gravity : new b2Vec2(0,  -10),
	init : function(canvas,scale,postprocessing) {
		Gratify.scale=self.scale = scale || 30;	
		self.canvas = canvas|| "canvas";
		self.postprocessing = postprocessing|| "fragment";	
		$('body').css('margin','0');
		$('body').append($('<canvas/>',{'id':'canvas','Width':window.innerWidth,'Height':window.innerHeight}));
		var fragment_element=document.getElementById(self.postprocessing);
		self.glsl_enabled=(fragment_element&&Glsl.supported());
		if (self.glsl_enabled) {
			$('body').append($('<canvas/>',{'id':'viewport','Width':window.innerWidth,'Height':window.innerHeight}));
			var tcanvas = document.getElementById(self.canvas);  		
			self.glsl = Glsl({
				canvas: document.getElementById("viewport"),
				fragment: fragment_element.textContent,
				variables: {time: 0 ,canvas:tcanvas},
			   update: function (time) {
			   		
			     	this.set("time", time);
			      	this.set("canvas", tcanvas);
			   }
			}).start();
		}
		Gratify.events();
	},
	
	resize : function()
	{
		self.ctx.canvas.width  = window.innerWidth;
		self.ctx.canvas.height = window.innerHeight;
		$("#canvas").width( window.innerWidth);
		$("#canvas").height(window.innerHeight);
		canvas_width = parseInt(canvas.attr('width'));
		canvas_height = parseInt(canvas.attr('height'));
		canvas_height_m = canvas_height / self.scale;
		canvas_width_m = canvas_width / self.scale;
		if (self.glsl_enabled)self.glsl.setSize(window.innerWidth, window.innerHeight);
	},
	    
	processObjects : function() 
	{
		var node = world.GetBodyList();  
		while (node) {
			if (node.GetType() == b2Body.b2_dynamicBody)node.render();
			node =  node.GetNext();
		}
	},
	
	createWorld : function()
	{
		world = new b2World(this.gravity , true );
		typeof init == 'function' && init();
		if(typeof collision == 'function'){
			var collisionListener = new Box2D.Dynamics.b2ContactListener();
			collisionListener.PostSolve = function(contact){}
			collisionListener.EndContact= function(contact){}
			collisionListener.PreSolve = function(contact, oldManifold) {}
			collisionListener.PostSolve = collision;
			world.SetContactListener(collisionListener);
		}
		return world;
	},
	
	step : function()
	{
		requestAnimFrame( Gratify.step );
		var fps =  60;
		var timeStep = 1.0/(fps * 0.8);
		self.time++;
		world.Step(timeStep , 8 , 3);
		world.ClearForces();
		Gratify.draw_world(world , ctx);    		
		typeof drawafter == 'function' && drawafter();
	},
	
	draw_world : function(world, context) 
	{ 
		ctx.canvas.width  = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		ctx.save();
		ctx.translate(0 , window.innerHeight);
		ctx.scale(1 , -1);
		typeof drawbefore == 'function' && drawbefore();	
		if(Gratify.follow)
		ctx.translate(-Gratify.follow.m_xf.position.x*30+window.innerWidth/2,-Gratify.follow.m_xf.position.y*30+window.innerHeight/2);
		Gratify.processObjects();
		ctx.restore();
	}

}; 