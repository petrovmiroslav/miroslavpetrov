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
    

    this.clientDevice = ClientDevice;
    this.clientDevice.windowResizeHandlersQueue.resizeParallax = this.parallaxScrollUpdate.bind(this);
    //this.clientDevice.windowResizeHandlersQueue.resizeGradientBG = this.resizeGradientBG.bind(this);

		this.parallax = null;
		this.parallaxScrollPosition = 0;
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
		this.angleGradientBGEnableRAFBind = this.angleGradientBGEnableRAF.bind(this);
		this.angleGradientBGDisableRAFBind = this.angleGradientBGDisableRAF.bind(this);
		this.certsEnableRAFBind = this.certsEnableRAF.bind(this);
		this.certsDisableRAFBind = this.certsDisableRAF.bind(this);
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
		this.gradientBGTransformValue = 0;
		this.gradientBGIsActive = false;
		this.certsIsActive = false;
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
		this.cube3dScene = this.parallax.querySelector('.cube3d__scene');
		this.cube3dUserHint = this.parallax.querySelector('.userHint_cube3d');
		this.stackDescriptionWrapper = this.parallax.querySelector('.stackSection__stackDescriptionWrapper');
		this.certification = this.parallax.querySelector('.certification');
		this.certificates = this.certification.querySelector('.certification__certificates');
		this.certificationHint = this.certification.querySelector('.userHint_cert');
		this.certification__headerContentLayer = this.parallax.querySelector('.header__contentLayer');
		this.certification__header = this.parallax.querySelector('.header__text_certification');
		this.certification__frame = this.certification.querySelector('.certification__frame');
		this.portfolio = this.parallax.querySelector('.portfolio');
		this.portfolio__header = this.parallax.querySelector('.header__text_portfolio');
		this.contactWithMe__header = this.parallax.querySelector('.header__text_contactWithMe');
		this.canvas = document.querySelector('.bubbles');
		this.bgVideo = document.querySelector(this.state.deviceIsTouchscreen ? 
			'.parallax__bg-fullscreen-video_mobile-view' :
			'.parallax__bg-fullscreen-video_desktop-view');

		this.WC = {
			angle: {
				arr: [this.gradientBG, this.angleContainer, this.stackDescriptionWrapper, this.aboutSection__header, this.cube3dUserHint],
				state: "gradientBGIsActive"
			},
			certs: {
				arr: [this.certification__header, this.certificates, this.certification__frame, this.certificationHint, this.certification__headerContentLayer],
				state: "certsIsActive"
			}
		};

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
	}
	removeParallaxScrollListener () {
		this.parallax.removeEventListener('scroll', this.parallaxScrollHandlerBind, this.state.passiveListener);
	}

	parallaxScrollUpdate () {
		if (this.state.slide1IsActive)
			return;

		this.parallaxScrollPosition = this.parallax.scrollTop;
		this.angleContainerWrapperRECTobj = this.angleContainerWrapper.getBoundingClientRect();
		this.angleContainerWrapperRECT.top = this.angleContainerWrapperRECTobj.top + this.parallaxScrollPosition;
		this.angleContainerWrapperRECT.height = this.angleContainerWrapperRECTobj.height;
		this.angleContainerWrapperRECT.bottom = this.angleContainerWrapperRECTobj.bottom + this.parallaxScrollPosition;

		this.gradientBGScrollHeight = this.angleContainerWrapperRECT.bottom;

		let certificationRECTobj = this.certification.getBoundingClientRect();
		this.certificationRECT.top = certificationRECTobj.top + this.parallax.scrollTop;
		this.certificationRECT.height = certificationRECTobj.height;
		this.certificationRECT.bottom = certificationRECTobj.bottom + this.parallaxScrollPosition;

		let portfolioRECTobj = this.portfolio.getBoundingClientRect();
		this.portfolioRECT.top = portfolioRECTobj.top + this.parallaxScrollPosition;
		this.portfolioRECT.height = portfolioRECTobj.height;

		let bubblesRECTobj = this.canvas.getBoundingClientRect();
		this.bubblesRECT.top = bubblesRECTobj.top + this.parallaxScrollPosition;
		this.bubblesRECT.height = bubblesRECTobj.height;

		this.parallaxScrollHandler();
	}

	parallaxScrollHandler () {
		this.parallaxScrollHandlerTicking || (this.parallaxScrollHandlerTicking = true, window.requestAnimationFrame(this.parallaxScrollHandler1RenderBind));
	}

	parallaxScrollHandler1Render () {
		if (this.state.menuIsOpen) 
			return this.parallaxScrollHandlerTicking = false;

		this.parallaxScrollPosition = this.parallax.scrollTop;

		if (this.parallaxScrollPosition < 0) 
			return this.parallaxScrollHandlerTicking = false;

		this.checkAndUpdateAngle();
		this.checkAndUpdateBgVideo();
		this.checkAndUpdateCerts();
		this.checkAndUpdatePortfolio();
		this.checkAndUpdateBubbles();

		this.parallaxScrollCallbackCount === 0 && (this.parallaxScrollHandlerTicking = false);
	}

	doItInNextRafAndCallbackCountPlus (f) {
		window.requestAnimationFrame(f);
		this.parallaxScrollCallbackCount++;
		return f = null, !0;
	}

	checkAndUpdateBgVideo () {
		let angleContainerBottomOnDisplay = (this.angleContainerWrapperRECT.bottom - this.parallaxScrollPosition) / this.state.windowHeight,
		certificationTopOnDisplay = (this.certificationRECT.top - this.parallaxScrollPosition)/this.state.windowHeight,
		a = 0, b = 1;

		/*this.state.deviceIsTouchscreen && (a = -0.2, b = 1.2);*/

		if (certificationTopOnDisplay > a && angleContainerBottomOnDisplay < b)
			return this.bgVideoON();

		this.bgVideoOFF();
	}
	bgVideoON () {
		this.state.bgVideoIsOFF && (this.state.bgVideoIsOFF = false,
			this.bgVideo.classList.remove('opacity0'),
			this.bgVideo.play());
		/*if (this.state.bgVideoIsOFF) {
			this.state.bgVideoIsOFF = false;
			this.bgVideo.play();
			//this.bgVideo.classList.remove('opacity0');
		}*/
	}
	bgVideoOFF () {
		this.state.bgVideoIsOFF || (this.state.bgVideoIsOFF = true,
			this.bgVideo.classList.add('opacity0'),
			this.bgVideo.pause());

		/*if (!this.state.bgVideoIsOFF) {
			this.state.bgVideoIsOFF = true;
			this.bgVideo.pause();
			//this.bgVideo.classList.add('opacity0');
		}*/
	}

	checkAndUpdateAngle () {
		this.angleContainerWrapperRECT.bottomOnDisplay = this.angleContainerWrapperRECT.bottom - this.parallaxScrollPosition;

		this.angleContainerWrapperRECT.bottomOnDisplay > 0 && this.doItInNextRafAndCallbackCountPlus(this.setAngleToGradientBGRAFBind);
	}

	angleGradientBGEnableRAF () {
		this.classWC(!0, this.WC.angle);
		this.parallaxScrollFinish();
	}
	angleGradientBGDisableRAF () {
		this.classWC(!1, this.WC.angle);
		this.parallaxScrollFinish();
	}

	checkAndUpdateCerts () {
		this.certificationRECT.topOnDisplay = this.certificationRECT.top - this.parallaxScrollPosition;
		let percentOfTop = this.certificationRECT.topOnDisplay / this.state.windowHeight, certificationDisplayProportion = 1 - percentOfTop;

		if (certificationDisplayProportion < 0.1)
			return this.certification__headerSlideUp && this.doItInNextRafAndCallbackCountPlus(this.certification__headerSlideDownRAFBind);

		this.certification__headerSlideUp || this.doItInNextRafAndCallbackCountPlus(this.certification__headerSlideUpRAFBind);

		certificationDisplayProportion < 0.9 || this.state.certificationUserStart || this.certificationHintDisplay || this.doItInNextRafAndCallbackCountPlus(this.certificationHintDisplayRAFBind);
	}
	certsEnableRAF () {
		this.classWC(!0, this.WC.certs);
		this.parallaxScrollFinish();
	}
	certsDisableRAF () {
		this.classWC(!1, this.WC.certs);
		this.parallaxScrollFinish();
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
		this.portfolioRECT.topOnDisplay = this.portfolioRECT.top - this.parallaxScrollPosition;
		let percentOfTop = this.portfolioRECT.topOnDisplay / this.state.windowHeight, portfolioDisplayProportion = 1 - percentOfTop;

		if (portfolioDisplayProportion < 0.1)
			return this.portfolio__headerSlideUp && this.doItInNextRafAndCallbackCountPlus(this.portfolio__headerSlideDownRAFBind);

		this.portfolio__headerSlideUp || this.doItInNextRafAndCallbackCountPlus(this.portfolio__headerSlideUpRAFBind);
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
		this.bubblesRECT.topOnDisplay = this.bubblesRECT.top - this.parallaxScrollPosition;
		let percentOfTop = this.bubblesRECT.topOnDisplay / this.state.windowHeight, bubblesDisplayProportion = 1 - percentOfTop;

		if (bubblesDisplayProportion > 0.1) {
			this.contactWithMe__headerSlideUp || this.doItInNextRafAndCallbackCountPlus(this.bubbles__headerSlideUpRAFBind);
		} else {
			this.contactWithMe__headerSlideUp && this.doItInNextRafAndCallbackCountPlus(this.bubbles__headerSlideDownRAFBind);
		}
//return;
		if (this.bubblesStart) { 
			if (bubblesDisplayProportion > 0) 
				return this.state.bubblesPause && this.doItInNextRafAndCallbackCountPlus(this.bubblesPauseOFFRAFBind);
			return this.state.bubblesPause || this.state.bubblesPauseON();
		}
		if (bubblesDisplayProportion < 0.8)
			return this.state.bubblesPause || this.state.bubblesPauseON();
		this.state.bubblesPause && (this.state.bubblesStart = true,
		window.requestAnimationFrame(this.setBubblesStartRAFBind),
		this.doItInNextRafAndCallbackCountPlus(this.bubblesPauseOFFRAFBind));
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

	parallaxScrollFinish () {
		--this.parallaxScrollCallbackCount === 0 && (this.parallaxScrollHandlerTicking = false);
	}
  
  setAngleToGradientBG () {
  	this.angle = (this.angleContainerWrapperRECT.top - this.parallaxScrollPosition - this.state.windowHeight/2)/this.state.windowHeight/2*-100;

  	this.setTransformGradientBG();

  	if (this.angle > -0.5) {
  		this.angleContainer.style.transform = 'rotate(0deg) translateZ(0)';
			return this.aboutSectionElementsSlideUp();
  	} 

  	this.aboutSectionElementsSlideDown();
  	if (this.angle > -10 && this.angle <= -0.5)
  		return this.angleContainer.style.transform = 'rotate(' + this.state.roundTo(this.angle, 1) + 'deg) translateZ(0)';

  	this.angleContainer.style.transform = 'rotate(-10deg) translateZ(0)';
  }

	aboutSectionElementsSlideUp () {
		this.aboutSection__header.classList.remove('aboutSection__header_slideDown');
		this.stackDescriptionWrapper.classList.remove('stackSection__stackDescriptionWrapper_slideDown');
	}
	aboutSectionElementsSlideDown () {
		this.aboutSection__header.classList.add('aboutSection__header_slideDown');
		this.stackDescriptionWrapper.classList.add('stackSection__stackDescriptionWrapper_slideDown');
	}

	setTransformGradientBG (value) {
		if (value !== undefined)
			return this.gradientBG.style.transform = 'translate3d(0%, 0, 0)';

		this.gradientBGTransformValue = -66 * (1 - this.angleContainerWrapperRECT.bottomOnDisplay / this.gradientBGScrollHeight);

		this.gradientBGTransformValue < -66 && (this.gradientBGTransformValue = -66);
		this.gradientBGTransformValue > 0 && (this.gradientBGTransformValue = 0);

		this.gradientBG.style.transform = 'translate3d(' + this.state.roundTo(this.gradientBGTransformValue, 1) + '%, 0%, 0)';
	}
	classWC (add, target) {
		if (add) {
			this[target.state] = true;
			for (var i = target.arr.length - 1; i >= 0; i--)
				target.arr[i].classList.add('will-change');
			return;
		}
		
		this[target.state] = false;
		for (var i = target.arr.length - 1; i >= 0; i--)
			target.arr[i].classList.remove('will-change');
	}
/*	resizeGradientBG () {
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
	}*/
}