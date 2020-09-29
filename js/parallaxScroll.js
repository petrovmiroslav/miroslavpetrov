'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { ParallaxScroll };

class ParallaxScroll {
	constructor (State, ClientDevice) {
		this.state = State;
		// this.state.parallaxScrollON = this.addParallaxScrollListener.bind(this);
    // this.state.parallaxScrollOFF = this.removeParallaxScrollListener.bind(this);
    this.state.angleGradientBGIsActive = false;
    this.state.parallaxScrollUPDATE = this.parallaxScrollUpdate.bind(this);
    this.state.angleGradientBGON = this.angleGradientBGEnable.bind(this);
    this.state.angleGradientBGOFF = this.angleGradientBGDisable.bind(this);

    this.clientDevice = ClientDevice;
    this.clientDevice.windowResizeHandlersQueue.resizeParallax = this.parallaxScrollUpdate.bind(this);
    this.clientDevice.windowResizeHandlersQueue.resizeGradientBG = this.resizeGradientBG.bind(this);

		this.parallax = null;
		this.angleContainerWrapper = null;
		this.angleContainerWrapperRECT = {};
		this.certificationRECT = {};
		this.portfolioRECT = {};
		this.bubblesRECT = {};
		this.angleContainer = null;
		this.gradientBG = null;
		this.aboutSection__header = null;
		this.stackDescriptionWrapper = null;
		this.bgVideoMobile = null;

		this.parallaxScrollHandlerBind = this.parallaxScrollHandler.bind(this);
		this.parallaxScrollHandler1RenderBind = this.parallaxScrollHandler1Render.bind(this);
		this.setAngleToGradientBGRAFBind = this.setAngleToGradientBGRAF.bind(this);
		this.certification__headerSlideUpRAFBind = this.certification__headerSlideUpRAF.bind(this);
		this.certification__headerSlideDownRAFBind = this.certification__headerSlideDownRAF.bind(this);
		this.certificationHintDisplayRAFBind = this.certificationHintDisplayRAF.bind(this);
		this.portfolio__headerSlideUpRAFBind = this.portfolio__headerSlideUpRAF.bind(this);
		this.portfolio__headerSlideDownRAFBind = this.portfolio__headerSlideDownRAF.bind(this);
		this.bubbles__headerSlideUpRAFBind = this.bubbles__headerSlideUpRAF.bind(this);
		this.bubbles__headerSlideDownRAFBind = this.bubbles__headerSlideDownRAF.bind(this);
		this.setBubblesStartRAFBind = this.setBubblesStartRAF.bind(this);
		this.bubblesPauseOFFRAFBind = this.bubblesPauseOFFRAF.bind(this);
		
		

		this.parallaxScrollHandlerTicking = false;
		this.angle = 0;
		this.parallaxScrollCallbackCount = 0;
		this.certification__headerSlideUp = false;
		this.portfolio__headerSlideUp = false;
		this.certificationHintDisplay = false;
		this.contactWithMe__headerSlideUp = false;
		this.bubblesStart = false;
	}

	init () {
		this.parallax = document.querySelector('.parallax__scrollable-container');
		this.angleContainerWrapper = this.parallax.querySelector('.stackSection__angleContainerWrapper');
		this.angleContainer = this.parallax.querySelector('.stackSection__angleContainer');
		this.gradientBG = this.parallax.querySelector('.stackSection__gradientBG');
		this.aboutSection__header = this.parallax.querySelector('.aboutSection__header');
		this.stackDescriptionWrapper = this.parallax.querySelector('.stackSection__stackDescriptionWrapper');
		this.certification = this.parallax.querySelector('.certification');
		this.certificationHint = this.certification.querySelector('.userHint_cert');
		this.certification__header = this.parallax.querySelector('.header__text_certification');
		this.portfolio = this.parallax.querySelector('.portfolio');
		this.portfolio__header = this.parallax.querySelector('.header__text_portfolio');
		this.contactWithMe__header = this.parallax.querySelector('.header__text_contactWithMe');
		this.canvas = document.querySelector('.bubbles');
		if (this.state.deviceIsTouchscreen) {
			this.bgVideoMobile = document.querySelector('.parallax__bg-fullscreen-video_mobile-view');
		}

		this.addParallaxScrollListener();
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
		// this.aaa = this.angleContainerWrapper.getBoundingClientRect().top;
	}
	removeParallaxScrollListener () {
		this.parallax.removeEventListener('scroll', this.parallaxScrollHandlerBind, this.state.passiveListener);
	}

	parallaxScrollUpdate () {
		if (!this.state.slide1IsActive) {
			this.angleContainerWrapperRECTobj = this.angleContainerWrapper.getBoundingClientRect();
			this.angleContainerWrapperRECT.top = this.angleContainerWrapperRECTobj.top + this.parallax.scrollTop;
			this.angleContainerWrapperRECT.height = this.angleContainerWrapperRECTobj.height;


			let certificationRECTobj = this.certification.getBoundingClientRect();
			this.certificationRECT.top = certificationRECTobj.top + this.parallax.scrollTop;
			this.certificationRECT.height = certificationRECTobj.height;
			this.certificationRECT.bottom = certificationRECTobj.bottom;

			let portfolioRECTobj = this.portfolio.getBoundingClientRect();
			this.portfolioRECT.top = portfolioRECTobj.top + this.parallax.scrollTop;
			this.portfolioRECT.height = portfolioRECTobj.height;

			let bubblesRECTobj = this.canvas.getBoundingClientRect();
			this.bubblesRECT.top = bubblesRECTobj.top + this.parallax.scrollTop;
			this.bubblesRECT.height = bubblesRECTobj.height;

			this.parallaxScrollHandler();
		}
	}

	parallaxScrollHandler () {
		if (!this.parallaxScrollHandlerTicking) {
			this.parallaxScrollHandlerTicking = true;
			//this.rAF(this.parallaxScrollHandlerRAF);
			window.requestAnimationFrame(this.parallaxScrollHandler1RenderBind);
		}
	}
	setParallaxScrollHandlerTickingFalse () {
		this.parallaxScrollHandlerTicking = false;
	}

	parallaxScrollHandler1Render () {
		if (!this.state.menuIsOpen) {
			this.parallaxScrollPosition = this.parallax.scrollTop;

	    console.log('1render');

			/*new Promise((resolve)=>{
				window.requestAnimationFrame(this.promise2renderFunc.bind(this, resolve));
			})
			.finally(()=>{
				debugger
				console.log('finally');});*/
//////////////////////////////////////

			if (this.certificationRECTBottomBelowDisplay()) {
				if (!this.checkAndUpdateCerts()) {
					this.checkAndUpdateAngle();
				}
			} else {
				if (!this.checkAndUpdateBubbles()) {
					this.checkAndUpdatePortfolio();
				}
			}



			/*if (this.state.deviceIsTouchscreen) {
				if (((this.angleContainerWrapperRECT.top + this.angleContainerWrapperRECT.height - this.parallaxScrollPosition) - this.state.windowHeight) / this.state.windowHeight > 0.5) {
					this.bgVideoMobile.classList.add('opacity0');
				} else {
					this.bgVideoMobile.classList.remove('opacity0');
				}
			}*/


			if (this.parallaxScrollCallbackCount === 0) {
				console.log('COUNT0!');
				this.parallaxScrollHandlerTicking = false;
			}
		} else {
			this.parallaxScrollHandlerTicking = false;
		}
	}

	certificationRECTBottomBelowDisplay () {
		if ((this.certificationRECT.bottom - this.parallaxScrollPosition - this.state.windowHeight) > 0) {
			return true;
		}
		return false;
	}

	checkAndUpdateAngle () {
		if (this.angleContainerWrapperRECT.top + this.angleContainerWrapperRECT.height - this.parallaxScrollPosition > 0) {
			window.requestAnimationFrame(this.setAngleToGradientBGRAFBind);
			this.parallaxScrollCallbackCount++;
		}
	}

	checkAndUpdateCerts () {
		let certificationDisplayProportion = 1 - (this.certificationRECT.top - this.parallaxScrollPosition)/this.state.windowHeight,
		returnVal = false;
		if (certificationDisplayProportion > 0.1) {
			returnVal = true;
			if (!this.certification__headerSlideUp) {
				window.requestAnimationFrame(this.certification__headerSlideUpRAFBind);
				this.parallaxScrollCallbackCount++;
			}
		} else {
			if (this.certification__headerSlideUp) {
				window.requestAnimationFrame(this.certification__headerSlideDownRAFBind);
				this.parallaxScrollCallbackCount++;
			}
		}


		if (!this.state.certificationUserStart) {
			if (!this.certificationHintDisplay) {
				if (certificationDisplayProportion > 0.9) {
					window.requestAnimationFrame(this.certificationHintDisplayRAFBind);
					this.parallaxScrollCallbackCount++;
				}
			}
		}

		return returnVal;
	}

	certification__headerSlideUpRAF () {
		this.certification__header.classList.remove('header__text_slideDown');
		this.certification__headerSlideUp = true;
		this.parallaxScrollFinish();
	}
	certification__headerSlideDownRAF () {
		this.certification__headerSlideUp = false;
		this.certification__header.classList.add('header__text_slideDown');
		this.parallaxScrollFinish();
	}
	certificationHintDisplayRAF () {
		this.certificationHintDisplay = true;
		this.certificationHint.classList.remove('hidden');
		this.parallaxScrollFinish();
	}

	checkAndUpdatePortfolio () {
		let portfolioDisplayProportion = 1 - (this.portfolioRECT.top - this.parallaxScrollPosition) / this.state.windowHeight;
		if (portfolioDisplayProportion > 0.1) {
			if (!this.portfolio__headerSlideUp) {
				window.requestAnimationFrame(this.portfolio__headerSlideUpRAFBind);
				this.parallaxScrollCallbackCount++;
			}
		} else {
			if (this.portfolio__headerSlideUp) {
				window.requestAnimationFrame(this.portfolio__headerSlideDownRAFBind);
				this.parallaxScrollCallbackCount++;
			}
		}
	}
	portfolio__headerSlideUpRAF () {
		this.portfolio__header.classList.remove('header__text_slideDown');
		this.portfolio__headerSlideUp = true;
		this.parallaxScrollFinish();
	}
	portfolio__headerSlideDownRAF () {
		this.portfolio__headerSlideUp = false;
		this.portfolio__header.classList.add('header__text_slideDown');
		this.parallaxScrollFinish();
	}

	checkAndUpdateBubbles () {
		let bubblesDisplayProportion = 1 - (this.bubblesRECT.top - this.parallaxScrollPosition) / this.state.windowHeight;

		if (bubblesDisplayProportion > 0.1) {
			if (!this.contactWithMe__headerSlideUp) {
				window.requestAnimationFrame(this.bubbles__headerSlideUpRAFBind);
				this.parallaxScrollCallbackCount++;
			}
		} else {
			if (this.contactWithMe__headerSlideUp) {
				window.requestAnimationFrame(this.bubbles__headerSlideDownRAFBind);
				this.parallaxScrollCallbackCount++;
			}
		}


		if (this.bubblesStart) {
			if (bubblesDisplayProportion > 0) {
				if (this.state.bubblesPause) {
					window.requestAnimationFrame(this.bubblesPauseOFFRAFBind);
					this.parallaxScrollCallbackCount++;
				}
			} else {
				if (!this.state.bubblesPause) {
					this.state.bubblesPauseON();
				}
			}
		} else {
			if (bubblesDisplayProportion > 0.8) {
				if (this.state.bubblesPause) {
					window.requestAnimationFrame(this.setBubblesStartRAFBind);
					window.requestAnimationFrame(this.bubblesPauseOFFRAFBind);
					this.parallaxScrollCallbackCount++;
				}
			} else {
				if (!this.state.bubblesPause) {
					this.state.bubblesPauseON();
				}
			}
		}

		if (bubblesDisplayProportion > 0) {
			return true;
		}
		return false;
	}
	bubbles__headerSlideUpRAF () {
		this.contactWithMe__header.classList.remove('header__text_contactWithMeSlideDown');
		this.contactWithMe__headerSlideUp = true;
		this.parallaxScrollFinish();
	}
	bubbles__headerSlideDownRAF () {
		this.contactWithMe__headerSlideUp = false;
		this.contactWithMe__header.classList.add('header__text_contactWithMeSlideDown');
		this.parallaxScrollFinish();
	}
	setBubblesStartRAF () {
		this.bubblesStart = true;
	}
	bubblesPauseOFFRAF () {
		this.state.bubblesPauseOFF();
		this.parallaxScrollFinish();
	}

	setAngleToGradientBGRAF () {
		this.setAngleToGradientBG();
		this.parallaxScrollFinish();
	}

	promise2renderFunc (resolve) {
		
		this.angleContainerWrapperRECT = this.angleContainerWrapper.getBoundingClientRect();
		
		console.log('2render');
		resolve();
	}

	parallaxScrollFinish () {
		this.parallaxScrollCallbackCount--;
		console.log('parallaxScrollFinish---', this.parallaxScrollCallbackCount);
		if (this.parallaxScrollCallbackCount === 0) {
			this.parallaxScrollHandlerTicking = false;
		}
	}

	parallaxScrollHandlerRAF () {
		this.angleContainerWrapperRECT = this.angleContainerWrapper.getBoundingClientRect();
		if (this.angleContainerWrapperRECT.top + this.angleContainerWrapperRECT.height > 0) {

			this.setAngleToGradientBG();
		}

		if (this.state.deviceIsTouchscreen) {
			if (((this.angleContainerWrapperRECT.top + this.angleContainerWrapperRECT.height)-this.state.windowHeight) / this.state.windowHeight > 0.5) {
				//this.bgVideoMobile.classList.add('hidden');
			} else {
				//this.bgVideoMobile.classList.remove('hidden');
			}
		}

		this.angleContainerWrapperRECT = null;
		this.parallaxScrollHandlerTicking = false;
	}
  
  setAngleToGradientBG () {
  	this.angle = (this.angleContainerWrapperRECT.top - this.parallaxScrollPosition - this.state.windowHeight/2)/this.state.windowHeight/2*-100;

  	if (this.angle > -0.5) {
  		this.angleContainer.style.transform = 'translateZ(0) rotate(0deg)';
			this.aboutSectionElementsSlideUp();
  	} else {
  		this.aboutSectionElementsSlideDown();

  		if (this.angle > -10 && this.angle <= -0.5) {
				this.angleContainer.style.transform = 'translateZ(0) rotate(' + this.state.roundTo(this.angle, 1) + 'deg)';
			} else {
				this.angleContainer.style.transform = 'translateZ(0) rotate(-10deg)';
			}
  	}
  }

	setAngleToGradientBGOLD () {
		if (!this.angleContainerWrapperRECT) {
			this.angleContainerWrapperRECT = this.angleContainerWrapper.getBoundingClientRect();
		}
		this.angle = (this.angleContainerWrapperRECT.top - this.state.windowHeight/2)/this.state.windowHeight/2*-100;
		console.log(this.angleContainerWrapperRECT.top);
		console.log(this.aaa - this.parallax.scrollTop);


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
			//this.angleContainer.classList.add('hidden');
			this.angleGradientBGDisable();
			window.requestAnimationFrame(()=>{
				// this.angleContainer.classList.remove('hidden');
				// this.angleContainerWrapperRECT = null;
				// this.setAngleToGradientBG();
				this.angleGradientBGEnable();
			});
		}
	}
}