export { State };

class State {
	constructor () {
		this.windowWidth = window.innerWidth;
  	this.windowHeight = window.innerHeight;
  	this.deviceIsTouchscreen = false;

		this.preloaderIsOff = false;
		this.slide1IsActive = false;
		this.hiBgImageTransformListener = false;
		this.hiBgImageTransformON = null;
		this.hiBgImageTransformOFF = null;

		this.hiBgLazyImageIsLoaded = false;
		this.hiBgLazyImageIsTargetTransform = false;

		this.windowResizeHandlerTimeout = null;
	}

	init () {
		this.addWindowResizeHandler();
	}

	addWindowResizeHandler () {
		window.addEventListener('resize', this.setWindowResizeHandlerTimeout.bind(this));
	}
	setWindowResizeHandlerTimeout () {
		window.clearTimeout(this.windowResizeHandlerTimeout);
		this.windowResizeHandlerTimeout = window.setTimeout(this.windowResizeHandlerFunc.bind(this), 100);
	}
	windowResizeHandlerFunc () {
		this.windowWidth = window.innerWidth;
  	this.windowHeight = window.innerHeight;
	}

}

