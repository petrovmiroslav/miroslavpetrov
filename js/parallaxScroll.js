'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { ParallaxScroll };

class ParallaxScroll {
	constructor (State, ClientDevice) {
		this.state = State;
		this.state.parallaxScrollON = this.addParallaxScrollListener.bind(this);
    this.state.parallaxScrollOFF = this.removeParallaxScrollListener.bind(this);
    this.state.parallaxScrollUPDATE = this.parallaxScrollHandler.bind(this);
    this.state.angleGradientBGON = this.angleGradientBGEnable.bind(this);
    this.state.angleGradientBGOFF = this.angleGradientBGDisable.bind(this);

    this.clientDevice = ClientDevice;
    this.clientDevice.windowResizeHandlersQueue.resizeGradientBG = this.resizeGradientBG.bind(this);

		this.parallax = null;
		this.angleContainerWrapper = null;
		this.angleContainerWrapperRECT = null;
		this.angleContainer = null;
		this.gradientBG = null;
		this.aboutSection__header = null;
		this.stackDescriptionWrapper = null;
		this.bgVideoMobile = null;

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
		this.aboutSection__header = this.parallax.querySelector('.aboutSection__header');
		this.stackDescriptionWrapper = this.parallax.querySelector('.stackSection__stackDescriptionWrapper');
		if (this.state.deviceIsTouchscreen) {
			this.bgVideoMobile = document.querySelector('.parallax__bg-fullscreen-video_mobile-view');
		}

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
		this.parallax.addEventListener('scroll', this.parallaxScrollHandlerBind, this.state.passiveListener);
	}
	removeParallaxScrollListener () {
		this.parallax.removeEventListener('scroll', this.parallaxScrollHandlerBind, this.state.passiveListener);
	}


	parallaxScrollHandler () {
		if (!this.parallaxScrollHandlerTicking) {
			this.parallaxScrollHandlerTicking = true;
			this.rAF(this.parallaxScrollHandlerRAF);
		}
	}
	setParallaxScrollHandlerTickingFalse () {
		this.parallaxScrollHandlerTicking = false;
	}
	parallaxScrollHandlerRAF () {
		this.angleContainerWrapperRECT = this.angleContainerWrapper.getBoundingClientRect();
		if (this.angleContainerWrapperRECT.top + this.angleContainerWrapperRECT.height > 0) {

			this.setAngleToGradientBG();
		}

		if (this.state.deviceIsTouchscreen) {
			if (((this.angleContainerWrapperRECT.top + this.angleContainerWrapperRECT.height)-this.state.windowHeight) / this.state.windowHeight > 0.5) {
				this.bgVideoMobile.classList.add('hidden');
			} else {
				this.bgVideoMobile.classList.remove('hidden');
			}
		}

		this.angleContainerWrapperRECT = null;
		this.parallaxScrollHandlerTicking = false;
	}

	setAngleToGradientBG () {
		if (!this.angleContainerWrapperRECT) {
			this.angleContainerWrapperRECT = this.angleContainerWrapper.getBoundingClientRect();
		}
		this.angle = (this.angleContainerWrapperRECT.top - this.state.windowHeight/2)/this.state.windowHeight/2*-100;

		if (this.angle > -0.5) {
			/*this.angleContainer.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale3d(1.7, 1, 1)';*/
			this.angleContainer.style.transform = 'translateZ(0) rotate(0deg)';
			this.aboutSectionElementsSlideUp();
		} else {
			this.aboutSectionElementsSlideDown();
			if (this.angle > -10 && this.angle <= -0.5) {
				/*this.angleContainer.style.transform = 'translate3d(0, 0, 0) rotate(' + Math.round(this.angle) + 'deg) scale3d(1.7, 1, 1)';*/
				this.angleContainer.style.transform = 'translateZ(0) rotate(' + Math.round(this.angle) + 'deg)';
			} else {
				/*this.angleContainer.style.transform = 'translate3d(0, 0, 0) rotate(-10deg) scale3d(1.7, 1, 1)';*/
				this.angleContainer.style.transform = 'translateZ(0) rotate(-10deg)';
			}
		}
	}

	aboutSectionElementsSlideUp () {
		this.aboutSection__header.classList.add('aboutSection__header_slideUp');
		this.stackDescriptionWrapper.classList.add('stackSection__stackDescriptionWrapper_slideUp');
	}
	aboutSectionElementsSlideDown () {
		this.aboutSection__header.classList.remove('aboutSection__header_slideUp');
		this.stackDescriptionWrapper.classList.remove('stackSection__stackDescriptionWrapper_slideUp');
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
		if (this.state.angleGradientBGIsActive) { console.log('resizeGradientBG');
			this.angleContainer.classList.add('hidden');
			window.requestAnimationFrame(()=>{
				this.angleContainer.classList.remove('hidden');
				this.setAngleToGradientBG();
			});
		}
	}

	
	
}