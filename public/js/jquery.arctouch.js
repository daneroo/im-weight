// based on Stefan Gabos jquery boilerplate
// author: Daniel Lauzon
(function($) {
  $.arctouch = function(element, options) {
    var plugin = this;

    var $element = $(element);  // reference to the jQuery version of DOM element the plugin is attached to

	  var defaults = {
      range: 100,
      scale:1,
      round:1,
      swipeThreshHoldMS:500
    }

    // the "constructor" method that gets called when the object is created
    plugin.init = function() {
      plugin.settings = $.extend({}, defaults, options);
      // set the initial state
      $element.bind('mousedown', mousedown);
      $element.bind('mousemove', mousemove);
      $element.bind('mouseout', mouseout);
      $element.bind('mouseup', mouseup);
      $element.bind('touchstart', touchstart);
      $element.bind('touchmove', touchmove);
      $element.bind('touchend', touchend);
    }

    var state=null; // line|arcleft,arcright, up|down
    var ctx=null;

    // == utility functions ==

    // could be something else...
    var getProp = function(){
      return 0;
      return parseInt($element.text());
    };
    var setProp = function(p){
      //console.log('setProp',p);
      return;
      // set the new prop
      //if (isNAN)...
      var r=1/plugin.settings.round;
      p=Math.round(p*r)/r;
      $element.text(p);
    };
    // the is the value the touch-drag session is tracking
    var trackTouch = function (e) {
      return {
        x:e.originalEvent.touches[0]['pageX'],
        y:e.originalEvent.touches[0]['pageY']
      };
    };
    var trackMouse = function (e) {
      return {
        x:e['pageX'],
        y:e['pageY']
      }
    };
    // this is the new value we are 'emiting'
    var updatedProp = function(ctx){
      var dx = (ctx.l.x - ctx.v.x);
      var dy = (ctx.l.y - ctx.v.y);
      var mag = Math.sqrt(dx*dx+dy*dy);
      mag = Math.max(0,Math.min(mag,plugin.settings.range));
      var sign= (Math.abs(dx)>Math.abs(dy))
        ? (dx<0?-1:1)  // positive is right
        : (dy<0?1:-1); // positive is up

      var newProp = ctx.p + sign * mag * plugin.settings.scale;
      return newProp;
    };

    var setState = function(canvas){
      if (ctx.state) return;
      var off = $element.offset();
      var origin = {x:off.left,y:off.top};
      var poi = {x:(ctx.v.x-origin.x),y:(ctx.v.y-origin.y)};
      var row=Math.floor(poi.y/canvas.height*3);
      var col=Math.floor(poi.x/canvas.width*3);
      console.log('row,col',row,col,poi,canvas);
      var state = [[
         // top row
         ['lthumb','down'],
         ['vert','down'],
         ['rthumb','down']
       ],[
       // middle row
         ['horiz','up'],
         ['edit','none'],
         ['horiz','down']
       ],[
       // bottom row
         ['rthumb','up'],
         ['vert','up'],
         ['lthumb','up']
      ]][row][col];
      console.log('setting state',state);
      return state;
    }
    var map01 = function(pos01,canvas){
      var w=canvas.width,h=canvas.height;
      return {
        x:pos01.x*w,
        y:pos01.y*h
      };
    }
    var gridLine = function(x,y,cctx,canvas){
      var from = map01({x:x||0, y:y||0},canvas);
      var to   = map01({x:x||1, y:y||1},canvas);
      cctx.moveTo(from.x,from.y);
      cctx.lineTo(to.x,to.y);
    }
    function norm(p,scale){
      var l = Math.sqrt(p.x*p.x+p.y*p.y);
      return {x:p.x/l*scale,y:p.y/l*scale};
    }
    var arcLines = function(poi,cctx,canvas) {
      // cctx.arc(x,y,radius,startAngle,endAngle, clockwise);
      var pi=Math.PI;
      var radius = Math.min(canvas.width,canvas.height);
      var c,delta;

      cctx.strokeStyle = 'yellow';
      cctx.beginPath();
      c={x:0,y:radius};
      cctx.arc(c.x,c.y,radius,-pi/2,0,false);
      cctx.stroke();

      cctx.beginPath();
      cctx.moveTo(c.x,c.y);
      delta={x:poi.x-c.x,y:poi.y-c.y};
      delta = norm(delta,radius);
      cctx.lineTo(c.x+delta.x,c.y+delta.y);
      cctx.stroke();      
      cctx.fillStyle = 'yellow';
      cctx.beginPath();
      cctx.arc(c.x+delta.x,c.y+delta.y,5,0,2*pi,false);
      cctx.fill();
      

      cctx.strokeStyle = 'orange';
      cctx.beginPath();
      c={x:radius,y:radius};
      cctx.arc(c.x,c.y,radius,-pi,-pi/2,false);
      cctx.stroke();

      cctx.beginPath();
      cctx.moveTo(c.x,c.y);
      delta={x:poi.x-c.x,y:poi.y-c.y};
      delta = norm(delta,radius);
      cctx.lineTo(c.x+delta.x,c.y+delta.y);
      cctx.stroke();      
      cctx.fillStyle = 'orange';
      cctx.beginPath();
      cctx.arc(c.x+delta.x,c.y+delta.y,5,0,2*pi,false);
      cctx.fill();


      cctx.strokeStyle = 'cyan';
      cctx.beginPath();
      gridLine(1/2,null,cctx,canvas);
      cctx.stroke();
      cctx.fillStyle = 'cyan';
      cctx.beginPath();
      cctx.arc(canvas.width/2,poi.y,5,0,2*pi,false);
      cctx.fill();

      cctx.strokeStyle = 'magenta';
      cctx.beginPath();
      gridLine(null,1/2,cctx,canvas);
      cctx.stroke();
      cctx.fillStyle = 'magenta';
      cctx.beginPath();
      cctx.arc(poi.x,canvas.height/2,5,0,2*pi,false);
      cctx.fill();
      
      // blue dot
      cctx.fillStyle = 'rgba(0,0,255,.5)';
      cctx.beginPath();
      cctx.arc(poi.x,poi.y,20,0,2*pi,false);
      cctx.fill();
      
    }
    var drawGrid = function(){
      var canvas = $element[0];
      setState(canvas);
      var off = $element.offset();
      var origin = {x:off.left,y:off.top};
      if (canvas.getContext) {  
        var w=canvas.width,h=canvas.height;
        var poi = {x:(ctx.l.x-origin.x),y:(ctx.l.y-origin.y)};
        console.log('poi',poi.x,poi.y,ctx.state);
        var cctx = canvas.getContext("2d");
        cctx.save();
        cctx.clearRect(0,0,w,h);
        
        cctx.strokeStyle = '#777';
        cctx.beginPath();
        gridLine(1/3,null,cctx,canvas);
        gridLine(2/3,null,cctx,canvas);
        gridLine(null,1/3,cctx,canvas);
        gridLine(null,2/3,cctx,canvas);
        cctx.stroke();

        arcLines(poi,cctx,canvas);
        
        cctx.strokeStyle = 'red';
        cctx.beginPath();
        cctx.moveTo(0,0);
        cctx.lineTo(poi.x,poi.y);
        //cctx.stroke();

        cctx.restore();
        
      } else {
        console.log('no context');
      }
      
    }

    // == common event handlers ==
    var dragstart = function(valueToTrack) {
      console.log('start:v ',JSON.stringify(valueToTrack));
      ctx = {
        t: +new Date, // stamp for drag start
        v: valueToTrack,        // the initial touch-event value we are tracking
        l: valueToTrack,        // the last known touch-event value
        p: getProp(), // initial property value (touchstart)
      };
      //console.log('dragstart',ctx);
      drawGrid();
    };

    var dragmove = function(valueToTrack) {
      if (!ctx) return; // will happen when mousemove without mousedown first
      console.log('move:v ',JSON.stringify(valueToTrack));

      // update the context
      ctx.l = valueToTrack;
      // update the ui
      setProp(updatedProp(ctx));
      drawGrid();
    };

    // snap back or click
    var dragend = function() {
      if (!ctx) return; // should never happen
      console.log('end:v ',JSON.stringify(ctx.l));

      var elapsed=new Date()-ctx.t;
      // consider this a click
      if (elapsed<plugin.settings.swipeThreshHoldMS){
        //snapBack(ctx.p,'away');
        console.log('swipe',updatedProp(ctx));
      } else {
        setProp(updatedProp(ctx));
      }
      //console.log('dragend',ctx);      
      ctx=null;
    }

    // == event callbacks ==
    var mousedown = function(e) {
      var valueToTrack = trackMouse(e);
      dragstart(valueToTrack);
    }

    var mousemove = function(e) {
      var valueToTrack = trackMouse(e);
      dragmove(valueToTrack);
    }

    var mouseout = function(e) {
      mouseup();
    }

    var mouseup = function(e) {
      dragend();
    }

    var touchstart = function(e) {
      var valueToTrack = trackTouch(e);
      dragstart(valueToTrack);
    };

    var touchmove = function(e) {
      var valueToTrack = trackTouch(e);
      dragmove(valueToTrack);
    };

    var touchend = function(e) {
      	dragend();
    };
       
    // call our "constructor" method
    plugin.init();

  }

  // add the plugin to the jQuery.fn object
  $.fn.arctouch = function(options) {
    // iterate through the DOM elements we are attaching the plugin to
    return this.each(function() {
      // if plugin has not already been attached to the element
      if (undefined == $(this).data('arctouch')) {
        var plugin = new $.arctouch(this, options);
        $(this).data('arctouch', plugin);
      }
    });
  }
})(jQuery);
