/**
 * @name backbone.input.motion
 * Motion event bindings for Backbone views
 *
 * Version: 0.1.0 (Sun, 13 Apr 2014 22:34:21 GMT)
 * Homepage: https://github.com/backbone-input/motion
 *
 * @author makesites
 * Initiated by: Makis Tracend (@tracend)
 *
 * @cc_on Copyright © Makesites.org
 * @license MIT license
 */

(function(w, d, _, Backbone, APP) {

	// support for Backbone APP() view if available...
	var isAPP = ( typeof APP !== "undefined" && typeof APP.View !== "undefined" );
	var View = ( isAPP ) ? APP.View : Backbone.View;



// extend existing params
var params = View.prototype.params || new Backbone.Model();

// defaults
params.set({
	accelerometer: { x: 0, y: 0, z: 0 }
});


	var Motion = View.extend({

		options: {
			monitor: [], // add "motion" to initiate monitoring
			motion: {
				states: ["accelerometer", "rift"] // limit the monitored actions by defining a subset
			}
		},

		params: params,

		state : {
		},
/*
		events: _.extend({}, View.prototype.events, {

		}),
*/
		//
		initialize: function( options ){

			var monitor = _.inArray("motion", this.options.monitor);
			if( monitor ){
				this._monitorMotion();
			}

			return View.prototype.initialize.call( this, options );
		},

		_monitorMotion: function(){
			// prerequisite
			if( !this.el ) return;
			// variables
			var self = this;
			var states = this.options.motion.states;

			if( _.inArray("accelerometer", states) ){
				if (window.DeviceOrientationEvent) {
					window.addEventListener("deviceorientation", function ( event ) {
						self._onMotionAccelerometer([event.alpha, event.beta, event.gamma]);
					}, true);
				} else if (window.DeviceMotionEvent) {
					window.addEventListener('devicemotion', function ( event ) {
						self._onMotionAccelerometer([event.acceleration.x * 2, event.acceleration.y * 2, event.acceleration.z * 2 ]);
					}, true);
				} else {
					window.addEventListener("MozOrientation", function ( event ) {
						self._onMotionAccelerometer([event.orientation.x * 50, event.orientation.y * 50, event.orientation.z * 50]);
					}, true);
				}
			}
			if( _.inArray("rift", states) ){
				c.script("//rawgit.com/Instrument/oculus-bridge/master/web/build/OculusBridge.min.js");
				// allow the script to load (use callback instead...)
				setTimeout(function(){
					var bridge = new OculusBridge({
						"onOrientationUpdate" : function(quatValues) { self._onOrientationUpdate( quatValues ); }
					});
					bridge.connect();
				}, 1000);
			}
		},

		// public
		onMotionAccelerometer: function( data ){

		},

		onOrientationUpdate: function( data ){

		},

		// private
		_onMotionAccelerometer: function( data ) {
			// prerequisite
			var monitor = _.inArray("motion", this.options.monitor) && _.inArray("accelerometer", this.options.motion.states);
			if( !monitor ) return;
			//if (e.stopPropagation) e.stopPropagation();
			if( _.inDebug() ) console.log(" accelerometer motion detected", data);
			// save data
			this.params.set({
				accelerometer : {
					x : data[0],
					y : data[1],
					z : data[2]
				}
			});
			this.trigger("accelerometer", data);
			this.onMotionAccelerometer( data );
		},

		_onOrientationUpdate: function( data ){
			// prerequisite
			var monitor = _.inArray("motion", this.options.monitor) && _.inArray("rift", this.options.motion.states);
			if( !monitor ) return;
			//if (e.stopPropagation) e.stopPropagation();
			if( _.inDebug() ) console.log("rift motion detected", data);
			// save data (quad values)
			this.params.set({
				rift : data
			});
			this.trigger("rift", data);
			this.onOrientationUpdate( data );
		}

	});



	// Helpers

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	// helpers
	_.mixin({
		inArray: function(value, array){
			return array.indexOf(value) > -1;
		},
		// - Check if in debug mode (requires the existence of a global DEBUG var)
		// Usage: _.inDebug()
		inDebug : function() {
			return ( typeof DEBUG != "undefined" && DEBUG );
		}
	});

	// script loader
	// taken from: https://github.com/commons/common.js/blob/master/lib/c.script.js
	var c = w.c || {};
	c.script = c.script || function( url, attr ){

		//fallbacks
		attr = attr || {};
		url = url || false;
		attr.id = attr.id || false;
		attr.async = attr.async || false;
		// prerequisites
		if( !url ) return;
		if( attr.id && d.getElementById(attr.id) ) return;
		// variables
		var t = "script";
		var js = d.createElement(t);
		// clean url from protocol definition
		url = url.replace(/^http:|^https:/, "");
		// set attributes
		js.type = 'text/javascript';
		if( attr.id ) js.id = attr.id;
		js.async = attr.async;
		js.src = ("https:"==location.protocol?"https:":"http:")+ url;
		// place in DOM
		var s = d.getElementsByTagName(t)[0];
		s.parentNode.insertBefore(js, s);

	};


	// Support module loaders
	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = Motion;
	} else {
		// Register as a named AMD module, used in Require.js
		if ( typeof define === "function" && define.amd ) {
			define( [], function () { return Motion; } );
		}
	}
	// If there is a window object, that at least has a document property
	if ( typeof window === "object" && typeof window.document === "object" ) {
		// update APP namespace
		if( isAPP ){
			APP.View = Motion;
			APP.Input = APP.Input || {};
			APP.Input.Motion = Motion;
			// save namespace
			window.APP = APP;
		}
		// update Backbone namespace either way
		Backbone.View = Motion;
		Backbone.Input = Backbone.Input || {};
		Backbone.Input.Motion = Motion;
		// save Backbone namespace
		window.Backbone = Backbone;
	}


})(this.window, this.document, this._, this.Backbone, this.APP);
