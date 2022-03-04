export class State {
	constructor () {
		this.windowWidth = document.documentElement.clientWidth;
  	this.windowHeight = document.documentElement.clientHeight;
  	this.deviceIsTouchscreen =
  	this.passiveListener =
  	this.transitionEventSupport = false;

		this.preloaderIsOff =
		this.slide1IsActive =
		this.menuIsOpen = false;
		this.hiBgImageMini =
		this.hiBgImageBlured = true;
		this.hiBgImageTransform = [0,0];
		this.parallaxScrollUPDATE = {};
		this.angleGradientBGIsActive = false;
		this.angleGradientBGON = {};
		this.angleGradientBGOFF = {};
		this.hiBgImageTransformON = {};
		this.hiBgImageTransformOFF = {};
		this.fullscreenSliderON = {};
    this.fullscreenSliderOFF = {};
    this.fullscreenSliderPause = false;
    this.paralaxScrollTickingTimeout = 0;
    this.cube3dBlockSlider = false;
    this.cube3dIsActive = false;
    this.cube3dCreate = {};

		this.hiBgLazyImageIsLoaded =
		this.hiBgLazyImageIsTargetTransform = false;
		this.bgVideoIsOFF = true;

		this.static = {
			hiBg: {
				mini: '',
				max: 'img/hiScreenBg.jpg'
			},
			bGVideo: [
				{ src: 'img/videoBG-1280.webm',
				  type: 'video/webm'
				},
				{ src: 'img/videoBG-1280.mp4',
				  type: 'video/mp4'
				}
			],
			plants: {
				back: 'img/plant-bg_mini.png',
				base: 'img/plant-base_mini.png',
				fore: 'img/plant-fore_mini.png'
			}
		}
	}

	roundTo (numberToRound, digits) {
		return +numberToRound.toFixed(digits);
	}
}

