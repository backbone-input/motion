!function(t,e,o,n,i){var r="undefined"!=typeof i&&"undefined"!=typeof i.View,a=r?i.View:n.View,c=a.prototype.params||new n.Model;c.set({accelerometer:{x:0,y:0,z:0}});var s=a.extend({options:{monitor:[],motion:{states:["accelerometer","rift"]}},params:c,state:{},initialize:function(t){var e=o.inArray("motion",this.options.monitor);return e&&this._monitorMotion(),a.prototype.initialize.call(this,t)},_monitorMotion:function(){if(this.el){var t=this,e=this.options.motion.states;o.inArray("accelerometer",e)&&(window.DeviceOrientationEvent?window.addEventListener("deviceorientation",function(e){t._onMotionAccelerometer([e.alpha,e.beta,e.gamma])},!0):window.DeviceMotionEvent?window.addEventListener("devicemotion",function(e){t._onMotionAccelerometer([2*e.acceleration.x,2*e.acceleration.y,2*e.acceleration.z])},!0):window.addEventListener("MozOrientation",function(e){t._onMotionAccelerometer([50*e.orientation.x,50*e.orientation.y,50*e.orientation.z])},!0)),o.inArray("rift",e)&&(d.script("//rawgit.com/Instrument/oculus-bridge/master/web/build/OculusBridge.min.js"),setTimeout(function(){var e=new OculusBridge({onOrientationUpdate:function(e){t._onOrientationUpdate(e)}});e.connect()},1e3))}},onMotionAccelerometer:function(){},onOrientationUpdate:function(){},_onMotionAccelerometer:function(t){var e=o.inArray("motion",this.options.monitor)&&o.inArray("accelerometer",this.options.motion.states);e&&(o.inDebug()&&console.log(" accelerometer motion detected",t),this.params.set({accelerometer:{x:t[0],y:t[1],z:t[2]}}),this.trigger("accelerometer",t),this.onMotionAccelerometer(t))},_onOrientationUpdate:function(t){var e=o.inArray("motion",this.options.monitor)&&o.inArray("rift",this.options.motion.states);e&&(o.inDebug()&&console.log("rift motion detected",t),this.params.set({rift:t}),this.trigger("rift",t),this.onOrientationUpdate(t))}});o.mixin({inArray:function(t,e){return e.indexOf(t)>-1},inDebug:function(){return"undefined"!=typeof DEBUG&&DEBUG}});var d=t.c||{};d.script=d.script||function(t,o){if(o=o||{},t=t||!1,o.id=o.id||!1,o.async=o.async||!1,t&&(!o.id||!e.getElementById(o.id))){var n="script",i=e.createElement(n);t=t.replace(/^http:|^https:/,""),i.type="text/javascript",o.id&&(i.id=o.id),i.async=o.async,i.src=("https:"==location.protocol?"https:":"http:")+t;var r=e.getElementsByTagName(n)[0];r.parentNode.insertBefore(i,r)}},"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=s:"function"==typeof define&&define.amd&&define([],function(){return s}),"object"==typeof window&&"object"==typeof window.document&&(r&&(i.View=s,i.Input=i.Input||{},i.Input.Motion=s,window.APP=i),n.View=s,n.Input=n.Input||{},n.Input.Motion=s,window.Backbone=n)}(this.window,this.document,this._,this.Backbone,this.APP);