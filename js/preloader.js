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
		this.topCubesAnimationDuration = 700+50;
		this.cubeSlideOutAnimationDuration = 500+50;

		this.bottomCubePosition = null;
		this.rightCubePosition = null;
		this.topSideCubePosition = null;
		this.preloaderStartHandlerTimeout = null;
		this.checkBottomCubeIsSlideUpInterval = null;
		this.checkReadyToSlideOutInterval = null;

		this.bottomCubeIsSlideUp = false;
		this.readyToSlideOut = false;
		this.topCubesSlideInIsStart = false;
		this.endStart = false;
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
		this.bottomCube.classList.add('preloader-bottom-cube_slide-up');
		this.startWaitBottomCubeSlideUpAnimationDone();
		/*if (!this.bottomCubeIsSlideUp) {
			//this.preloaderWrapper.classList.remove('preloader_beforeStart');
			
			void(this.bottomCube.offsetHeight);
			this.bottomCube.classList.add('preloader-bottom-cube_slide-up');

			window.setTimeout(()=>{
				if (!this.bottomCubeIsSlideUp) {

					this.bottomCubeIsSlideUp =  true;
					this.setPreloaderStartHandlerTimeout();
				}
			},this.bottomCubeAnimationDuration);
		}*/
	}
	startWaitBottomCubeSlideUpAnimationDone () {
		this.bottomCubePosition = this.state.roundTo(this.bottomCube.getBoundingClientRect().y, 2);
		window.setTimeout(this.waitBottomCubeSlideUpAnimationDone.bind(this), this.bottomCubeAnimationDuration);
	}
	waitBottomCubeSlideUpAnimationDone () {
		let newbottomCubePosition = this.state.roundTo(this.bottomCube.getBoundingClientRect().y, 2);
		if (this.bottomCubePosition === newbottomCubePosition) {
			this.bottomCubeIsSlideUp =  true;
			this.setPreloaderStartHandlerTimeout();
		} else {
			this.bottomCubePosition = newbottomCubePosition;
			this.rAF(this.waitBottomCubeSlideUpAnimationDone);
		}
	}


	setPreloaderStartHandlerTimeout () {
		this.preloaderStartHandlerTimeout = window.setTimeout(this.startTopCubesSlideIn.bind(this), 2500);
	}

	startTopCubesSlideIn () {
		this.topCubesSlideInIsStart = true;
		this.rAF(this.topCubesSlideIn);
		/*this.topCubesSlideInIsStart = true;
    this.topCubesSlideIn();*/
	}

	topCubesSlideIn () {
		//this.preloader__topWrapper.classList.remove('opacity0');
		//this.preloaderWrapper.classList.add('preloader_start');
		this.leftCube.classList.add('preloader-left-cube_slide-in');
		this.rightCube.classList.add('preloader-right-cube_slide-in');
		this.main.classList.remove('hidden');

		this.startWaitRightCubeSlideUpAnimationDone();
    /*window.setTimeout(()=>{
    	
      this.readyToSlideOut = true;

    }, this.topCubesAnimationDuration);*/
	}
	startWaitRightCubeSlideUpAnimationDone () {
		this.rightCubePosition = this.state.roundTo(this.rightCube.getBoundingClientRect().x, 2);
		window.setTimeout(this.waitRightCubeSlideUpAnimationDone.bind(this), this.topCubesAnimationDuration);
	}
	waitRightCubeSlideUpAnimationDone () {
		let newRightCubePosition = this.state.roundTo(this.rightCube.getBoundingClientRect().x, 2);
		if (this.rightCubePosition === newRightCubePosition) {
			this.readyToSlideOut = true;
		} else {
			this.rightCubePosition = newRightCubePosition;
			this.rAF(this.waitRightCubeSlideUpAnimationDone);
		}
	}

	addWindowLoadListener() {
	  if (document.readyState != 'complete'){
	    let that = this;
	    let f = function (ref) {
	    	window.removeEventListener('load', preloaderEnd);
	    	if(!ref.endStart) {
	    		ref.end();
	    	}
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

    this.startWaitCubeSlideOutAnimationDone();
    //window.setTimeout(this.deactivation.bind(this),this.cubeSlideOutAnimationDuration+500);
    //window.setTimeout(this.setPreloaderIsOffTrue.bind(this), this.cubeSlideOutAnimationDuration);
	}
	startWaitCubeSlideOutAnimationDone () {
		this.topSideCubePosition = this.state.roundTo(this.side__top.getBoundingClientRect().y, 2);
		window.setTimeout(this.waitCubeSlideOutAnimationDone.bind(this), this.cubeSlideOutAnimationDuration);
	}
	waitCubeSlideOutAnimationDone () {
		let newTopSideCubePosition = this.state.roundTo(this.side__top.getBoundingClientRect().y, 2);
		if (this.topSideCubePosition === newTopSideCubePosition && newTopSideCubePosition < 0) {
			this.setPreloaderIsOffTrue();
			this.deactivation();
		} else {
			this.topSideCubePosition = newTopSideCubePosition;
			this.rAF(this.waitCubeSlideOutAnimationDone);
		}
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
