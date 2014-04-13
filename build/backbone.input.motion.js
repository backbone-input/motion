/**
 * @name backbone.input.motion
 * Motion event bindings for Backbone views
 *
 * Version: 0.1.0 (Sun, 13 Apr 2014 10:33:04 GMT)
 * Homepage: https://github.com/backbone-input/motion
 *
 * @author makesites
 * Initiated by: Makis Tracend (@tracend)
 *
 * @cc_on Copyright © Makesites.org
 * @license MIT license
 */

(function(w, _, Backbone, APP) {

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
			monitor: View.prototype.options.monitor || [], // add "motion" to initiate monitoring
			motion: {
				states: ["accelerometer"] // limit the monitored actions by defining a subset
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
		},

		// public
		onMotionAccelerometer: function( data ){

		},

		// private
		_onMotionAccelerometer: function( data ) {
			// prerequisite
			var monitor = _.inArray("motion", this.options.monitor) && _.inArray("accelerometer", this.options.motion.states);
			if( !monitor ) return;
			//if (e.stopPropagation) e.stopPropagation();
			if( _.inDebug() ) console.log("motion detected", e);
			// save data
			this.params.set({
				motion : {
					x : data[0],
					y : data[1],
					z : data[2]
				}
			});
			this.trigger("accelerometer", data);
			this.onMotionAccelerometer( data );
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


})(this.window, this._, this.Backbone, this.APP);
