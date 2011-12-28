// based on Stefan Gabos jquery boilerplate
// author: Daniel Lauzon
(function($) {
  $.touchtrack = function(element, options) {
    var plugin = this;

    var $element = $(element);  // reference to the jQuery version of DOM element the plugin is attached to

	  var defaults = {
      range: 100,
      scale:1,
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

    var ctx=null;

    // == utility functions ==

    // could be something else...
    var getProp = function(){
      return parseInt($element.text());
    };
    var setProp = function(p){
      // set the new prop
      //if (isNAN)...
      p=Math.round(p*10)/10;
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

    // == common event handlers ==
    var dragstart = function(valueToTrack) {
      ctx = {
        t: +new Date, // stamp for drag start
        v: valueToTrack,        // the initial touch-event value we are tracking
        l: valueToTrack,        // the last known touch-event value
        p: getProp(), // initial property value (touchstart)
      };
      //console.log('dragstart',ctx);
    };

    var dragmove = function(valueToTrack) {
      if (!ctx) return; // will happen when mousemove without mousedown first

      // update the context
      ctx.l = valueToTrack;
      // update the ui
      setProp(updatedProp(ctx));
    };

    // snap back or click
    var dragend = function() {
      if (!ctx) return; // should never happen

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
  $.fn.touchtrack = function(options) {
    // iterate through the DOM elements we are attaching the plugin to
    return this.each(function() {
      // if plugin has not already been attached to the element
      if (undefined == $(this).data('touchtrack')) {
        var plugin = new $.touchtrack(this, options);
        $(this).data('touchtrack', plugin);
      }
    });
  }
})(jQuery);
