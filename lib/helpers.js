
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
	c.script == c.script || function( url, attr ){

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