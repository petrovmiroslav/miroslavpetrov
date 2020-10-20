'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Menu };

class Menu {
	constructor (State) {
		this.state = State;
		this.state.clientDevice.windowResizeHandlersQueue.resizeMenu = this.resize.bind(this);
		this.state.clientDevice.windowResizeHandlersQueue.resizeHero = this.resizeHero.bind(this);

		this.menuButton = null;
		this.menuButtonCheckbox = null;
		this.menu = null;
		this.content = null;
		this.contentClone = null;
		this.menuClone = null;
		this.slide1 = null;
		this.slide2 = null;
		this.flipper = null;
		this.cube3dLoadingIcon = null;
		this.bgVideoMobile = null;
		this.bgVideoDesktop = null;
		this.angleBGGradientAnimationLayer = null;
		this.allParallaxInFlipper = null;

		this.menuButtonLeftPosition = -999999;
		this.flipperFirstChildPosition = -999999;
		this.parallaxScrollValue = null;
		this.menuButtonAnimationDuration = 250;
		this.flipperRotationAnimationDuration = 500;

		this.checkReadyToInitInterval = null;
		this.parallaxScrollStop = false;
		this.scrollFlipperBeforeRotateDone = false;
		this.drawFlipperDone = false;

		this.menuButtonClickHandlerBind = this.menuButtonClickHandler.bind(this);
	}

	init () {
		this.menuButton = document.querySelector('.menuButton__lines-wrapper');
		//this.menuButtonCheckbox = document.getElementById('menuButton__checkbox');
		this.menuButton_button = document.getElementById('menuButton');
		this.menu = document.querySelector('.menu');
		this.slide1 = document.querySelector('.slide1');
		this.slide2 = document.querySelector('.slide2');
		this.flipper = document.querySelector('.fullscreenFlipper');
		this.parallaxContainer = this.slide2.querySelector('.parallax__scrollable-container');
		this.cube3dLoadingIcon = this.slide2.querySelector('.cube3d__loadingIconContainer');
		this.bgVideoMobile = this.slide2.querySelector('.parallax__bg-fullscreen-video_mobile-view');
		this.bgVideoDesktop = this.slide2.querySelector('.parallax__bg-fullscreen-video_desktop-view');
		this.angleBGGradientAnimationLayer = this.slide2.querySelector('.stackSection__gradientBG');
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
	doItIn1stRender (f) {
		return this.rAF(f);
	}
	doItIn2ndRender (f) {
  	let SecondRenderFunc = f,
  			rafFunc = function (func) {
  		this.rAF(func);
  	};
  	window.requestAnimationFrame(rafFunc.bind(this, SecondRenderFunc));
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
		//this.TIMER = [];
		//this.TIMER.push('menuButtonClickHandler', Date.now(), '\n');
		console.log('menuButtonClickHandler');
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

	bodyDisableHover () {
		document.body.classList.add('body-disable-hover');
	}
	bodyEnableHover () {
		document.body.classList.remove('body-disable-hover');
	}

	openMenu () {
		//this.TIMER.push('openMenu', Date.now(), '\n');
		this.state.menuIsOpen = true;

		if (this.state.slide1IsActive) {
			this.content = this.slide1;
			this.prepareForOpenMenuIfSlide1IsActive();
		} else {
			this.content = this.slide2;
			this.doItIn1stRender(this.prepareForOpenMenuIfSlide2IsActive.bind(this));
		}

		this.doItIn1stRender(this.drawFlipper);

		this.state.slide1IsActive && (this.parallaxScrollStop = true,
			this.scrollFlipperBeforeRotateDone = true,
			this.doItIn2ndRender(this.makeContentSlideHidden));
		
		window.requestAnimationFrame(this.startWaitParallaxScrollStop.bind(this));
		window.requestAnimationFrame(this.disableMenuButton.bind(this));
		window.requestAnimationFrame(this.startWaitMenuButtonAnimationDone.bind(this));
	}

	prepareForOpenMenuIfSlide1IsActive () {
		this.state.hiBgImageTransformOFF();
		this.state.fullscreenSliderOFF();
	}

	prepareForOpenMenuIfSlide2IsActive () {
		//this.TIMER.push('prepareForOpenMenuIfSlide2IsActive', Date.now(), '\n');
		this.state.fullscreenSliderOFF();
		this.state.cube3dStop();
		this.pauseAndBlurBGVideo();
		this.state.bubblesPauseON();
	}

	pauseAndBlurBGVideo () {
		this.state.bgVideoIsOFF = true;
		if (this.state.deviceIsTouchscreen)
			return this.bgVideoMobile.classList.add('parallax__bg-fullscreen-video_filter-contrast0'),
			this.bgVideoMobile.pause();
		this.bgVideoDesktop.classList.add('parallax__bg-fullscreen-video_filter-contrast0');
		this.bgVideoDesktop.pause();
	}
	playAndClearBGVideo () {
		if (this.state.deviceIsTouchscreen)
			return this.bgVideoMobile.classList.remove('parallax__bg-fullscreen-video_filter-contrast0');
		this.bgVideoDesktop.classList.remove('parallax__bg-fullscreen-video_filter-contrast0');
	}

	drawFlipper () {
    this.contentClone = this.content.cloneNode(true);
    if (!this.state.slide1IsActive) {
    	this.removeSmoothScroll();
    	//this.contentClone.querySelector('.portfolio__Iframe').remove();
    	this.contentClone.querySelector('.portfolio__deviceSlider').remove();
    	
    	this.deleteVideoSoucesInContentClone();
    	this.deleteCube3dInContentClone();
    	this.changeCertsScrollBehavior();
    	this.setFormValue();
    }

    this.menuClone = this.menu.cloneNode(true);
    this.menuClone.classList.remove('hidden');
    this.menuClone.querySelector('.hero').remove();

    /////
    let flipperInnerHTML = '';

    for (let i = 0,
    				 n = 5, 
    				 frontFlipperSide = this.contentClone.outerHTML,
    				 backFlipperSide = this.menuClone.outerHTML; i < n; i++) {

    	flipperInnerHTML += '<div class="fullscreenFlipper__flipper" style="width: ' + 100/n +'%;">'+
    				'<div class="fullscreenFlipper__flipperSide fullscreenFlipper__flipperSide_back">'+
    					'<div class="fullscreenFlipper__sideInnerWrapper" style="width: ' + 100*n +'%; transform: translate3d(-' + 100/n * i +  '%,0,0)">'+
    						backFlipperSide+
    					'</div>'+
    				'</div>'+
    				'<div class="fullscreenFlipper__flipperSide fullscreenFlipper__flipperSide_front">'+
    					'<div class="fullscreenFlipper__sideInnerWrapper" style="width: ' + 100*n +'%; transform: translate3d(-' + 100/n * i +  '%,0,0)">'+
    						frontFlipperSide+
    					'</div>'+
    				'</div>'+
    			'</div>';
    }

    this.flipper.innerHTML = flipperInnerHTML;

    /*let flipperContainerFragment = document.createDocumentFragment();
    for (let i = 0,
    				 n = 5; i < n; i++) {

    	let frontFlipperInnerWrapper = document.createElement('div'),
    			backFlipperInnerWrapper = document.createElement('div'),
    			front = document.createElement('div'),
    			back = document.createElement('div'),
    			flipper = document.createElement('div');

    	flipper.classList.add('fullscreenFlipper__flipper');
      flipper.style.width = 100/n + '%';
    	front.classList.add('fullscreenFlipper__flipperSide', 'fullscreenFlipper__flipperSide_front');
      back.classList.add('fullscreenFlipper__flipperSide', 'fullscreenFlipper__flipperSide_back');
    	frontFlipperInnerWrapper.classList.add('fullscreenFlipper__sideInnerWrapper');
      frontFlipperInnerWrapper.style.width = 100*n +'%';
      backFlipperInnerWrapper.classList.add('fullscreenFlipper__sideInnerWrapper');
      backFlipperInnerWrapper.style.width = 100*n +'%';
      frontFlipperInnerWrapper.style.transform = 'translateX(-' + 100/n * i + '%)';
      backFlipperInnerWrapper.style.transform = 'translateX(-' + 100/n * i + '%)';

    	frontFlipperInnerWrapper.appendChild(this.contentClone.cloneNode(true));
    	backFlipperInnerWrapper.appendChild(this.menuClone.cloneNode(true));

    	front.appendChild(frontFlipperInnerWrapper);
      back.appendChild(backFlipperInnerWrapper);

      flipper.appendChild(front);
      flipper.appendChild(back);

      flipperContainerFragment.appendChild(flipper);
    }
    this.flipper.appendChild(flipperContainerFragment);*/

    ////
    ///

    this.flipper.classList.remove('hidden');
    
    if (!this.state.slide1IsActive) {
    	this.ifScrollStopScrollFlipper();
    	this.cloneCanvas();
    } else {
    	this.flipper.classList.remove('opacity0');
    }

    
    
    ////
    this.drawFlipperDone = true;
    this.contentClone = null;

	}
	ifScrollStopScrollFlipper () {
		if (this.parallaxScrollStop) {
  		this.scrollFlipperBeforeRotate(); ///311ms
  		this.flipperRemoveOpacity0();
  		//this.rAF(this.flipperRemoveOpacity0);
  		//window.requestAnimationFrame(()=>{this.flipper.classList.remove('opacity0');});
  		//window.requestAnimationFrame(this.makeContentSlideHidden.bind(this));
  		//this.doItIn2ndRender(this.makeContentSlideHidden);
  		this.makeContentSlideHidden();
  	} else {
  		window.requestAnimationFrame(this.ifScrollStopScrollFlipper.bind(this));
  	}
	}

	flipperRemoveOpacity0 () {
		console.log('OPACITY',this.flipper.classList.contains('opacity0'));
		this.flipper.classList.remove('opacity0');
	}

	removeSmoothScroll () {
		this.contentClone.querySelector('.parallax__scrollable-container').classList.remove('parallax__scrollable-container_smoothScroll');
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
		this.contentClone.querySelectorAll('#group2 .parallax__layer--back').forEach(function (el) {
			el.classList.remove('parallax__layer--back_desktop-view');
		});
	}
	deleteCube3dInContentClone () {
		let contentCloneCube3d = this.contentClone.querySelector('.cube3d');
		contentCloneCube3d.innerHTML = '';
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
	}
	cloneCanvas () {
		let allCanvasInFlipper = this.flipper.querySelectorAll('.bubbles__canvas'),
		sourceCanvas = document.getElementById('canvas');
		for (let i = 0; i < allCanvasInFlipper.length; i++) {
    	
    	allCanvasInFlipper[i].getContext('2d').drawImage(sourceCanvas, 0, 0);
    }
	}

	scrollFlipperBeforeRotate () {
		//this.TIMER.push('scrollFlipperBeforeRotate', Date.now(), '\n');
		let allParallaxInFlipper = this.flipper.querySelectorAll('.parallax__scrollable-container')/*,
				parallaxScrollValue = this.slide2.querySelector('.parallax__scrollable-container').scrollTop*/;

    /*allParallaxInFlipper.forEach((el)=>{
      el.scrollTop = this.parallaxScrollValue;
      el = null;
    });*/
    for (let i = 0; i < allParallaxInFlipper.length; i++) {
    	allParallaxInFlipper[i].scrollTop = this.parallaxScrollValue;
    }

    let allcertsInFlipper = this.flipper.querySelectorAll('.certification__certificates');
    for (let i = 0; i < allcertsInFlipper.length; i++) {
    	this.state.displayCurrentCertInFlipper(allcertsInFlipper[i]);
    }

    //this.rAF(this.setScrollFlipperBeforeRotateDone.bind(this));
    this.setScrollFlipperBeforeRotateDone();
	}
	setScrollFlipperBeforeRotateDone () {
		/*let allParallaxInFlipper = this.flipper.querySelectorAll('.parallax__scrollable-container');
		for (var i = 0; i < allParallaxInFlipper.length; i++) {
			void(allParallaxInFlipper[i].scrollTop);
			console.log(allParallaxInFlipper[i].scrollTop);
		}*/
		this.scrollFlipperBeforeRotateDone = true;
		console.log(this.parallaxScrollValue);
	}

	recParallaxScrollValue () {
		this.parallaxScrollValue = this.slide2.querySelector('.parallax__scrollable-container').scrollTop;
	}
	startWaitParallaxScrollStop () {
		this.parallaxScrollValue = this.parallaxContainer.scrollTop;
		window.setTimeout(this.waitParallaxScrollStop.bind(this), this.menuButtonAnimationDuration);
	}
	waitParallaxScrollStop () {
		let newParallaxScrollValue = this.parallaxContainer.scrollTop;
		if (newParallaxScrollValue === this.parallaxScrollValue) {
			this.parallaxScrollStop = true;
			console.log("SCROLLSTOP");
		} else {
			this.parallaxScrollValue = newParallaxScrollValue;
			this.doItIn1stRender(this.waitParallaxScrollStop);
		}
	}


	startWaitMenuButtonAnimationDone () {
		// this.menuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2);
  	window.setTimeout(this.waitMenuButtonAnimationDone.bind(this), this.menuButtonAnimationDuration);
	}
	waitMenuButtonAnimationDone () {
		//this.TIMER.push('menuButtonAnimationDoneCheck', Date.now(), '\n');
		if (this.parallaxScrollStop && this.scrollFlipperBeforeRotateDone) {
			let newMenuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2);
	//console.log(this.menuButtonLeftPosition,'---', newMenuButtonLeftPosition, this.menuButtonLeftPosition === newMenuButtonLeftPosition);
			if (this.menuButtonLeftPosition === newMenuButtonLeftPosition && this.drawFlipperDone) {
				if (this.state.menuIsOpen) {
					//this.rAF(this.startFlipperRotate);
					this.doItIn1stRender(this.startFlipperRotate);
				} else {
					//this.rAF(this.flipperRotateBack);
					this.doItIn1stRender(this.flipperRotateBack);
				}
			} else {
				this.menuButtonLeftPosition = newMenuButtonLeftPosition;
				//this.rAF(this.waitMenuButtonAnimationDone);
				//this.doItIn1stRender(this.waitMenuButtonAnimationDone);
				window.requestAnimationFrame(this.waitMenuButtonAnimationDone.bind(this));
			}
		} else {
			window.requestAnimationFrame(this.waitMenuButtonAnimationDone.bind(this));
		}
	}
	
	startWaitFlipperAnimationDone () {
		/*this.flipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);*/
		this.flipperFirstChildPosition = -999999;
		window.setTimeout(this.waitFlipperAnimationDone.bind(this), this.flipperRotationAnimationDuration);
	}
	waitFlipperAnimationDone () {//this.TIMER.push('flipperAnimationDoneCheck', Date.now(), '\n');
		let newFlipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);
//console.log(this.flipperFirstChildPosition,'---', newFlipperFirstChildPosition, this.flipperFirstChildPosition === newFlipperFirstChildPosition);
		if (this.flipperFirstChildPosition === newFlipperFirstChildPosition && newFlipperFirstChildPosition < 0.5) {
			if (this.state.menuIsOpen) {
				this.afterFlipperRotate();
			} else {
				//this.afterFlipperRotateBack();
				window.requestAnimationFrame(this.afterFlipperRotateBack.bind(this));
			}
		} else {
			this.flipperFirstChildPosition = newFlipperFirstChildPosition;
			//this.rAF(this.waitFlipperAnimationDone);
			this.doItIn1stRender(this.waitFlipperAnimationDone);
		}
	}

	makeContentSlideHidden () {
		//this.TIMER.push('flipper1Render', Date.now(), '\n');
		/*this.flipper.classList.remove('hidden');
		this.scrollFlipperBeforeRotate();
		this.flipper.classList.remove('opacity0');//285ms*/

		//this.content.classList.add('hidden');///343ms
		this.content.classList.add('opacity0');

	}
	startFlipperRotate () {
		//this.TIMER.push('flipper2Render', Date.now(), '\n');
		this.menuButton.classList.add('opacity0');
		this.flipper.classList.add('fullscreenFlipper_rotate');

		this.startWaitFlipperAnimationDone();
/*		this.flipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);
		window.setTimeout(this.waitFlipperAnimationDone.bind(this), this.flipperRotationAnimationDuration);*/
	}
	afterFlipperRotate () {
		//this.TIMER.push('flipper3Render', Date.now(), '\n');
		this.menuTicking = false;
		this.menu.classList.remove('hidden');
		//this.flipper.classList.add('hidden');
		this.flipper.classList.add('opacity0');
		this.menuButton.classList.remove('opacity0');

		this.enableMenuButton();
		this.bodyEnableHover();

		this.hero.classList.remove('hidden');

		//alert(this.TIMER);
	}


	closeMenu () {
		this.state.menuIsOpen = false;

		//this.disableMenuButton();
		window.requestAnimationFrame(this.disableMenuButton.bind(this));
		//this.bodyDisableHover();
		window.requestAnimationFrame(this.bodyDisableHover.bind(this));

		this.prepareForCloseMenu();

		this.doItIn1stRender(this.beforeFlipperRotateBack);
		//this.startWaitMenuButtonAnimationDone();
		window.requestAnimationFrame(this.startWaitMenuButtonAnimationDone.bind(this));
	}

	closeMenuIfSlide2IsActive () {
		this.prepareForCloseMenu();

		this.doItIn1stRender(this.beforeFlipperRotateBack);
		//this.rAF(this.beforeFlipperRotateBack);

		this.startWaitMenuButtonAnimationDone();
/*		this.menuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2);
  	window.setTimeout(this.waitMenuButtonAnimationDone.bind(this), this.menuButtonAnimationDuration);*/
	}

	prepareForCloseMenu () {
		this.hero.classList.add('hidden');
	}
	beforeFlipperRotateBack () {
		this.menu.classList.add('hidden');
		//this.flipper.classList.remove('hidden');
		this.flipper.classList.remove('opacity0');
	}
	flipperRotateBack () {
		this.menuButton.classList.add('opacity0');
		this.flipper.classList.remove('fullscreenFlipper_rotate');

		this.startWaitFlipperAnimationDone();
		// this.flipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);
		// window.setTimeout(this.waitFlipperAnimationDone.bind(this), this.flipperRotationAnimationDuration);
	}
	afterFlipperRotateBack () {
		//this.content.classList.remove('hidden');
		this.content.classList.remove('opacity0');
		
		//this.doItIn1stRender(this.afterFlipperRotateBack2Render);
		window.requestAnimationFrame(this.afterFlipperRotateBack2Render.bind(this));
	}
	afterFlipperRotateBack2Render () {
		this.flipper.classList.add('hidden');
		this.menuButton.classList.remove('opacity0');

		this.enableMenuButton();
		this.bodyEnableHover();

		this.afterMenuClose();
	}
	afterMenuClose () {
		this.menuTicking = false;

		this.state.fullscreenSliderON();

		if (this.state.slide1IsActive) {
			this.state.hiBgImageTransformON();

		} else {
			this.state.parallaxScrollUPDATE();
			this.state.cube3dStart();
			//this.state.angleGradientBGON();
			this.playAndClearBGVideo();
			this.state.certificatesResize();
			this.state.portfolioResize();
			this.state.bubblesPauseOFF();
/*			if (this.state.deviceIsTouchscreen) {
				this.bgVideoMobile.play();
				this.bgVideoMobile.classList.remove('parallax__bg-fullscreen-video_filter-contrast0');
			} else {
				this.bgVideoDesktop.play();
				this.bgVideoDesktop.classList.remove('parallax__bg-fullscreen-video_filter-contrast0');
			}*/
		}

		this.cleanFlipper();
	}

	cleanFlipper () {
		this.drawFlipperDone = false;
		this.parallaxScrollStop = false;
		this.scrollFlipperBeforeRotateDone = false;
		this.flipper.innerHTML = '';
		this.flipper.classList.add('opacity0');

    /*let childrens = this.sliderContainer.children;

    for (let i = 0, childrens = this.sliderContainer.children; i < childrens.length; i++) {
      let fullscreenSlider__side = childrens[i];
      while (fullscreenSlider__side.firstChild) {
        fullscreenSlider__side.firstChild.remove();
      }
      
      fullscreenSlider__side = null;
    }*/
  }

  resize () {
  	window.requestAnimationFrame(this.setMenuButtonLeftPosition.bind(this));
  }
  setMenuButtonLeftPosition () {
  	if (this.menuButton) {
  		this.menuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2);
  	}
  }

  heroAnimationOn () {
		this.hero.classList.add('hero_animationON');
	}
	heroAnimationOff () {
		this.hero.classList.remove('hero_animationON');
	}
	resizeHero () {
		if (this.state.deviceIsTouchscreen) {
			if (this.state.menuIsOpen) {
				this.heroAnimationOff();
				window.requestAnimationFrame(()=>{
					this.heroAnimationOn();
				});
			}
		}
	}
}