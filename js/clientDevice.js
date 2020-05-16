'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { ClientDevice };

class ClientDevice {
	constructor (State) {
		this.state = State;

		this.windowResizeHandlerTimeout = null;
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

		this.addWindowResizeListener();
		/*this.addWindowOrientationChangeListener();*/

		this.selectVideoBGFullscreen();
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

	addWindowResizeListener () {
		window.addEventListener('resize', this.setWindowResizeHandlerTimeout.bind(this));
	}
	setWindowResizeHandlerTimeout () {
		window.clearTimeout(this.windowResizeHandlerTimeout);
		this.windowResizeHandlerTimeout = window.setTimeout(this.windowResizeHandlerFunc.bind(this), 100);
	}
	windowResizeHandlerFunc () {
		this.state.windowWidth = window.innerWidth;
  	this.state.windowHeight = window.innerHeight;
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
}