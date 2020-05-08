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
		this.deviceIsTouchscreen = this.detectTouchScreen();
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

	detectTouchScreen () {
		let hasTouchScreen = false;
		if ("maxTouchPoints" in navigator) { 
		    hasTouchScreen = navigator.maxTouchPoints > 0;
		} else {
			if ("msMaxTouchPoints" in navigator) {
		    hasTouchScreen = navigator.msMaxTouchPoints > 0; 
			} else {
				var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
				if (mQ && mQ.media === "(pointer:coarse)") {
		        hasTouchScreen = !!mQ.matches;
		    } else {
		    	if ('orientation' in window) {
		        hasTouchScreen = true; // deprecated, but good fallback
			    } else {
			    	var UA = navigator.userAgent;
		        hasTouchScreen = (
		            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
		            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
		        );
			    }
		    }
			}
		}
		return hasTouchScreen;
	}
}

