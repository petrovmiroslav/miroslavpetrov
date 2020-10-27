'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { FullscreenSlider };

class FullscreenSlider {
	constructor (State) {
		this.state = State;
    this.state.slide1IsActive = true;
    this.state.fullscreenSliderON = this.addFullscreenSliderListeners.bind(this);
    this.state.fullscreenSliderOFF = this.removeFullscreenSliderListeners.bind(this);

		this.body = document.body;
    this.sliderContainer = {};
    this.slide1 = {};
    this.slide2 = {};
    this.parallax = {};
    this.menuButton = {};
    this.sliderSides = {};
    this.sliderSidesImgs = [];

		this.touchStartY = this.deltaTouch = this.mouseWheelTickingTimeout = this.sideTopPosition = this.checkReadyToInitInterval = 0;
	  this.mouseWheelTicking = false;
	  this.slideOutAnimationDuration = 500+100;
	 
    this.setMouseWheelTickingFalseBind = this.setMouseWheelTickingFalse.bind(this);
		this.touchStartHandlerBind = this.touchStartHandler.bind(this);
		this.touchEndHandlerBind = this.touchEndHandler.bind(this);
		this.keydownHandlerBind = this.keydownHandler.bind(this);
		this.mouseWheelBind = this.mouseWheel.bind(this);
    this.sliderTransitionEndBind = this.sliderTransitionEnd.bind(this);
	}

	init () {
		this.sliderContainer = document.querySelector('.fullscreenSlider');
    this.sliderSides = this.sliderContainer.querySelectorAll('.fullscreenSlider__side');
		this.slide1 = document.querySelector('.slide1');
		this.slide2 = document.querySelector('.slide2');
    this.parallax = document.querySelector('.parallax__scrollable-container');
		this.menuButton = document.querySelector('.menuButton');
    for (let i = this.sliderSides.length - 1; i >= 0; i--) {
      this.sliderSidesImgs.push(Array.prototype.slice.call(this.sliderSides[i].querySelectorAll('.hiScreen__bg-image')));
    }
		this.setCheckReadyToInitInterval();
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

	setCheckReadyToInitInterval () {
		this.checkReadyToInitInterval = window.setInterval(this.checkReadyToInit.bind(this), 300);
	}

	checkReadyToInit () {
		if (this.state.preloaderIsOff) {
			window.clearInterval(this.checkReadyToInitInterval);
			this.addFullscreenSliderListeners();
		}
	}

	addFullscreenSliderListeners () {
    this.state.deviceIsTouchscreen ? this.addTouchListener() : this.addWheelListener();
    this.addKeyDownListener();
  }
  removeFullscreenSliderListeners () {
    this.state.deviceIsTouchscreen ? this.removeTouchListener() : this.removeWheelListener();
    this.removeKeyDownListener();
  }

  addTouchListener () {
    document.addEventListener('touchstart', this.touchStartHandlerBind, this.state.passiveListener);
    document.addEventListener('touchend', this.touchEndHandlerBind, this.state.passiveListener); 
  }
  removeTouchListener () {
    document.removeEventListener('touchstart', this.touchStartHandlerBind, this.state.passiveListener);
    document.removeEventListener('touchend', this.touchEndHandlerBind, this.state.passiveListener); 
  }
  touchStartHandler (e) {
    this.touchStartY = e.changedTouches[0].clientY;
  }
  touchEndHandler (e) {
    if (this.sliderTicking()) return;
    this.deltaTouch = e.changedTouches[0].clientY - this.touchStartY;
    this.handleSwipe();
  }
  handleSwipe() {
    if (this.state.slide1IsActive)
      return this.deltaTouch < -20 && this.slide1SlideOut();
    this.deltaTouch > 20 && this.slide1SlideIn();
  }

  addKeyDownListener () {
    window.addEventListener('keydown', this.keydownHandlerBind, this.state.passiveListener);
  }
  removeKeyDownListener () {
    window.removeEventListener('keydown', this.keydownHandlerBind, this.state.passiveListener);
  }
  keydownHandler (e) {
    if (this.sliderTicking()) return;
    if (this.state.slide1IsActive)
      return e.keyCode == 40 && this.slide1SlideOut();
    e.keyCode == 38 && this.slide1SlideIn();
  }

  addWheelListener () {
    if (window.addEventListener)
      return window.addEventListener("wheel", this.mouseWheelBind, this.state.passiveListener);
    window.onmousewheel = document.onmousewheel = this.mouseWheelBind;
  }
  removeWheelListener () {
    if (window.addEventListener) 
      return window.removeEventListener("wheel", this.mouseWheelBind, this.state.passiveListener);
    window.onmousewheel = document.onmousewheel = null;
  }
	mouseWheel (event) {
    if (this.sliderTicking()) return;
    false == !!event && (event = window.event);
    let direction = ((event.deltaY) ? event.deltaY/120 : event.deltaY/-3) || false;
    if (direction && !!this.wheelHandler && typeof this.wheelHandler == "function") {
      this.mouseWheelTicking = true;
      this.wheelHandler(direction);
      this.mouseWheelTickingTimeout = window.setTimeout(this.setMouseWheelTickingFalseBind, 1000);
    }
  }
  setMouseWheelTickingFalse () {
  	this.mouseWheelTicking = false;
  }
  wheelHandler (direction) {
    if (this.state.slide1IsActive)
      return direction > 0 && this.slide1SlideOut();
    direction < 0 && this.slide1SlideIn();
  }

  sliderTicking () {
    return this.state.fullscreenSliderPause || this.mouseWheelTicking || this.state.cube3dBlockSlider;
  }

  slide1SlideOut () {
    this.prepareForSlideOut();
    this.prepareSlider();
    this.menuButton.classList.add('opacity0');
    this.slide1.classList.add('hidden');
    this.sliderContainer.classList.remove('hidden');
    this.slide2.classList.remove('opacity0');
    this.rAF(this.slide1SlideOutGO);
    this.startWaitSliderAnimationDone();
  }

  prepareSlider () {
    for (let i = this.sliderSides.length - 1; i >= 0; i--) {
      if (!this.state.hiBgImageMini && this.sliderSidesImgs[i].length > 1) {
        this.sliderSidesImgs[i][0].remove();
        this.sliderSidesImgs[i][1].classList.remove('hidden');
        this.sliderSidesImgs[i][1].classList.add('hiScreen__bg-image_lazy-afterLoad');
        this.state.hiBgImageBlured || this.sliderSidesImgs[i][1].classList.remove('hiScreen__bg-image_blurred');
        this.sliderSidesImgs[i].shift();
      }

      if (this.state.deviceIsTouchscreen) continue;
      for (let j = this.sliderSidesImgs[i].length - 1; j >= 0; j--) {
        this.sliderSidesImgs[i][j].style.transform = `scale(1.2) translate(${this.state.hiBgImageTransform[0]}%, ${this.state.hiBgImageTransform[1]}%)`;
      }
    }
  }
  prepareForSlideOut () {
  	this.removeFullscreenSliderListeners();
  	this.state.deviceIsTouchscreen || this.state.hiBgImageTransformOFF();

    this.state.slide1IsActive = false;
  }

  slide1SlideOutGO () {
  	this.sliderContainer.classList.add('fullscreenSlider_ON');
  }
  startWaitSliderAnimationDone () {
    if (this.state.transitionEventSupport)
      return this.sliderSides[0].addEventListener('transitionend', this.sliderTransitionEndBind);
		this.sideTopPosition = this.state.roundTo(this.sliderSides[0].getBoundingClientRect().x, 2);
		window.setTimeout(this.waitSliderAnimationDone.bind(this), this.slideOutAnimationDuration);
	}
  sliderTransitionEnd (e) {
    if (e.target.parentNode.id !== 'slider') return;
    this.sliderSides[0].removeEventListener('transitionend', this.sliderTransitionEndBind);
    this.state.slide1IsActive ? this.slide1SlideInAnimationEnd() : this.afterSlide1SlideOut();
  }
	waitSliderAnimationDone () {
		let newSideTopPosition = this.state.roundTo(this.sliderSides[0].getBoundingClientRect().x, 2);
		if (!this.state.slide1IsActive) {
			if (this.sideTopPosition === newSideTopPosition && newSideTopPosition < 0) {
				return this.afterSlide1SlideOut();
			}
		} else {
			if (this.sideTopPosition === newSideTopPosition && newSideTopPosition === 0) {
				return this.slide1SlideInAnimationEnd();
			}
		}
		this.sideTopPosition = newSideTopPosition;
		this.rAF(this.waitSliderAnimationDone);
	}

  afterSlide1SlideOut () {
  	this.sliderContainer.classList.add('hidden');
  	this.menuButton.classList.remove('opacity0');
  	this.addFullscreenSliderListeners();
    this.state.parallaxScrollUPDATE();
    this.state.certificatesResize();
    this.state.portfolioResize();
    this.state.bubblesPauseOFF();
    this.state.drawCube3dDone ? this.state.cube3dStart() : this.rAF(this.state.cube3dCreate);
  }

  slide1SlideIn () {
    if(this.parallax.scrollTop > 0) return;
    window.clearTimeout(this.state.paralaxScrollTickingTimeout);
    this.prepareForSlideIn();
    this.menuButton.classList.add('opacity0');
    this.sliderContainer.classList.remove('hidden');
    this.rAF(this.slide1SlideInGO);
    this.startWaitSliderAnimationDone();
  }

  prepareForSlideIn () {
    this.removeFullscreenSliderListeners();
    this.state.cube3dStop();
    this.state.bubblesPauseON();
    this.state.slide1IsActive = true;
  }

  slide1SlideInGO () {
    this.sliderContainer.classList.remove('fullscreenSlider_ON');
  }

  slide1SlideInAnimationEnd () {
    this.sliderContainer.classList.add('hidden');
    this.menuButton.classList.remove('opacity0');
    this.slide1.classList.remove('hidden');
    this.slide2.classList.add('opacity0');
    this.addFullscreenSliderListeners();
    this.state.deviceIsTouchscreen || this.state.hiBgImageTransformON();
  }
}