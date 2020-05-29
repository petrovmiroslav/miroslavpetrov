'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { HiBgImageTransform };

class HiBgImageTransform {
	constructor (State) {
		this.state = State;
		this.state.hiBgImageTransformON = this.addHiBgImageTransformListener.bind(this);
		this.state.hiBgImageTransformOFF = this.removeHiBgImageTransformListener.bind(this);

		this.imgLazy = null;
		this.targetImg = null;
		this.main = null;

		this.checkReadyToAddListenerInterval = null;
		this.checkImgLazyIsLoadedInterval = null;
		this.event = null;

		this.ticking = false;
		this.hiBgImageTransformListener = this.tickHiBgImageTransform.bind(this);
	}

	init () {
		if (!this.state.deviceIsTouchscreen) {
			this.targetImg = document.querySelector('.hiScreen__bg-image_mini');
			this.imgLazy = document.querySelector('.hiScreen__bg-image_lazy');
			this.main = document.querySelector('.main');

			this.main.querySelectorAll('.hiScreen__bg-image').forEach(function (el) {
				el.classList.add('hiScreen__bg-image__desktop-view');
			});


			this.setCheckReadyToAddListenerInterval();
		}
	}

	rAF (f) {
		let nextRenderFunc = f;
		let nextRAF = function(func) {
			window.requestAnimationFrame(func.bind(this));
		};
		window.requestAnimationFrame(nextRAF.bind(this, nextRenderFunc));
		nextRenderFunc = null;
		nextRAF = null;
	}

	setCheckReadyToAddListenerInterval () {
		this.checkReadyToAddListenerInterval = window.setInterval(this.checkReadyToAddListener.bind(this), 300);
	}

	checkReadyToAddListener () {
		if (this.state.preloaderIsOff) {
			window.clearInterval(this.checkReadyToAddListenerInterval);
			this.addHiBgImageTransformListener();
			this.setCheckImgLazyIsLoadedInterval();
		}
	}

	addHiBgImageTransformListener () {
		if (!this.state.deviceIsTouchscreen) {
    	this.state.hiBgImageTransformListener = true;
      this.main.addEventListener('mousemove', this.hiBgImageTransformListener);
    }
	}
	removeHiBgImageTransformListener () {
		if (!this.state.deviceIsTouchscreen) {
			this.state.hiBgImageTransformListener = false;
    	this.main.removeEventListener('mousemove', this.hiBgImageTransformListener);
		}
	}

	tickHiBgImageTransform (event) {console.log('HiBgImageTransform');
		if(!this.ticking) {
      this.event = event;
      window.requestAnimationFrame(this.hiBgImageTransformFunction.bind(this));
    }
    this.ticking = true;
	}

	hiBgImageTransformFunction () {
    let mouseX = (this.event.clientX - this.state.windowWidth / 2) / (this.state.windowWidth / -5);
    let mouseY = (this.event.clientY - this.state.windowHeight / 2) / (this.state.windowHeight / -5);
    this.targetImg.style.transform = `scale(1.2) translate3d(${mouseX}%, ${mouseY}%,0)`;

		this.ticking = false;
	}

	setCheckImgLazyIsLoadedInterval () {
		this.checkImgLazyIsLoadedInterval = window.setInterval(this.checkImgLazyIsLoaded.bind(this),200);
	}
	checkImgLazyIsLoaded () {
		if (this.state.hiBgLazyImageIsLoaded) {
			window.clearInterval(this.checkImgLazyIsLoadedInterval);

			this.state.hiBgLazyImageIsTargetTransform = true;
			this.setImgLazyTransform();
			this.setImgLazyAsTargetImg();
		}
	}
	setImgLazyTransform () {
	 	this.imgLazy.style.transform = this.targetImg.style.transform;
	}
	setImgLazyAsTargetImg () {
		this.targetImg = this.imgLazy;
	}
}