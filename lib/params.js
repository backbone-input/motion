
// extend existing params
var params = View.prototype.params || new Backbone.Model();

// defaults
params.set({
	accelerometer: { x: 0, y: 0, z: 0 }
});
