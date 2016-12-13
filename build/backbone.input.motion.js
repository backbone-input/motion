/**
 * @name backbone.input.motion
 * Motion event bindings for Backbone views
 *
 * Version: 0.3.1 (Tue, 13 Dec 2016 00:13:45 GMT)
 * Homepage: https://github.com/backbone-input/motion
 *
 * @author makesites
 * Initiated by Makis Tracend (@tracend)
 *
 * @cc_on Copyright © Makesites.org
 * @license MIT license
 */

(function (lib) {

	//"use strict";

	// Support module loaders
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define('backbone.input.motion', ['jquery', 'underscore', 'backbone'], lib);
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		// - getting the available query lib
		var $ = window.jQuery || window.Zepto || window.vQuery;
		lib($, window._, window.Backbone);
	}

}(function ($, _, Backbone) {

	// support for Backbone APP() view if available...
	var APP = APP || window.APP || null;
	var isAPP = ( APP !== null );
	var View = ( isAPP && typeof APP.View !== "undefined" ) ? APP.View : Backbone.View;



// extend existing params
var params = View.prototype.params || new Backbone.Model();

// defaults
params.set({
	accelerometer: { x: 0, y: 0, z: 0 }
});


// extend existing params
var state = View.prototype.params || new Backbone.Model();

// defaults
state.set({
});


	var Motion = View.extend({

		options: {
			monitor: [], // add "motion" to initiate monitoring
			motion: {
				states: ["accelerometer", "rift"] // available options - enabled by updating this.state
			}
		},

		params: params.clone(),

		state : state.clone(),
/*
		events: _.extend({}, View.prototype.events, {

		}),
*/
		//
		initialize: function( options ){
			// fallbacks
			options = options || {};
			// extending options
			this.options = _.extend({}, this.options, options );
			// check monitor options
			var monitor = this.options.monitorMotion || _.inArray("motion", this.options.monitor);
			if( monitor ){
				this.monitorMotion();
			}

			return View.prototype.initialize.call( this, options );
		},

		monitorMotion: function(){
			// fallback
			if(typeof state == "undefined") state = true;

			if( state ){
				this._monitorMotionOn();
				// broadcast event
				this.trigger('monitor-motion-on');
			} else {
				this._monitorMotionOff();
				// broadcast event
				this.trigger('monitor-motion-off');
			}
		},

		_monitorMotionOn: function(){
			// prerequisite
			if( !this.el ) return;
			// variables
			var self = this;
			var states = this.options.motion.states || [];

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
					self._OculusBridge = new OculusBridge({
						"onOrientationUpdate" : function(quatValues) { self._onOrientationUpdate( quatValues ); }
					});
					self._OculusBridge.connect();
				}, 1000);
			}
			// update state 
			this.state.set('motion', states);
		},

		_monitorMotionOff: function(){

			var states = this.state.get('motion') || [];
			
			if( _.inArray("accelerometer", states) ){
				if (window.DeviceOrientationEvent) {
					window.removeEventListener("deviceorientation", function ( event ) {
						self._onMotionAccelerometer([event.alpha, event.beta, event.gamma]);
					}, true);
				} else if (window.DeviceMotionEvent) {
					window.removeEventListener('devicemotion', function ( event ) {
						self._onMotionAccelerometer([event.acceleration.x * 2, event.acceleration.y * 2, event.acceleration.z * 2 ]);
					}, true);
				} else {
					window.removeEventListener("MozOrientation", function ( event ) {
						self._onMotionAccelerometer([event.orientation.x * 50, event.orientation.y * 50, event.orientation.z * 50]);
					}, true);
				}
			}
			if( _.inArray("rift", states) ){
				if( this._OculusBridge ) this._OculusBridge.disconnect();
			}
			// remove state 
			this.state.set('motion', false);
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
	var c = c || window.c || {};
	var d = document || {};
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



	// update Backbone namespace regardless
	Backbone.Input = Backbone.Input ||{};
	Backbone.Input.Motion = Motion;
	// update APP namespace
	if( isAPP ){
		APP.Input = APP.Input || {};
		APP.Input.Motion = Motion;
	}

	// If there is a window object, that at least has a document property
	if( typeof window === "object" && typeof window.document === "object" ){
		window.Backbone = Backbone;
		// update APP namespace
		if( isAPP ){
			window.APP = APP;
		}
	}

	// Support module loaders
	return Motion;

}));
