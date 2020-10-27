'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { ClientDevice };

class ClientDevice {
	constructor (State) {
		this.state = State;
		this.state.clientDevice = this;

		this.windowResizeHandlerTimeout = 0;
		this.windowResizeHandlersQueue = {};

		this.main = {};
		this.hiScreen = {};
		this.mobileBGFullscreenVideo = {};
		this.desktopBGFullscreenVideo = {};
	}
	
	init () {
		this.main = document.querySelector('.main');
		this.hiScreen = document.querySelector('.hiScreen');
		this.mobileBGFullscreenVideo = document.querySelector('.parallax__bg-fullscreen-video_mobile-view');
		this.desktopBGFullscreenVideo = document.querySelector('.parallax__bg-fullscreen-video_desktop-view');

		this.state.deviceIsTouchscreen = this.detectTouchScreen();
		this.detectSupportsPassive();
		this.detectSupportAnimationEvent();
		this.addWindowResizeListener();
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
		        hasTouchScreen = true;
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
		console.log('TOUCHSCEEN?---',hasTouchScreen);
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
		} catch (e) {this.state.errHandler(e);}
	}

	detectSupportAnimationEvent () {
		let el = document.createElement('div');
    this.state.transitionEventSupport = ('ontransitionend' in el);
    if (!this.state.transitionEventSupport) {
      el.setAttribute('transitionend', 'return;');
      this.state.transitionEventSupport = typeof el['transitionend'] == 'function';
    }
    el = null;
	}

	addWindowResizeListener () {
		window.addEventListener('resize', this.setWindowResizeHandlerTimeout.bind(this));
	}
	setWindowResizeHandlerTimeout () {
		window.clearTimeout(this.windowResizeHandlerTimeout);
		this.windowResizeHandlerTimeout = window.setTimeout(this.windowResizeHandlerFunc.bind(this), 100);
	}
	windowResizeHandlerFunc () {
		window.requestAnimationFrame(this.windowResize.bind(this));
	}
	windowResize () {
		try {
			this.state.windowWidth = document.documentElement.clientWidth;
	  	this.state.windowHeight = document.documentElement.clientHeight;

	  	for (let func in this.windowResizeHandlersQueue) {
	  		typeof this.windowResizeHandlersQueue[func] === 'function' && this.windowResizeHandlersQueue[func]();
	  	}
		} catch (e) {
			this.state.errHandler(e);
		}
	}

	selectVideoBGFullscreen () {
		if (!this.state.deviceIsTouchscreen) return this.mobileBGFullscreenVideo.remove();
		this.mobileBGFullscreenVideo.classList.remove('hidden')
		this.desktopBGFullscreenVideo.remove();
	}
	initParallaxIfClientDeviceIsDesktop () {
		if (this.state.deviceIsTouchscreen) return;
		this.main.querySelector('.parallax__scrollable-container').classList.add('parallax__scrollable-container_desktop-view');
		this.main.querySelector('.menu__emailSection').classList.remove('menu__emailSection_menuBarFix');
		document.getElementById('group1').classList.add('group1_desktop-view');
		this.main.querySelector('.cube3d').classList.remove('cube3d_mobileView');
		document.getElementById('group2').classList.add('parallax__videoContainer');
		this.main.querySelector('.videoDescription').classList.add('videoDescription_desktop-view');
		document.getElementById('group3').classList.add('parallax__group_desktop-view');
		this.main.querySelector('.contactWithMe').classList.remove('contactWithMe_mobileView');
		document.getElementById('wrapperMenuButton').classList.add('menuButton_desktop-view');
	}
}