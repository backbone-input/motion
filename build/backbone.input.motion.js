/**
 * @name backbone.input.motion
 * Motion event bindings for Backbone views
 *
 * Version: 0.0.1 (Wed, 02 Apr 2014 03:41:17 GMT)
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






	// fallbacks
	if( _.isUndefined( Backbone.Input ) ) Backbone.Input = {};
	Backbone.Input.Motion = Motion;

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
			APP.Input.Motion = Backbone.Input.Motion;
			// save namespace
			window.APP = APP;
		} else {
			// update Backbone namespace
			Backbone.View = Motion;
		}
		// save Backbone namespace either way
		window.Backbone = Backbone;
	}


})(this.window, this._, this.Backbone, this.APP);
