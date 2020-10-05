export { State };

class State {
	constructor () {
		this.windowWidth = document.documentElement.clientWidth;//window.innerWidth;
  	this.windowHeight = document.documentElement.clientHeight;//window.innerHeight;
  	this.deviceIsTouchscreen = false;
  	this.passiveListener = false;

		this.preloaderIsOff = false;
		this.slide1IsActive = false;
		this.menuIsOpen = false;
		this.parallaxScrollUPDATE = null;
		this.angleGradientBGIsActive = false;
		this.angleGradientBGON = null;
		this.angleGradientBGOFF = null;
		this.hiBgImageTransformListener = false;
		this.hiBgImageTransformON = null;
		this.hiBgImageTransformOFF = null;
		this.fullscreenSliderON = null;
    this.fullscreenSliderOFF = null;
    this.cube3dIsActive = false;
    this.cube3dCreate = null;

		this.hiBgLazyImageIsLoaded = false;
		this.hiBgLazyImageIsTargetTransform = false;
		this.bgVideoIsOFF = true;
	}

	init () {
		
	}

	roundTo (numberToRound, digits) {
		return +numberToRound.toFixed(digits);
	}

}

