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
		window.requestAnimationFrame(this.windowResize.bind(this));
	}
	windowResize () {
		try {
			this.state.windowWidth = document.documentElement.clientWidth;//window.innerWidth;
	  	this.state.windowHeight = document.documentElement.clientHeight;//window.innerHeight;

	  	for (let func in this.windowResizeHandlersQueue) {
	  		if (typeof this.windowResizeHandlersQueue[func] === 'function') {
	  			this.windowResizeHandlersQueue[func]();
	  		}
	  	}
		} catch (e) {
			this.state.errHandler(e);
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
			/*this.mobileBGFullscreenVideo.classList.remove('hidden');
			this.desktopBGFullscreenVideo.classList.add('hidden');*/
			this.mobileBGFullscreenVideo.classList.remove('hidden')
			this.desktopBGFullscreenVideo.remove();
		} else {
			this.mobileBGFullscreenVideo.remove();
		}
	}
	initParallaxIfClientDeviceIsDesktop () {
		if (!this.state.deviceIsTouchscreen) {
			this.main.querySelector('.parallax__scrollable-container').classList.add('parallax__scrollable-container_desktop-view');
			this.main.querySelectorAll('.parallax__group').forEach(function (el) {
				el.classList.add('parallax__group_desktop-view');
			});
			this.main.querySelectorAll('.parallax__layer--back').forEach(function (el) {
				el.classList.add('parallax__layer--back_desktop-view');
			});
			this.main.querySelectorAll('.parallax__layer--fore').forEach(function (el) {
				el.classList.add('parallax__layer--fore_desktop-view');
			});
			this.main.querySelector('.menu__emailSection').classList.remove('menu__emailSection_menuBarFix');

			document.getElementById('group1').classList.add('group1_desktop-view');
			document.getElementById('group1').classList.remove('parallax__group_desktop-view');
			this.main.querySelector('.cube3d').classList.remove('cube3d_mobileView');
			document.getElementById('group2').classList.add('parallax__videoContainer');
			document.getElementById('group2').classList.remove('parallax__group_desktop-view');
			this.main.querySelector('.videoDescription').classList.add('videoDescription_desktop-view');
			//document.getElementById('group3').classList.remove('parallax__group_desktop-view');
			//this.main.querySelector('.header__text_certification').classList.add('will-change');

			document.getElementById('group4').classList.remove('parallax__group_desktop-view');
			//this.main.querySelector('.header__text_portfolio').classList.add('will-change');

			this.main.querySelector('.contactWithMe').classList.remove('contactWithMe_mobileView');
			document.getElementById('wrapperMenuButton').classList.add('menuButton_desktop-view');
			

			let plantContainerBase = this.main.querySelector('.certification__plantParallaxImg_base'),
					plantContainerFore = this.main.querySelector('.certification__plantParallaxImg_fore');
			plantContainerBase.classList.remove('hidden');		
			plantContainerBase.setAttribute('src', '../img/plant-base.png');

			plantContainerFore.classList.remove('hidden');
			plantContainerFore.setAttribute('src', '../img/plant-fore.png');
			plantContainerBase = plantContainerFore = null;
		}
	}
}