
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
			var states = this.state.get('motion');

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
		},

		_monitorMotionOff: function(){

			var states = this.state.get('motion');
			
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
