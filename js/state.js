export { State };

class State {
	constructor () {
		this.windowWidth = window.innerWidth;
  	this.windowHeight = window.innerHeight;
  	this.deviceIsTouchscreen = false;

		this.preloaderIsOff = false;
		this.slide1IsActive = false;
		this.menuIsOpen = false;
		this.hiBgImageTransformListener = false;
		this.hiBgImageTransformON = null;
		this.hiBgImageTransformOFF = null;
		this.fullscreenSliderON = null;
    this.fullscreenSliderOFF = null;

		this.hiBgLazyImageIsLoaded = false;
		this.hiBgLazyImageIsTargetTransform = false;

	}

	init () {
		
	}

	roundTo (numberToRound, digits) {
		return +numberToRound.toFixed(digits);
	}

}

