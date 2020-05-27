'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Menu };

class Menu {
	constructor (State) {
		this.state = State;

		this.menuButton = null;
		this.menuButtonCheckbox = null;
		this.menu = null;
		this.content = null;
		this.contentClone = null;
		this.menuClone = null;
		this.slide1 = null;
		this.slide2 = null;
		this.flipper = null;
		this.cube3dLoadingWrapper = null;
		this.bgVideoMobile = null;
		this.bgVideoDesktop = null;
		this.angleBGGradientAnimationLayer = null;
		this.allParallaxInFlipper = null;

		this.menuButtonLeftPosition = null;
		this.flipperFirstChildPosition = null;
		this.parallaxScrollValue = null;
		this.menuButtonAnimationDuration = 250;
		this.flipperRotationAnimationDuration = 700;

		this.checkReadyToInitInterval = null;
		this.drawFlipperDone = null;

		this.menuButtonClickHandlerBind = this.menuButtonClickHandler.bind(this);
	}

	init () {
		this.menuButton = document.querySelector('.menuButton__lines-wrapper');
		this.menuButtonCheckbox = document.getElementById('menuButton__checkbox');
		this.menu = document.querySelector('.menu');
		this.slide1 = document.querySelector('.slide1');
		this.slide2 = document.querySelector('.slide2');
		this.flipper = document.querySelector('.fullscreenFlipper');
		this.cube3dLoadingWrapper = this.slide2.querySelector('.cube3dLoadingWrapper');
		this.bgVideoMobile = this.slide2.querySelector('.parallax__bg-fullscreen-video_mobile-view');
		this.bgVideoDesktop = this.slide2.querySelector('.parallax__bg-fullscreen-video_desktop-view');
		this.angleBGGradientAnimationLayer = this.slide2.querySelector('.angleBGGradientAnimationLayer');


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
		if (this.state.preloaderIsOff) {
			window.clearInterval(this.checkReadyToInitInterval);
			this.addMenuButtonClickListener();
		}
	}

	addMenuButtonClickListener () {
		this.menuButton.addEventListener('click', this.menuButtonClickHandlerBind);
	}
	removeMenuButtonClickListener () {
		this.menuButton.removeEventListener('click', this.menuButtonClickHandlerBind);
	}

	menuButtonClickHandler () {
		//this.TIMER = [];
		//this.TIMER.push('menuButtonClickHandler', Date.now(), '\n');
		console.log('menuButtonClickHandler');

		if (!this.state.menuIsOpen) {
			this.openMenu();
		} else {
			this.closeMenu();
		}
	}

	disableMenuButton () {
		this.menuButton.classList.add('menuButton__lines-wrapper_pointer-events_none');
	}
	enableMenuButton () {
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

		this.disableMenuButton();
		this.bodyDisableHover();

		//this.rAF(this.validateMenuButtonCheckbox);
		this.doItIn1stRender(this.validateMenuButtonCheckbox);

		/*if (this.state.slide1IsActive) {
			this.content = this.slide1;
			this.openMenuIfSlide1IsActive();
		} else {
			this.content = this.slide2;
			this.openMenuIfSlide2IsActive();
		}*/
		if (this.state.slide1IsActive) {
			this.content = this.slide1;
			this.prepareForOpenMenuIfSlide1IsActive();
		} else {
			this.content = this.slide2;
			this.prepareForOpenMenuIfSlide2IsActive();
		}

		this.doItIn1stRender(this.drawFlipper);

		this.doItIn2ndRender(this.makeContentSlideHidden);

		this.startWaitMenuButtonAnimationDone();
	}

	validateMenuButtonCheckbox () {
		let value = this.menuButtonCheckbox.checked,
				menuIsOpen = this.state.menuIsOpen;

		if (menuIsOpen) {
			if (!value) {
				this.menuButtonCheckbox.checked = true;
			}
		} else {
			if (value) {
				this.menuButtonCheckbox.checked = false;
			}
		}
	}

	/*openMenuIfSlide1IsActive () {
		this.prepareForOpenMenuIfSlide1IsActive();

		this.doItIn1stRender(this.drawFlipper);

		this.doItIn2ndRender(this.makeContentSlideHidden);

		this.startWaitMenuButtonAnimationDone();
	}*/

	prepareForOpenMenuIfSlide1IsActive () {
		this.state.hiBgImageTransformOFF();
		this.state.fullscreenSliderOFF();

		
	}

	openMenuIfSlide2IsActive () {
	//this.TIMER.push('openMenuIfSlide2IsActive', Date.now(), '\n');

		this.prepareForOpenMenuIfSlide2IsActive();

		this.doItIn1stRender(this.drawFlipper);
		//this.rAF(this.drawFlipper);
		
  	this.doItIn2ndRender(this.makeContentSlideHidden);
/*  	window.requestAnimationFrame(()=>{
        return this.rAF(this.makeContentSlideHidden);
      });*/
  	
  	this.startWaitMenuButtonAnimationDone();
/*  	this.menuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2);
  	window.setTimeout(this.waitMenuButtonAnimationDone.bind(this), this.menuButtonAnimationDuration);*/
	}

	prepareForOpenMenuIfSlide2IsActive () {
		//this.TIMER.push('prepareForOpenMenuIfSlide2IsActive', Date.now(), '\n');

		this.state.fullscreenSliderOFF();

		this.cube3dLoadingWrapper.classList.add('hidden');

		this.pauseAndBlurBGVideo();
/*		if (this.state.deviceIsTouchscreen) {
			this.bgVideoMobile.classList.add('parallax__bg-fullscreen-video_filter-contrast0');
			this.bgVideoMobile.pause();
		} else {
			this.bgVideoDesktop.classList.add('parallax__bg-fullscreen-video_filter-contrast0');
			this.bgVideoDesktop.pause();
		}*/
		
		this.angleBGGradientAnimationLayer.classList.add('animationNone');///////////////////////////////REPLACE CLASSNAME
	}

	pauseAndBlurBGVideo () {
		if (this.state.deviceIsTouchscreen) {
			this.bgVideoMobile.classList.add('parallax__bg-fullscreen-video_filter-contrast0');
			this.bgVideoMobile.pause();
		} else {
			this.bgVideoDesktop.classList.add('parallax__bg-fullscreen-video_filter-contrast0');
			this.bgVideoDesktop.pause();
		}
	}
	playAndClearBGVideo () {
		if (this.state.deviceIsTouchscreen) {
			this.bgVideoMobile.play();
			this.bgVideoMobile.classList.remove('parallax__bg-fullscreen-video_filter-contrast0');
		} else {
			this.bgVideoDesktop.play();
			this.bgVideoDesktop.classList.remove('parallax__bg-fullscreen-video_filter-contrast0');
		}
	}

	drawFlipper () {
    this.contentClone = this.content.cloneNode(true);
    if (!this.state.slide1IsActive) {
    	this.deleteVideoSoucesInContentClone();
    }

    this.menuClone = this.menu.cloneNode(true);
    this.menuClone.classList.remove('hidden');

    /////
    let flipperInnerHTML = '';

    for (let i = 0,
    				 n = 5, 
    				 frontFlipperSide = this.contentClone.outerHTML,
    				 backFlipperSide = this.menuClone.outerHTML; i < n; i++) {

    	flipperInnerHTML += '<div class="fullscreenFlipper__flipper" style="width: ' + 100/n +'%;">'+
    				'<div class="fullscreenFlipper__flipperSide fullscreenFlipper__flipperSide_front">'+
    					'<div class="fullscreenFlipper__sideInnerWrapper" style="width: ' + 100*n +'%; transform: translateX(-' + 100/n * i + '%);">'+
    						frontFlipperSide+
    					'</div>'+
    				'</div>'+
    				'<div class="fullscreenFlipper__flipperSide fullscreenFlipper__flipperSide_back">'+
    					'<div class="fullscreenFlipper__sideInnerWrapper" style="width: ' + 100*n +'%; transform: translateX(-' + 100/n * i + '%);">'+
    						backFlipperSide+
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
    	this.scrollFlipperBeforeRotate(); ///311ms
    }
    this.flipper.classList.remove('opacity0');
    ////
    this.drawFlipperDone = true;
    this.contentClone = null;

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
	scrollFlipperBeforeRotate () {
		//this.TIMER.push('scrollFlipperBeforeRotate', Date.now(), '\n');
		let allParallaxInFlipper = this.flipper.querySelectorAll('.parallax__content-container'),
				parallaxScrollValue = this.slide2.querySelector('.parallax__content-container').scrollTop;

    allParallaxInFlipper.forEach((el)=>{
      el.scrollTop = parallaxScrollValue;
      el = null;
    });
	}

	startWaitMenuButtonAnimationDone () {
		this.menuButtonLeftPosition = this.state.roundTo(this.menuButton.getBoundingClientRect().x, 2);
  	window.setTimeout(this.waitMenuButtonAnimationDone.bind(this), this.menuButtonAnimationDuration);
	}
	waitMenuButtonAnimationDone () {
		//this.TIMER.push('menuButtonAnimationDoneCheck', Date.now(), '\n');
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
			this.doItIn1stRender(this.waitMenuButtonAnimationDone);
		}
	}
	
	startWaitFlipperAnimationDone () {
		this.flipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);
		window.setTimeout(this.waitFlipperAnimationDone.bind(this), this.flipperRotationAnimationDuration);
	}
	waitFlipperAnimationDone () {//this.TIMER.push('flipperAnimationDoneCheck', Date.now(), '\n');
		let newFlipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);
//console.log(this.flipperFirstChildPosition,'---', newFlipperFirstChildPosition, this.flipperFirstChildPosition === newFlipperFirstChildPosition);
		if (this.flipperFirstChildPosition === newFlipperFirstChildPosition) {
			if (this.state.menuIsOpen) {
				this.afterFlipperRotate();
			} else {
				this.afterFlipperRotateBack();
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
		
		this.content.classList.add('hidden');///343ms
		//this.slide2.classList.add('hidden');///343ms
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
		this.menu.classList.remove('hidden');
		this.flipper.classList.add('hidden');
		this.menuButton.classList.remove('opacity0');

		this.enableMenuButton();
		this.bodyEnableHover();

		//alert(this.TIMER);
	}


	closeMenu () {
		this.state.menuIsOpen = false;

		this.disableMenuButton();
		this.bodyDisableHover();

		this.doItIn1stRender(this.validateMenuButtonCheckbox);
		//this.rAF(this.validateMenuButtonCheckbox);

		/*if (this.state.slide1IsActive) {
			this.closeMenuIfSlide1IsActive();
		} else {
			this.closeMenuIfSlide2IsActive();
		}*/
		this.prepareForCloseMenu();

		this.doItIn1stRender(this.beforeFlipperRotateBack);
		this.startWaitMenuButtonAnimationDone();
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

	}
	beforeFlipperRotateBack () {
		this.menu.classList.add('hidden');
		this.flipper.classList.remove('hidden');
	}
	flipperRotateBack () {
		this.menuButton.classList.add('opacity0');
		this.flipper.classList.remove('fullscreenFlipper_rotate');

		this.startWaitFlipperAnimationDone();
		// this.flipperFirstChildPosition = this.state.roundTo(this.flipper.firstElementChild.getBoundingClientRect().x, 2);
		// window.setTimeout(this.waitFlipperAnimationDone.bind(this), this.flipperRotationAnimationDuration);
	}
	afterFlipperRotateBack () {
		//this.slide2.classList.remove('hidden');
		this.content.classList.remove('hidden');
		
		this.doItIn1stRender(this.afterFlipperRotateBack2Render);
		//this.rAF(this.afterFlipperRotateBack2Render);
	}
	afterFlipperRotateBack2Render () {
		this.flipper.classList.add('hidden');
		this.menuButton.classList.remove('opacity0');

		this.enableMenuButton();
		this.bodyEnableHover();

		this.afterMenuClose();
	}
	afterMenuClose () {
		this.state.fullscreenSliderON();

		if (this.state.slide1IsActive) {
			this.state.hiBgImageTransformON();

		} else {
			this.cube3dLoadingWrapper.classList.remove('hidden');
			this.angleBGGradientAnimationLayer.classList.remove('animationNone');
			this.playAndClearBGVideo();
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
		this.flipper.innerHTML = null;

    /*let childrens = this.sliderContainer.children;

    for (let i = 0, childrens = this.sliderContainer.children; i < childrens.length; i++) {
      let fullscreenSlider__side = childrens[i];
      while (fullscreenSlider__side.firstChild) {
        fullscreenSlider__side.firstChild.remove();
      }
      
      fullscreenSlider__side = null;
    }*/
  }
}