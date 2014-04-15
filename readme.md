# Backbone Input: Motion

Monitor motion movements in your views


## Features

Supporting these interfaces:

* Accelerometer ( using [window.DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) )
* Oculus Rift ( using the [Oculus bridge](https://github.com/Instrument/oculus-bridge) )


## Install 

Using bower
```
bower install backbone.input.motion
```


## Usage

Most events can be setup through the view's ```options```. There are two main attributes: 

* _monitor_ (array) : defines the devices that will be monitored. Available options: "accelerometer", "rift"
* _states_ (object) : picks the events to monitor for ever device. All supported devices have their own sub-object


## Credits

Initiated by Makis Tracend ( [@tracend](http://github.com/tracend) )

Distributed through [Makesites.org](http://makesites.org/)

Released under the [MIT license](http://makesites.org/licenses/MIT)

