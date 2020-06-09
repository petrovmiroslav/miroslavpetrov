'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { ParallaxScroll };

class ParallaxScroll {
	constructor (State, ClientDevice) {
		this.state = State;
		this.state.parallaxScrollON = this.addParallaxScrollListener.bind(this);
    this.state.parallaxScrollOFF = this.removeParallaxScrollListener.bind(this);
    this.state.angleGradientBGON = this.angleGradientBGEnable.bind(this);
    this.state.angleGradientBGOFF = this.angleGradientBGDisable.bind(this);

    this.clientDevice = ClientDevice;
    this.clientDevice.windowResizeHandlersQueue.resizeGradientBG = this.resizeGradientBG.bind(this);

		this.parallax = null;
		this.angleContainerWrapper = null;
		this.angleContainer = null;
		this.gradientBG = null;

		this.parallaxScrollHandlerBind = this.parallaxScrollHandler.bind(this);
		this.parallaxScrollHandlerTicking = false;
		this.angle = 0;

		this.date = Date.now();
	}

	init () {
		this.parallax = document.querySelector('.parallax__scrollable-container');
		this.angleContainerWrapper = this.parallax.querySelector('.stackSection__angleContainerWrapper');
		this.angleContainer = this.parallax.querySelector('.stackSection__angleContainer');
		this.gradientBG = this.parallax.querySelector('.stackSection__gradientBG');

		this.state.parallaxScrollON();
	}

	rAF (f) {
		let nextRenderFunc = f,
				nextRAF = function(func) {
			window.requestAnimationFrame(func.bind(this));
		};
		window.requestAnimationFrame(nextRAF.bind(this, nextRenderFunc));
		nextRenderFunc = null;
		nextRAF = null;
	}

	addParallaxScrollListener () {
		this.parallax.addEventListener('scroll', this.parallaxScrollHandlerBind);
	}
	removeParallaxScrollListener () {
		this.parallax.removeEventListener('scroll', this.parallaxScrollHandlerBind);
	}

	/*setParallaxScrollHandlerTimeout () {
		window.clearTimeout(this.parallaxScrollHandlerTimeout);
		this.parallaxScrollHandlerTimeout = window.setTimeout(this.parallaxScrollHandler.bind(this),20);
	}*/
	parallaxScrollHandler () {
		
		if (!this.parallaxScrollHandlerTicking) {
			this.parallaxScrollHandlerTicking = true;

			
			this.rAF(this.setAngleToGradientBG);
			this.rAF(this.setParallaxScrollHandlerTickingFalse);
		}
	}
	setParallaxScrollHandlerTickingFalse () {
		this.parallaxScrollHandlerTicking = false;
	}

	setAngleToGradientBG () {
		this.angle = (this.angleContainerWrapper.getBoundingClientRect().top - this.state.windowHeight/2)/this.state.windowHeight/2*-100;
		console.log(this.angle);

		if (this.angle > -0.5) {
			this.angleContainer.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale3d(1.7, 1, 1)';
		} else {
			if (this.angle > -10 && this.angle <= -0.5) {
				this.angleContainer.style.transform = 'translate3d(0, 0, 0) rotate(' + Math.round(this.angle) + 'deg) scale3d(1.7, 1, 1)';
			} else {
				this.angleContainer.style.transform = 'translate3d(0, 0, 0) rotate(-10deg) scale3d(1.7, 1, 1)';
			}
		}
	}


	angleGradientBGEnable () {
		this.state.angleGradientBGIsActive = true;
		this.gradientBG.classList.add('stackSection__gradientBG_animationON');
	}
	angleGradientBGDisable () {
		this.state.angleGradientBGIsActive = false;
		this.gradientBG.classList.remove('stackSection__gradientBG_animationON');
	}
	resizeGradientBG () {
		console.log('resizeGradientBG');
		if (this.state.angleGradientBGIsActive) {
			this.angleContainer.classList.add('hidden');
			window.requestAnimationFrame(()=>{
				this.angleContainer.classList.remove('hidden');
				this.setAngleToGradientBG();
			});
		}
	}
}