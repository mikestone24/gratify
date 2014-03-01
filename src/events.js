
Gratify.events=function(){

	$(function() 
	{
		self.canvas = $(self.canvas);
		
		self.ctx=self.canvas.get(0).getContext('2d');
		if(self.glsl_enabled)
		{
			$("#canvas").hide();
			self.viewport = $('#viewport');  
		}else {
			self.viewport =self.canvas;  
		}
		Gratify.resize();
		world = Gratify.createWorld();
		Gratify.step();
			
		$(window).resize(function() 
		{
			Gratify.resize();
		});
			
		$(document).keypress(function( event ) {
			typeof keypress == 'function' && keypress(event.which);
			if ( event.which == 119 )event.preventDefault(); 
		});
	
	    self.viewport.mousemove(function(e) 
		{
			typeof mousemove == 'function' && mousemove(e.pageX,e.pageY);    		
		});
		
		self.viewport.mousedown(function() 
		{
			typeof mousedown == 'function' && mousedown();
			mouse_pressed = true;
			down = true; 
		});
		
		self.viewport.mouseout(function() 
		{
			mouse_pressed = false;	
		});
		
		self.viewport.mouseup(function() 
		{
			typeof mouseup == 'function' && mouseup();
			mouse_pressed = false;
		});	
	});
}