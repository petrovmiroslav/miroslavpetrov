'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { ClientDevice };

class ClientDevice {
	constructor (State) {
		this.state = State;

		this.mobileBGFullscreenVideo = null;
		this.desktopBGFullscreenVideo = null;
	}
	
	init () {
		this.mobileBGFullscreenVideo = document.querySelector('.parallax__bg-fullscreen-video_mobile-view');
		this.desktopBGFullscreenVideo = document.querySelector('.parallax__bg-fullscreen-video_desktop-view');

		this.state.deviceIsTouchscreen = this.detectTouchScreen();
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

	selectVideoBGFullscreen () {
		if (this.state.deviceIsTouchscreen) {
			this.mobileBGFullscreenVideo.classList.remove('hidden');
			this.desktopBGFullscreenVideo.classList.add('hidden');
		}
	}
}