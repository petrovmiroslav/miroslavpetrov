'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { FullscreenSlider };

class FullscreenSlider {
	constructor (State) {
		this.state = State;
    this.state.fullscreenSliderON = this.addFullscreenSliderListeners.bind(this);
    this.state.fullscreenSliderOFF = this.removeFullscreenSliderListeners.bind(this);

		this.body = document.body;
    this.sliderContainer = null;
    this.slide1 = null;
    this.slide2 = null;
    this.parallax = null;
    this.menuButton = null;

		this.touchStartY = 0;
	  this.touchEndY = 0;
	  this.mouseWheelTicking = false;
	  this.slideOutAnimationDuration = 500+100;

		this.checkReadyToInitInterval = null;

		this.touchStartHandlerBind = this.touchStartHandler.bind(this);
		this.touchEndHandlerBind = this.touchEndHandler.bind(this);
		this.keydownHandlerBind = this.keydownHandler.bind(this);
		this.mouseWheelBind = this.mouseWheel.bind(this);
	}

	init () {
		this.state.slide1IsActive = true;

		this.sliderContainer = document.querySelector('.fullscreenSlider');
		this.slide1 = document.querySelector('.slide1');
		this.slide2 = document.querySelector('.slide2');
    this.parallax = document.querySelector('.parallax__content-container');
		this.menuButton = document.querySelector('.menuButton');

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
    this.addTouchListener();
    this.addWheelListener();
    this.addKeyDownListener();
  }
  removeFullscreenSliderListeners () {
    this.removeTouchListener();
    this.removeWheelListener();
    this.removeKeyDownListener();
  }

  addTouchListener () {
    document.addEventListener('touchstart', this.touchStartHandlerBind, false);
    document.addEventListener('touchend', this.touchEndHandlerBind, false); 
  }
  removeTouchListener () {
    document.removeEventListener('touchstart', this.touchStartHandlerBind, false);
    document.removeEventListener('touchend', this.touchEndHandlerBind, false); 
  }
  touchStartHandler (e) {
    this.touchStartY = e.changedTouches[0].clientY;
  }
  touchEndHandler (e) {//debugger
    this.touchEndY = e.changedTouches[0].clientY;
    this.handleSwipe();
  }
  handleSwipe() {
  	if (this.state.slide1IsActive) {
  		if (this.touchEndY - this.touchStartY < -20) {
	      this.slide1SlideOut();
	    }
  	} else {
  		if (this.touchEndY - this.touchStartY > 20) {
	      this.slide1SlideIn();
	    }
  	}
  	this.touchStartY = null;
  	this.touchEndY = null;
  }

  addKeyDownListener () {
    window.addEventListener('keydown', this.keydownHandlerBind);
  }
  removeKeyDownListener () {
    window.removeEventListener('keydown', this.keydownHandlerBind);
  }
  keydownHandler (e) {
  	if (this.state.slide1IsActive) {
  		if (e.keyCode == 40) {
	      this.slide1SlideOut();
	    }
  	} else {
  		if (e.keyCode == 38) {
  			this.slide1SlideIn();
  		}
  	}
  }

  addWheelListener () {
    if (window.addEventListener) {
    	window.addEventListener("wheel", this.mouseWheelBind, false);
    } else {
    	window.onmousewheel = document.onmousewheel = this.mouseWheelBind;
    }
  }
  removeWheelListener () {
    if (window.addEventListener) {
    	window.removeEventListener("wheel", this.mouseWheelBind, false);
    } else {
    	window.onmousewheel = document.onmousewheel = null;
    }
  }
	mouseWheel (event) {
    if (false == !!event) event = window.event;
    let direction = ((event.deltaY) ? event.deltaY/120 : event.deltaY/-3) || false;
    if (direction && !!this.wheelHandler && typeof this.wheelHandler == "function") {
      if (!this.mouseWheelTicking) {
      	this.mouseWheelTicking = true;
        this.wheelHandler(direction);

        window.setTimeout(this.setMouseWheelTickingFalse.bind(this), 1500);
      }
    }
  }
  setMouseWheelTickingFalse () {
  	this.mouseWheelTicking = false;
  }
  wheelHandler (direction) {
    if (this.state.slide1IsActive) {
    	if (direction > 0) {
    		this.slide1SlideOut();
    	}
    } else {
    	if (direction < 0) {
    		this.slide1SlideIn();
    	}
    }
  }

  slide1SlideOut () { console.log('slide1SlideOut');
  	this.prepareForSlideOut();
  	this.drawSlider();

  	/*window.requestAnimationFrame(()=>{
  		return this.rAF(this.slide1SlideOut1Render);
  	});

  	this.rAF(this.addslide1SlideOutGOIn2Render);*/
  	
		this.slide1SlideOut1Render_rAF(this.slide1SlideOut1Render);
		window.requestAnimationFrame(()=>{
  		return this.slide1SlideOutGO_rAF(this.slide1SlideOutGO);
  	});
  	/*this.rAF(()=>{
  		return this.slide1SlideOutGO_rAF(this.slide1SlideOutGO);
  	});*/

  	window.setTimeout(this.makeSliderHidden.bind(this), this.slideOutAnimationDuration);
  	window.setTimeout(this.afterSlide1SlideOut.bind(this), this.slideOutAnimationDuration);
  	
  	/*let o = {
  		1: {
  			a: ,
  			b: ,
  		}

  		1: {
  			a: 'nextRAF(slide1SlideOut1Render)',
  			b: 'this.rAF(this.addslide1SlideOutGOIn2Render)'
  		},
  		2: {
  			a: 'slide1SlideOut1Render()',
  			b: 'nextRAF(this.addslide1SlideOutGOIn2Render)'
  		},
  		3: {
  			a: '',
  			b: 'this.addslide1SlideOutGOIn2Render()'
  		}
  	};*/
  	/*function* gen() {
		  for (let child = this.sliderContainer.children, i = 0; i < child.length; i++) {
	  		//child[i]
	  		Kraken.count();
	  		yield this.rAF(this.sliderGeneratorNext);
	  	}
		};
		this.sliderGenerator = (gen.bind(this))();
		this.sliderGenerator.next();*/
  	
  	/*for (let child = this.sliderContainer.children, i = 0; i < child.length; i++) {
	  		//child[i]
	  		
	  	this.rAF(this.sliderGeneratorNext);
	 	}*/
	 	
  }
  slide1SlideOut1Render_rAF (f) {
		let nextRenderFunc = f;
		let slide1SlideOut1Render_nextRAF = function(func) {
			window.requestAnimationFrame(func.bind(this));
		};
		window.requestAnimationFrame(slide1SlideOut1Render_nextRAF.bind(this, nextRenderFunc));
		nextRenderFunc = null;
		slide1SlideOut1Render_nextRAF = null;
	}
	slide1SlideOutGO_rAF (f) {
		let nextRenderFunc = f;
		let slide1SlideOutGO_nextRAF = function(func) {
			window.requestAnimationFrame(func.bind(this));
		};
		window.requestAnimationFrame(slide1SlideOutGO_nextRAF.bind(this, nextRenderFunc));
		nextRenderFunc = null;
		slide1SlideOutGO_nextRAF = null;
	}

  prepareForSlideOut () {
  	this.removeFullscreenSliderListeners();
  	this.state.hiBgImageTransformOFF();

    this.state.slide1IsActive = false;
  }

  drawSlider () {
  	let childrens = this.sliderContainer.children;

  	for (let i = 1, childrens = this.sliderContainer.children; i < childrens.length; i++) {
			let fullscreenSlider__side = childrens[i],
  				slide1Clone = this.slide1.cloneNode(true);
  		slide1Clone.classList.remove('slide1');    
  		fullscreenSlider__side.appendChild(slide1Clone);
  		fullscreenSlider__side = null;
  		slide1Clone = null;
  	}


	 	/*window.requestAnimationFrame(()=>{
	 		return this.drawSliderInNextRAF(childrens, childrens.length)(this);
	 	});*/
  }

  drawSliderInNextRAF (childrens, length) {
  	return function continueDrawingSliderInNextRAF (that) {
  		let fullscreenSlider__side = childrens[length-1];
  		let slide1Clone = that.slide1.cloneNode(true);
  		slide1Clone.classList.remove('slide1');
  		fullscreenSlider__side.appendChild(slide1Clone);
  		fullscreenSlider__side = null;
  		slide1Clone = null;
  		if (length-1 > 0) {
  			length--;
  			window.requestAnimationFrame(()=>{
  				return continueDrawingSliderInNextRAF(that);
  			});
  		}
  	}
  }

  slide1SlideOut1Render () {

  	//this.body.classList.add('page_fixed');
  	this.menuButton.classList.add('hidden');
  	this.slide1.classList.add('hidden');
  	this.slide2.classList.remove('hidden');
  	this.sliderContainer.classList.remove('hidden');
  }

  addslide1SlideOutGOIn2Render () {
  	return this.rAF(this.slide1SlideOutGO);
  }
  slide1SlideOutGO () {
  	this.sliderContainer.classList.add('fullscreenSlider_ON');
  }
  makeSliderHidden () {
  	this.sliderContainer.classList.add('hidden');
  }

  afterSlide1SlideOut () {
  	//this.body.classList.remove('page_fixed');
  	this.menuButton.classList.remove('hidden');
  	this.addFullscreenSliderListeners();
  }

  sliderGeneratorNext () {
  	return Kraken.count();//this.sliderGenerator.next();
  }


  slide1SlideIn () {
    if(this.parallax.scrollTop <=0) {


      this.prepareForSlideIn();

      this.slide1SlideIn1Render_rAF(this.slide1SlideIn1Render);
      window.requestAnimationFrame(()=>{
        return this.slide1SlideInGO_rAF(this.slide1SlideInGO);
      });

      window.setTimeout(this.slide1SlideInAnimationEnd.bind(this), this.slideOutAnimationDuration);
      window.setTimeout(this.slide1SlideInAnimationEnd2Render_rAF.bind(this, this.makeSliderHidden), this.slideOutAnimationDuration);
      window.setTimeout(this.afterSlide1SlideIn1Render_rAF.bind(this, this.afterSlide1SlideIn2Render_rAF.bind(this, this.afterSlide1SlideIn)), this.slideOutAnimationDuration);
    }
  }

  prepareForSlideIn () {
    this.removeFullscreenSliderListeners();

    this.state.slide1IsActive = true;
  }

  slide1SlideIn1Render_rAF (f) {
    let nextRenderFunc = f;
    let slide1SlideIn1Render_nextRAF = function(func) {
      window.requestAnimationFrame(func.bind(this));
    };
    window.requestAnimationFrame(slide1SlideIn1Render_nextRAF.bind(this, nextRenderFunc));
    nextRenderFunc = null;
    slide1SlideIn1Render_nextRAF = null;
  }
  slide1SlideIn1Render () {
    this.menuButton.classList.add('hidden');
    this.sliderContainer.classList.remove('hidden');
  }

  slide1SlideInGO_rAF (f) {
    let nextRenderFunc = f;
    let slide1SlideInGO_nextRAF = function(func) {
      window.requestAnimationFrame(func.bind(this));
    };
    window.requestAnimationFrame(slide1SlideInGO_nextRAF.bind(this, nextRenderFunc));
    nextRenderFunc = null;
    slide1SlideInGO_nextRAF = null;
  }
  slide1SlideInGO () {
    this.sliderContainer.classList.remove('fullscreenSlider_ON');
  }

  slide1SlideInAnimationEnd () {
    this.slide1.classList.remove('hidden');
    this.slide2.classList.add('hidden');
  }

  slide1SlideInAnimationEnd2Render_rAF (f) {
    let nextRenderFunc = f;
    let slide1SlideInAnimationEnd2Render_nextRAF = function(func) {
      window.requestAnimationFrame(func.bind(this));
    };
    window.requestAnimationFrame(slide1SlideInAnimationEnd2Render_nextRAF.bind(this, nextRenderFunc));
    nextRenderFunc = null;
    slide1SlideInAnimationEnd2Render_nextRAF = null;
  }

  afterSlide1SlideIn1Render_rAF (f) {
    let nextRenderFunc = f;
    let afterSlide1SlideIn1Render_nextRAF = function(func) {
      window.requestAnimationFrame(func.bind(this));
    };
    window.requestAnimationFrame(afterSlide1SlideIn1Render_nextRAF.bind(this, nextRenderFunc));
    nextRenderFunc = null;
    afterSlide1SlideIn1Render_nextRAF = null;
  }
  afterSlide1SlideIn2Render_rAF (f) {
    let nextRenderFunc = f;
    let afterSlide1SlideIn2Render_nextRAF = function(func) {
      window.requestAnimationFrame(func.bind(this));
    };
    window.requestAnimationFrame(afterSlide1SlideIn2Render_nextRAF.bind(this, nextRenderFunc));
    nextRenderFunc = null;
    afterSlide1SlideIn2Render_nextRAF = null;
  }
  afterSlide1SlideIn () {
    this.menuButton.classList.remove('hidden');
    this.state.hiBgImageTransformON();
    this.addFullscreenSliderListeners();

    this.cleanSlider();
  }

  cleanSlider () {
    let childrens = this.sliderContainer.children;

    for (let i = 0, childrens = this.sliderContainer.children; i < childrens.length; i++) {
      let fullscreenSlider__side = childrens[i];
      while (fullscreenSlider__side.firstChild) {
        fullscreenSlider__side.firstChild.remove();
      }
      
      fullscreenSlider__side = null;
    }
  }
}