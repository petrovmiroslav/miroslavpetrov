'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { HiBgImageTransform };

class HiBgImageTransform {
	constructor (State) {
		this.state = State;
		this.state.hiBgImageTransformON = this.hiBgImageTransformON.bind(this);
		this.state.hiBgImageTransformOFF = this.hiBgImageTransformOFF.bind(this);
		this.state.switchHiBgImageTransformTarget = this.switchHiBgImageTransformTarget.bind(this);

		this.imgLazy = {};
		this.targetImg = {};
		this.main = {};
		this.checkReadyToAddListenerInterval = this.checkImgLazyIsLoadedInterval = null;
		this.event = {};

		this.ticking = false;
		this.hiBgImageTransformListener = this.tickHiBgImageTransform.bind(this);
		this.hiBgImageTransformRAFBind = this.hiBgImageTransformRAF.bind(this);
		this.hiBgImageTransformFunctionBind = this.hiBgImageTransformFunction.bind(this);
	}

	init () {
		if (!this.state.deviceIsTouchscreen) {
			this.targetImg = document.querySelector('.hiScreen__bg-image_mini');
			this.imgLazy = document.querySelector('.hiScreen__bg-image_lazy');
			this.main = document.querySelector('.main');
			this.main.querySelectorAll('.hiScreen__bg-image').forEach(function (el) {
				el.classList.add('hiScreen__bg-image__desktop-view');
			});
			this.addHiBgImageTransformListener();
		}
		
		this.scrollIconSection = document.querySelector('.hiScreen__scrollIconSection');
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

	addHiBgImageTransformListener () {
		this.state.deviceIsTouchscreen || this.main.addEventListener('mousemove', this.hiBgImageTransformListener);
	}
	removeHiBgImageTransformListener () {
		this.state.deviceIsTouchscreen || this.main.removeEventListener('mousemove', this.hiBgImageTransformListener);
	}

	tickHiBgImageTransform (event) {
		this.ticking || (this.event = event,
      window.requestAnimationFrame(this.hiBgImageTransformRAFBind));
    this.ticking = true;
	}

	hiBgImageTransformRAF () {
		window.requestAnimationFrame(this.hiBgImageTransformFunctionBind);
	}

	hiBgImageTransformFunction () {
    this.state.hiBgImageTransform[0] = (this.event.clientX - this.state.windowWidth / 2) / (this.state.windowWidth / -5);
    this.state.hiBgImageTransform[1] = (this.event.clientY - this.state.windowHeight / 2) / (this.state.windowHeight / -5);
    this.targetImg.style.transform = `scale(1.2) translate3d(${this.state.hiBgImageTransform[0]}%, ${this.state.hiBgImageTransform[1]}%,0)`;

		this.ticking = false;
	}

	switchHiBgImageTransformTarget () {
		this.imgLazy.style.transform = this.targetImg.style.transform;
		this.targetImg = this.imgLazy;
	}

	hiBgImageTransformON () {
		this.addHiBgImageTransformListener();
	}
	hiBgImageTransformOFF () {
		this.removeHiBgImageTransformListener();
		this.scrollIconSection.classList.add('hidden');
	}
}