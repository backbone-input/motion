
	var Motion = View.extend({

		options: {
			monitor: [], // add "motion" to initiate monitoring
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
				accelerometer : {
					x : data[0],
					y : data[1],
					z : data[2]
				}
			});
			this.trigger("accelerometer", data);
			this.onMotionAccelerometer( data );
		}

	});

