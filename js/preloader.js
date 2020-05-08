'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Preloader };

class Preloader {
	constructor (State) {
		this.state = State;

		//this.preloaderWrapper = null;
		//this.preloader__topWrapper = null;
		//this.preloader__leftCube = null;
		this.side__top = null;
		this.side__bottom = null;
		this.leftCube = null;
		this.rightCube = null;
		this.bottomCube = null;

		this.main = null;

		this.bottomCubeAnimationDuration = 500+50;
		this.topCubesAnimationDuration = 1000;
		this.cubeSlideOutAnimationDuration = 500+50;

		this.preloaderStartHandlerTimeout = null;
		this.checkBottomCubeIsSlideUpInterval = null;
		this.checkReadyToSlideOutInterval = null;

		this.bottomCubeIsSlideUp = false;
		this.readyToSlideOut = false;
		this.topCubesSlideInIsStart = false;
		this.endStart = false;
	}
	test () {
		//debugger
		//Kraken.count();

		let f = function () {
			window.requestAnimationFrame(this.run.bind(this));
		};
		window.requestAnimationFrame(f.bind(this));
	}
	run () {
		

		let f = function () {

			this.rAF(this.init);
		};
		window.setTimeout(f.bind(this));

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
	init () {
		
		//this.preloaderWrapper = document.getElementById("preloaderWrapper");
		//this.preloader__topWrapper = this.preloaderWrapper.querySelector('.preloader__topWrapper');
		//this.preloader__leftCube = this.preloader__topWrapper.querySelector('.preloader__left-cube');
		this.side__top = document.querySelector('.preloader-side__top');
		this.side__bottom = document.querySelector('.preloader-side__bottom');
		this.leftCube = document.querySelector('.preloader-left-cube');
		this.rightCube = document.querySelector('.preloader-right-cube');
		this.bottomCube = document.querySelector('.preloader-bottom-cube');

		this.main = document.querySelector('.main');

		//this.preloaderWrapper.classList.remove('hidden');
		this.side__top.classList.remove('hidden');
		this.side__bottom.classList.remove('hidden');

		this.addWindowLoadListener();
		this.rAF(this.bottomCubeSlideUp);
		
	}

	bottomCubeSlideUp () {

		if (!this.bottomCubeIsSlideUp) {
			//this.preloaderWrapper.classList.remove('preloader_beforeStart');
			this.bottomCube.classList.add('preloader-bottom-cube_slide-up');

			window.setTimeout(()=>{
				if (!this.bottomCubeIsSlideUp) {

					this.bottomCubeIsSlideUp =  true;
					this.setPreloaderStartHandlerTimeout();
				}
			},this.bottomCubeAnimationDuration);
		}
	}

	setPreloaderStartHandlerTimeout () {

		this.preloaderStartHandlerTimeout = window.setTimeout(this.startTopCubesSlideIn.bind(this), 2500);
	}

	startTopCubesSlideIn () {
		/*this.topCubesSlideInIsStart = true;
		this.rAF(this.topCubesSlideIn);*/
		this.topCubesSlideInIsStart = true;
    this.topCubesSlideIn();
	}

	topCubesSlideIn () {
		//this.preloader__topWrapper.classList.remove('opacity0');
		//this.preloaderWrapper.classList.add('preloader_start');
		this.leftCube.classList.add('preloader-left-cube_slide-in');
		this.rightCube.classList.add('preloader-right-cube_slide-in');
		this.main.classList.remove('hidden');

    window.setTimeout(()=>{
    	
      this.readyToSlideOut = true;
    }, this.topCubesAnimationDuration);

	}

	addWindowLoadListener() {
	  if (document.readyState != 'complete'){
	    let that = this;
	    let f = function (ref) {
	    	window.removeEventListener('load', preloaderEnd);
	    	ref.end();
	    	ref = null;
	    };
	    let preloaderEnd = function () {
	    	return f(that);
	    }
	  	window.addEventListener('load', preloaderEnd);
	  	window.setTimeout(()=>{
	    	if (document.readyState == 'complete') {
	    		if(!this.endStart) {
	    			this.end();
	    		}
	    	}
	    },1000);
	  } else {
	    this.end();
	  }
	}

	end () {
		this.endStart = true;

		this.checkBottomCubeIsSlideUpInterval = window.setInterval(this.continueIfBottomCubeIsSlideUp.bind(this), 300);
	}

	continueIfBottomCubeIsSlideUp () {
		if (this.bottomCubeIsSlideUp) {
			window.clearInterval(this.checkBottomCubeIsSlideUpInterval);

			this.checkTopCubesSlideInIsStartAndContinue();
		}
	}

	checkTopCubesSlideInIsStartAndContinue () {
		if (!this.topCubesSlideInIsStart) {
			window.clearTimeout(this.preloaderStartHandlerTimeout);
			this.startTopCubesSlideIn();
			this.setCheckReadyToSlideOutInterval();
		} else {
			this.setCheckReadyToSlideOutInterval();
		}
	}

	setCheckReadyToSlideOutInterval () {
		this.checkReadyToSlideOutInterval = window.setInterval(this.checkReadyToSlideOut.bind(this), 300);
	}

	checkReadyToSlideOut () {
		
		if (this.readyToSlideOut) {
			window.clearInterval(this.checkReadyToSlideOutInterval);
			this.cubesSlideOut();
		}
	}

	cubesSlideOut () {

		//this.preloaderWrapper.classList.add('preloader_end');
		//this.preloaderWrapper.classList.remove('preloader_bgLikePreloader');
    //this.preloader__leftCube.classList.add('preloader__left-cube_shadow');
    this.side__top.classList.add('preloader-side__top-slide-up');
		this.side__bottom.classList.add('preloader-side__bottom-slide-down');
    this.main.classList.remove('main_darkened');
    document.body.classList.remove('page_bgLikePreloader');

    window.setTimeout(this.deactivation.bind(this),this.cubeSlideOutAnimationDuration+500);
    window.setTimeout(this.setPreloaderIsOffTrue.bind(this), this.cubeSlideOutAnimationDuration);
	}

	setPreloaderIsOffTrue () {
		this.state.preloaderIsOff = true;
	}

	deactivation () {
		//Kraken.count();
		//this.preloaderWrapper.remove();
		this.side__top.remove();
		this.side__bottom.remove();
		//document.body.classList.remove('page_bgLikePreloader');
		//document.body.classList.remove('page_position_fixed');


    this.rAF(this.cleanUp);

    //this.state.preloaderIsOff = true;
	}

	cleanUp () {
		//Kraken.count();
		this.preloaderWrapper = null;
		this.preloader__topWrapper = null;
		this.preloader__leftCube = null;
		this.main = null;
		this.preloaderStartHandlerTimeout = null;
		this.checkBottomCubeIsSlideUpInterval = null;

		
	}
}
