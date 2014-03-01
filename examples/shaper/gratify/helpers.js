function create_fix_def(shape,options)
{
	options = $.extend(true, {
		'density' : 20 ,
		'friction' : 0.8 ,
		'restitution' : 0.4 ,
		'type' : b2Body.b2_dynamicBody
	}, options);
	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef();
	if(options.group)fix_def.filter.groupIndex = options.group;
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	fix_def.shape=shape;
	return fix_def;
}

function create_body(x,y,user_data)
{
	var body_def = new b2BodyDef();
	body_def.position.Set(x , y);
	body_def.angularDamping =0.2;
	body_def.linearDamping = 0.7;
	body_def.type = b2Body.b2_dynamicBody;
	body_def.userData = user_data;
	return body_def;
}

function AddToWorld(fix_def,x,y,user_data)
{
	var body_def=create_body(x,y,user_data);
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);
	return b;
}

function box(world, x, y, width, height, options) 
{
	var fix_def=create_fix_def(new b2PolygonShape(),options);
	fix_def.shape.SetAsBox( width/2 , height/2 );
	return AddToWorld(fix_def,x,y,options&&options.user_data);
}

function circle(world, x, y, radius, options) 
{
	return AddToWorld(create_fix_def(new b2CircleShape(radius),options),x,y,options&&options.user_data);
}
           
function polygon(world, x, y, width, height, numberOfSides, options) {
	var fix_def=create_fix_def(new b2PolygonShape(),options);
	var results = [];
	for (var i = 1; i< numberOfSides+1 ; i++) 
		results.push(
			new b2Vec2( 
				(width  / 2) * Math.cos(i * 2 * Math.PI / numberOfSides), 
				(height / 2) * Math.sin(i * 2 * Math.PI / numberOfSides)
			));	  
	fix_def.shape.SetAsVector(results);
 	return AddToWorld(fix_def,x,y,options&&options.user_data);
}

function rope(flink,fanch,r_height,numpeices,x,y)
{
	var last_link=flink;
	var last_anchor_point = fanch;
	var revolute_joint = new b2RevoluteJointDef();
	for (var i = 1; i <= numpeices; i++) 
    {
    	var opts={group:-8,};
		var body = createBox(world, x , y - i * r_height, 0.25 , r_height,opts);
		revolute_joint.bodyA = last_link;
		revolute_joint.bodyB = body;
		revolute_joint.localAnchorA = last_anchor_point;
		revolute_joint.localAnchorB = new b2Vec2(0 , r_height/2);
		revolute_joint.collideConnected = false;
		last_anchor_point = new b2Vec2(0, -1 * r_height/2);
		world.CreateJoint(revolute_joint);
		last_link = body;
	}
	return last_link;
}

function get_real(p)
{
	return new b2Vec2(p.x + 0, canvas_height_m - p.y);
}
function vecfromangle(ax,ay,d,t)
{
	return {
		x:bx = ax + d*Math.cos(t),
		y:ay + d*Math.sin(t)
		}
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}