'use strict';
export { Menu };

class Menu {
	constructor (State) {
		this.state = State;
		this.state.clientDevice.windowResizeHandlersQueue.resizeMenu = this.resize.bind(this);
		this.state.clientDevice.windowResizeHandlersQueue.resizeHero = this.resizeHero.bind(this);

		this.menuButton = {};
		this.menuButton_button = {};
		this.menu = {};
		this.content = {};
		this.contentClone = {};
		this.menuClone = {};
		this.slide1 = {};
		this.slide2 = {};
		this.flipper = {};
		this.bgVideo = {};
		this.parallaxContainer = {};
		this.hero = {};

		this.menuButtonLeftPosition = -999999;
		this.flipperFirstChildPosition = -999999;
		this.parallaxScrollValue = null;
		this.menuButtonAnimationDuration = 250;
		this.flipperRotationAnimationDuration = 500;

		this.menuTicking = false;
		this.checkReadyToInitInterval = null;
		this.parallaxScrollStop = false;
		this.scrollFlipperBeforeRotateDone = false;
		this.drawFlipperDone = false;
		this.bubblesPause = false;

		this.menuButtonClickHandlerBind = this.menuButtonClickHandler.bind(this);
		this.menuButtonTransitionEndBind = this.menuButtonTransitionEnd.bind(this);
		this.flipperTransitionEndBind = this.flipperTransitionEnd.bind(this);
		this.prepareForOpenMenuIfSlide1IsActiveBind = this.prepareForOpenMenuIfSlide1IsActive.bind(this);
		this.prepareForOpenMenuIfSlide2IsActiveBind = this.prepareForOpenMenuIfSlide2IsActive.bind(this);
		this.startWaitParallaxScrollStopBind = this.startWaitParallaxScrollStop.bind(this);
		this.waitParallaxScrollStopBind = this.waitParallaxScrollStop.bind(this);
		this.disableMenuButtonBind = this.disableMenuButton.bind(this);
		this.startWaitMenuButtonAnimationDoneBind = this.startWaitMenuButtonAnimationDone.bind(this);
		this.waitMenuButtonAnimationDoneBind = this.waitMenuButtonAnimationDone.bind(this);
		this.ifScrollStopScrollFlipperBind = this.ifScrollStopScrollFlipper.bind(this);
		this.waitFlipperAnimationDoneBind = this.waitFlipperAnimationDone.bind(this);
		this.setMenuButtonLeftPositionBind = this.setMenuButtonLeftPosition.bind(this
			);
		this.heroAnimationOnBind = this.heroAnimationOn.bind(this);
	}

	init () {
		this.menuButton = document.querySelector('.menuButton__lines-wrapper');
		this.menuButton_button = document.getElementById('menuButton');
		this.menu = document.querySelector('.menu');
		this.slide1 = document.querySelector('.slide1');
		this.slide2 = document.querySelector('.slide2');
		this.flipper = document.querySelector('.fullscreenFlipper');
		this.parallaxContainer = this.slide2.querySelector('.parallax__scrollable-container');
		this.bgVideo = document.querySelector(this.state.deviceIsTouchscreen ? 
			'.parallax__bg-fullscreen-video_mobile-view' :
			'.parallax__bg-fullscreen-video_desktop-view');
		this.hero = this.menu.querySelector('.hero');

		this.setCheckReadyToInitInterval();
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

	setCheckReadyToInitInterval () {
		this.checkReadyToInitInterval = window.setInterval(this.checkReadyToInit.bind(this), 300);
	}

	checkReadyToInit () {
		if (!this.state.preloaderIsOff) return;
		window.clearInterval(this.checkReadyToInitInterval);
		this.addMenuButtonClickListener();
	}

	addMenuButtonClickListener () {
		this.menuButton_button.addEventListener('click', this.menuButtonClickHandlerBind);
	}
	removeMenuButtonClickListener () {
		this.menuButton_button.removeEventListener('click', this.menuButtonClickHandlerBind);
	}

	menuButtonClickHandler () {
		if (this.menuTicking) return;
		this.menuTicking = true;
		this.state.menuIsOpen ? this.closeMenu() : this.openMenu();
	}

	disableMenuButton () {
		this.menuButton_button.disabled = true;
		this.menuButton_button.blur();
		this.menuButton.classList.add('menuButton__lines-wrapper_pointer-events_none');
		if (this.state.menuIsOpen)
			return this.menuButton.classList.add('menuButton__lines-wrapper_on');
		this.menuButton.classList.remove('menuButton__lines-wrapper_on');
	}
	enableMenuButton () {
		this.menuButton_button.disabled = false;
		this.menuButton.classList.remove('menuButton__lines-wrapper_pointer-events_none');
	}

	openMenu () {
		this.state.menuIsOpen = true;

		if (this.state.slide1IsActive) {
			this.content = this.slide1;
			window.requestAnimationFrame(this.prepareForOpenMenuIfSlide1IsActiveBind);
		} else {
			this.content = this.slide2;
			this.rAF(this.prepareForOpenMenuIfSlide2IsActive);
		}

		this.rAF(this.drawFlipper);

		(this.state.slide1IsActive && (this.parallaxScrollStop = this.scrollFlipperBeforeRotateDone = true)) || window.requestAnimationFrame(this.startWaitParallaxScrollStopBind);
		window.requestAnimationFrame(this.disableMenuButtonBind);
		window.requestAnimationFrame(this.startWaitMenuButtonAnimationDoneBind);
	}

	prepareForOpenMenuIfSlide1IsActive () {
		this.state.hiBgImageTransformOFF();
		this.state.fullscreenSliderOFF();
	}

	prepareForOpenMenuIfSlide2IsActive () {
		this.state.fullscreenSliderOFF();
		this.state.cube3dStop();
		this.pauseAndBlurBGVideo();
		this.bubblesPause = this.state.bubblesPause, this.state.bubblesPauseON();
	}

	pauseAndBlurBGVideo () {
		this.state.bgVideoIsOFF = true;
		this.bgVideo.classList.add('parallax__bg-fullscreen-video_filter');
		this.bgVideo.pause();
	}
	playAndClearBGVideo () {
		this.bgVideo.classList.remove('parallax__bg-fullscreen-video_filter');
	}

	drawFlipper () {
    this.contentClone = this.content.cloneNode(true);
    this.prepareMenu();
    this.state.slide1IsActive ? this.prepareSlide1() : this.prepareSlide2();

    let flipperInnerHTML = '';
    for (let i = 0,
    				 n = 5, 
    				 frontFlipperSide = this.contentClone.outerHTML,
    				 backFlipperSide = this.menuClone.outerHTML; i < n; i++) {

    	flipperInnerHTML += '<div class="fullscreenFlipper__flipper" style="width: ' + 100/n +'%;">'+
				'<div class="fullscreenFlipper__flipperSide fullscreenFlipper__flipperSide_back">'+
					'<div class="fullscreenFlipper__sideInnerWrapper" style="width: ' + 100*n +'%; transform: translateX(-' + 100/n * i +  '%)">'+
						backFlipperSide+
					'</div>'+
				'</div>'+
				'<div class="fullscreenFlipper__flipperSide fullscreenFlipper__flipperSide_front">'+
					'<div class="fullscreenFlipper__sideInnerWrapper" style="width: ' + 100*n +'%; transform: translateX(-' + 100/n * i +  '%)">'+
						frontFlipperSide+
					'</div>'+
				'</div>'+
			'</div>';
    }
    this.flipper.classList.remove('hidden');
    this.flipper.innerHTML = flipperInnerHTML;

    if (this.state.slide1IsActive) {
    	this.flipper.classList.remove('opacity0');
    	this.makeContentSlideHidden();
    } else {
    	this.cloneCanvas();
    	this.ifScrollStopScrollFlipper();
    }

    this.drawFlipperDone = true;
    this.contentClone = {};
	}

	ifScrollStopScrollFlipper () {
		if (!this.parallaxScrollStop)
			return window.requestAnimationFrame(this.ifScrollStopScrollFlipperBind);
		this.scrollFlipperBeforeRotate();
		this.flipperRemoveOpacity0();
		this.makeContentSlideHidden();
	}

	prepareMenu () {
		this.menuClone = this.menu.cloneNode(true);
    this.menuClone.classList.remove('hidden');
    this.menuClone.querySelector('.hero').remove();
	}
	prepareSlide1 () {
		if (this.state.deviceIsTouchscreen) return;
		for (let h = this.contentClone.querySelectorAll('.hiScreen__bg-image'), i = h.length - 1; i >= 0; i--) {
			h[i].style.transform = `scale(1.2) translate(${this.state.hiBgImageTransform[0]}%, ${this.state.hiBgImageTransform[1]}%)`;
		}
	}
	prepareSlide2 () {
		this.state.deviceIsTouchscreen && 
  		(this.transformNone(this.contentClone.querySelector('.parallax__group_1')),
  		this.contentClone.querySelector('.certification__frame').style.filter = 'none');

		this.removeSmoothScroll();
  	this.deleteCube3dInContentClone();
  	this.prepareHeaders();
  	this.contentClone.classList.add('slide2_flipper');
  	this.transformNone(this.contentClone.querySelector('.stackSection'));
  	this.prepareAngle();
  	this.contentClone.querySelector('.stackSection__gradientBG').style.transform = 'translateX(' + this.state.gradient + '%)';
  	this.prepareStack();
  	this.deleteVideoSoucesInContentClone();
  	this.prepareCerts();
  	this.contentClone.querySelector('.portfolio__Iframe').remove();
  	this.contentClone.querySelector('.portfolio__deviceSlider').remove();
  	this.prepareGroup4();
  	this.prepareSwitch();
  	this.prepareProjects();
  	this.setFormValue();
	}
	willChangeRemove (element) {
		element.classList.remove('will-change');
		element = null;
	}
	transformNone (element) {
		element.style.transform = 'none';
		element = null;
	}
	prepareHeaders () {
		let arr = [
								['.aboutSection__header', 0],
								['.header__text_certification'],
								['.header__text_portfolio'],
								['.header__text_contactWithMe']
							];
		for (let i = arr.length - 1; i >= 0; i--) {
			let e = this.contentClone.querySelector(arr[i][0]);
			this.willChangeRemove(e);
			if (arr[i].length > 1) {
				this.transformNone(e);
			} else {
				e.style.transform = 'translateY(-100%)';
				this.transformNone(e.parentNode);
			}
			e = null;
		}
	}
	prepareAngle () {
		let a = this.contentClone.querySelector('.stackSection__angleContainer');
  	a.style.transform = 'rotate(' + this.state.angle + 'deg)';
  	this.willChangeRemove(a);
  	a = null;
	}
	prepareStack () {
		let s = this.contentClone.querySelector('.stackSection__stackDescriptionWrapper');
  	this.willChangeRemove(s);
  	s.classList.add('stackSection__stackDescriptionWrapper_flipper');
  	this.transformNone(s);
  	s = null;
	}
	prepareCerts () {
		let c = this.contentClone.querySelector('.certification__certificates');
  	this.willChangeRemove(c);
  	c.style.transition = 'none';
  	c.style['scroll-behavior'] = 'unset';
  	c = null;
	}
	prepareGroup4 () {
		let g = this.contentClone.querySelector('.parallax__group_4');
  	g.style.position = 'static';
  	g.style['z-index'] = 'auto';
  	g = null;
	}
	prepareSwitch () {
		for (let b = this.contentClone.querySelectorAll('.portfolio__switchButton'), i = b.length - 1; i >= 0; i--) {
  		this.transformNone(b[i]);
  	}
	}
	prepareProjects () {
		for (let b = this.contentClone.querySelectorAll('.portfolio__project'), i = b.length - 1; i >= 0; i--) {
			this.transformNone(b[i]);
  		if (b[i].firstElementChild.classList.contains('portfolio__projectDescriptionContainer_projectChecked')) {
  			this.transformNone(b[i].firstElementChild);
  		} else {
  			b[i].firstElementChild.classList.add('portfolio__projectDescriptionContainer_flipper');
  		}
  	}
	}

	flipperRemoveOpacity0 () {
		this.flipper.classList.remove('opacity0');
	}

	removeSmoothScroll () {
		let p = this.contentClone.querySelector('.parallax__scrollable-container');
		p.classList.remove('parallax__scrollable-container_smoothScroll');
		this.state.deviceIsTouchscreen && (p.style.transform = 'translateZ(0)');
	}
	deleteVideoSoucesInContentClone () {
		let allContentCloneVideo = this.contentClone.querySelectorAll('video');
		if (allContentCloneVideo.length){
			allContentCloneVideo.forEach(function(contentCloneVideo){
				let sourcesToDelete = [];
				for (var children in contentCloneVideo.children) {
					if (contentCloneVideo.children[children] && contentCloneVideo.children[children].tagName && contentCloneVideo.children[children].tagName == 'SOURCE') {
						sourcesToDelete.push(contentCloneVideo.children[children]);
					}
				}
				for (let j = 0; j < sourcesToDelete.length; j++) {
          sourcesToDelete[j].remove();
        }
        sourcesToDelete = null;
        contentCloneVideo = null;
			});
		}
		allContentCloneVideo = null;
	}
	deleteCube3dInContentClone () {
		let c = this.contentClone.querySelector('.cube3d');
		c.innerHTML = '';
	}
	changeCertsScrollBehavior () {
		this.contentClone.querySelector('.certification__certificates').style['scroll-behavior'] = 'unset';
	}
	setFormValue () {
		let form = document.form,
    		formClone = this.contentClone.querySelector('form');

    formClone.removeAttribute('id');
    formClone.file.removeAttribute('id');

  	formClone.personName.setAttribute("value", form.personName.value);
  	formClone.phoneNumber.setAttribute("value", form.phoneNumber.value);
  	formClone.email.setAttribute("value", form.email.value);
  	formClone.info.textContent = form.info.value;
  	formClone = null;
	}
	cloneCanvas () {
		if (this.bubblesPause) return;
		for (let i = 0,
						arr = this.flipper.querySelectorAll('.bubbles__canvas'),
						c = document.getElementById('canvas'); i < arr.length; i++) {
    	arr[i].getContext('2d').drawImage(c, 0, 0);
    }
	}

	scrollFlipperBeforeRotate () {
    for (let i = 0, p = this.flipper.querySelectorAll('.parallax__scrollable-container'); i < p.length; i++) {
    	p[i].scrollTop = this.parallaxScrollValue;
    }
    for (let i = 0, c = this.flipper.querySelectorAll('.certification__certificates'); i < c.length; i++) {
    	this.state.displayCurrentCertInFlipper(c[i]);
    }
    this.scrollFlipperBeforeRotateDone = true;
	}

	startWaitParallaxScrollStop () {
		this.parallaxScrollValue = this.parallaxContainer.scrollTop;
		window.setTimeout(this.waitParallaxScrollStopBind, this.menuButtonAnimationDuration);
	}
	waitParallaxScrollStop () {
		let newParallaxScrollValue = this.parallaxContainer.scrollTop;
		if (newParallaxScrollValue === this.parallaxScrollValue)
			return this.parallaxScrollStop = true;
		this.parallaxScrollValue = newParallaxScrollValue;
		this.rAF(this.waitParallaxScrollStop);
	}

	startWaitMenuButtonAnimationDone () {
		if (this.state.transitionEventSupport) 
			return this.menuButton.addEventListener('transitionend', this.menuButtonTransitionEndBind);
  	window.setTimeout(this.waitMenuButtonAnimationDoneBind, this.menuButtonAnimationDuration);
	}
	menuButtonTransitionEnd (e) {
		if (e.target.parentNode.id !== 'wrapperMenuButton') return;
		this.menuButton.removeEventListener('transitionend', this.menuButtonTransitionEndBind);
		this.waitMenuButtonAnimationDone();
	}
	waitMenuButtonAnimationDone () {
		if (!this.parallaxScrollStop || !this.scrollFlipperBeforeRotateDone)
			return window.requestAnimationFrame(this.waitMenuButtonAnimationDoneBind);

		if (this.state.transitionEventSupport) {
			if (!this.drawFlipperDone)
				return window.requestAnimationFrame(this.waitMenuButtonAnimationDoneBind);
		} else {
			if (this.checkMenuButtonPosition())
				return window.requestAnimationFrame(this.waitMenuButtonAnimationDoneBind);
		}

		this.state.menuIsOpen ? this.startFlipperRotate() : this.flipperRotateBack();
	}

	checkMenuButtonPosition () {
		let newMenuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2);
		if (this.menuButtonLeftPosition !== newMenuButtonLeftPosition || !this.drawFlipperDone)
			return this.menuButtonLeftPosition = newMenuButtonLeftPosition, true;
	}
	
	startWaitFlipperAnimationDone () {
		if (this.state.transitionEventSupport)
			return this.flipper.firstElementChild.addEventListener('transitionend', this.flipperTransitionEndBind);
		this.flipperFirstChildPosition = -999999;
		window.setTimeout(this.waitFlipperAnimationDoneBind, this.flipperRotationAnimationDuration);
	}
	flipperTransitionEnd (e) {
		if (e.target.parentNode.id !== 'flipper') return;
		this.flipper.firstElementChild.removeEventListener('transitionend', this.flipperTransitionEndBind);
		this.flipperRotateDone();
	}
	waitFlipperAnimationDone () {
		let newFlipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);
		if (this.flipperFirstChildPosition === newFlipperFirstChildPosition && newFlipperFirstChildPosition < 0.5)
			return this.flipperRotateDone();
		this.flipperFirstChildPosition = newFlipperFirstChildPosition;
		this.rAF(this.waitFlipperAnimationDone);
	}
	flipperRotateDone() {
		this.state.menuIsOpen ? this.afterFlipperRotate() : this.afterFlipperRotateBack();
	}

	makeContentSlideHidden () {
		this.content.classList.add('opacity0');
	}
	startFlipperRotate () {
		this.menuButton.classList.add('opacity0');
		this.flipper.classList.add('fullscreenFlipper_rotate');
		this.startWaitFlipperAnimationDone();
	}
	flipperRotateBack () {
		this.menuButton.classList.add('opacity0');
		this.flipper.classList.remove('fullscreenFlipper_rotate');
		this.startWaitFlipperAnimationDone();
	}
	afterFlipperRotate () {
		this.menuTicking = false;
		this.menu.classList.remove('hidden');
		this.flipper.classList.add('opacity0');
		this.menuButton.classList.remove('opacity0');
		this.enableMenuButton();
		this.hero.classList.remove('hidden');
	}


	closeMenu () {
		this.state.menuIsOpen = false;
		this.disableMenuButton();
		this.prepareForCloseMenu();
		this.beforeFlipperRotateBack();
		this.startWaitMenuButtonAnimationDone();
	}

	prepareForCloseMenu () {
		this.hero.classList.add('hidden');
	}

	beforeFlipperRotateBack () {
		this.menu.classList.add('hidden');
		this.flipper.classList.remove('opacity0');
	}
	
	afterFlipperRotateBack () {
		this.content.classList.remove('opacity0');
		this.flipper.classList.add('hidden', 'opacity0');
		this.menuButton.classList.remove('opacity0');
		this.enableMenuButton();
		this.rAF(this.afterMenuClose);
	}
	afterMenuClose () {
		this.menuTicking = false;
		this.state.fullscreenSliderON();
		if (this.state.slide1IsActive) {
			this.state.hiBgImageTransformON();
		} else {
			this.state.parallaxScrollUPDATE();
			this.state.cube3dStart();
			this.playAndClearBGVideo();
			this.state.certificatesResize();
			this.state.portfolioResize();
			this.state.bubblesPauseOFF();
		}
		this.cleanFlipper();
	}

	cleanFlipper () {
		this.drawFlipperDone = this.parallaxScrollStop = this.scrollFlipperBeforeRotateDone = false;
		this.flipper.innerHTML = '';
  }

  resize () {
  	if (this.state.transitionEventSupport) return;
  	window.requestAnimationFrame(this.setMenuButtonLeftPositionBind);
  }
  setMenuButtonLeftPosition () {
  	this.menuButton && (this.menuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2));
  }

  heroAnimationOn () {
		this.hero.classList.add('hero_animationON');
	}
	heroAnimationOff () {
		this.hero.classList.remove('hero_animationON');
	}
	resizeHero () {
		this.state.deviceIsTouchscreen && this.state.menuIsOpen && (this.heroAnimationOff(),
			window.requestAnimationFrame(this.heroAnimationOnBind));
	}
}