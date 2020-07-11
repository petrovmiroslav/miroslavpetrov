'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { ClientDevice };

class ClientDevice {
	constructor (State) {
		this.state = State;
		this.state.clientDevice = this;

		this.windowResizeHandlerTimeout = null;
		this.windowResizeHandlersQueue = {};
		this.windowOrientationChangeHandlerTimeout = null;

		this.main = null;
		this.hiScreen = null;
		this.mobileBGFullscreenVideo = null;
		this.desktopBGFullscreenVideo = null;
	}
	
	init () {
		this.main = document.querySelector('.main');
		this.hiScreen = document.querySelector('.hiScreen');
		this.mobileBGFullscreenVideo = document.querySelector('.parallax__bg-fullscreen-video_mobile-view');
		this.desktopBGFullscreenVideo = document.querySelector('.parallax__bg-fullscreen-video_desktop-view');

		this.state.deviceIsTouchscreen = this.detectTouchScreen();
		this.detectSupportsPassive();

		this.addWindowResizeListener();
		/*this.addWindowOrientationChangeListener();*/

		this.selectVideoBGFullscreen();
		this.initParallaxIfClientDeviceIsDesktop();
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
	detectSupportsPassive () {
		try {
		  let opts = Object.defineProperty({}, 'passive', {
		    get: () => {
		      		this.state.passiveListener = {passive: true};
		    		}
		  });
		  window.addEventListener("testPassive", null, opts);
		  window.removeEventListener("testPassive", null, opts);
		} catch (e) {console.log('SUPPORTSPASSIVE',e)}
	}

	addWindowResizeListener () {
		window.addEventListener('resize', this.setWindowResizeHandlerTimeout.bind(this));
	}
	setWindowResizeHandlerTimeout () {
		window.clearTimeout(this.windowResizeHandlerTimeout);
		this.windowResizeHandlerTimeout = window.setTimeout(this.windowResizeHandlerFunc.bind(this), 100);
	}
	windowResizeHandlerFunc () {
		this.state.windowWidth = document.documentElement.clientWidth;//window.innerWidth;
  	this.state.windowHeight = document.documentElement.clientHeight;//window.innerHeight;

  	for (let func in this.windowResizeHandlersQueue) {
  		if (typeof this.windowResizeHandlersQueue[func] === 'function') {
  			this.windowResizeHandlersQueue[func]();
  		}
  	}
	}

	addWindowOrientationChangeListener () {
		window.addEventListener('orientationchange', this.setWindowOrientationChangeHandlerTimeout.bind(this));
	}
	setWindowOrientationChangeHandlerTimeout () {
		window.clearTimeout(this.windowOrientationChangeHandlerTimeout);
		this.windowOrientationChangeHandlerTimeout = window.setTimeout(this.windowOrientationChangeHandlerFunc.bind(this), 100);
	}
	windowOrientationChangeHandlerFunc () {
		void(document.querySelector('html').offsetHeight);
		void(document.body.offsetHeight);
		void(this.main.offsetHeight);
		void(this.hiScreen.offsetHeight);
	}

	selectVideoBGFullscreen () {
		if (this.state.deviceIsTouchscreen) {
			this.mobileBGFullscreenVideo.classList.remove('hidden');
			this.desktopBGFullscreenVideo.classList.add('hidden');
		}
	}
	initParallaxIfClientDeviceIsDesktop () {
		if (!this.state.deviceIsTouchscreen) {
			this.main.querySelector('.parallax__scrollable-container').classList.add('parallax__scrollable-container_desktop-view');
			this.main.querySelectorAll('.parallax__group').forEach(function (el) {
				el.classList.add('parallax__group_desktop-view');
			});
			this.main.querySelectorAll('.parallax__layer--back').forEach(function (el) {
				el.classList.add('.parallax__layer--back_desktop-view');
			});
		}
	}
}