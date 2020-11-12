'use strict';
export class Preloader {
	constructor (State) {
		this.state = State;

		this.side_top = {};
		this.side_bottom = {};
		this.leftCube = {};
		this.rightCube = {};
		this.bottomCube = {};

		this.bottomCubeAnimationDuration = 500+50;
		this.topCubesAnimationDuration = 1800+50;
		this.cubeSlideOutAnimationDuration = 500+50;

		this.bottomCubePosition = this.rightCubePosition = this.topSideCubePosition = this.preloaderStartHandlerTimeout = this.checkBottomCubeIsSlideUpTimeout = this.checkReadyToSlideOutTimeout = 0;

		this.bottomCubeIsSlideUp = this.readyToSlideOut = this.topCubesSlideInIsStart = this.endStart = false;

		this.bottomCubeTransitionEndBind = this.bottomCubeTransitionEnd.bind(this);
		this.topCubesSlideInBind = this.topCubesSlideIn.bind(this);
		this.rightCubeTransitionEndBind = this.rightCubeTransitionEnd.bind(this);
		this.windowLoadHandlerBind = this.windowLoadHandler.bind(this);
		this.continueIfBottomCubeIsSlideUpBind = this.continueIfBottomCubeIsSlideUp.bind(this);
		this.checkReadyToSlideOutBind = this.checkReadyToSlideOut.bind(this);
		this.cubeSideTransitionEndBind = this.cubeSideTransitionEnd.bind(this);
		this.waitCubeSlideOutAnimationDoneBind = this.waitCubeSlideOutAnimationDone.bind(this);
		this.waitBottomCubeSlideUpAnimationDoneBind = this.waitBottomCubeSlideUpAnimationDone.bind(this);
		this.waitRightCubeSlideUpAnimationDoneBind = this.waitRightCubeSlideUpAnimationDone.bind(this);
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
		this.side_top = document.querySelector('.preloaderSide_top');
		this.side_bottom = document.querySelector('.preloaderSide_bottom');
		this.leftCube = document.querySelector('.preloaderCube_left');
		this.rightCube = document.querySelector('.preloaderCube_right');
		this.bottomCube = document.querySelector('.preloaderCube_bottom');
		this.imgLazy = document.querySelector('.hiScreen__bg-image_lazy');
		document.readyState === 'complete' ? this.end() : this.addWindowLoadListener();
		this.rAF(this.bottomCubeSlideUp);
	}
	cubeSlideIn (cube) {
		cube.classList.add('preloaderCube_slideIn');
		cube = null;
	}
	bottomCubeSlideUp () {
		this.cubeSlideIn(this.bottomCube);
		this.startWaitBottomCubeSlideUpAnimationDone();
	}
	startWaitBottomCubeSlideUpAnimationDone () {
		if (this.state.transitionEventSupport)
			return this.bottomCube.addEventListener('transitionend', this.bottomCubeTransitionEndBind);
		this.bottomCubePosition = this.state.roundTo(this.bottomCube.getBoundingClientRect().y, 2);
		window.setTimeout(this.waitBottomCubeSlideUpAnimationDoneBind, this.bottomCubeAnimationDuration);
	}
	bottomCubeTransitionEnd (e) {
		if (e.target.parentNode.id !== 'preloaderSide_bottom') return;
		this.bottomCube.removeEventListener('transitionend', this.bottomCubeTransitionEndBind);
		this.bottomCubeIsSlideUp =  true;
		this.setPreloaderStartHandlerTimeout();
	}
	waitBottomCubeSlideUpAnimationDone () {
		let newbottomCubePosition = this.state.roundTo(this.bottomCube.getBoundingClientRect().y, 2);
		if (this.bottomCubePosition === newbottomCubePosition) 
			return this.bottomCubeIsSlideUp =  true,
			this.setPreloaderStartHandlerTimeout();

		this.bottomCubePosition = newbottomCubePosition;
		this.rAF(this.waitBottomCubeSlideUpAnimationDone);
	}

	setPreloaderStartHandlerTimeout () {
		this.preloaderStartHandlerTimeout = window.setTimeout(this.topCubesSlideInBind, 2500);
	}

	topCubesSlideIn () {
		if (this.topCubesSlideInIsStart) return;
		this.topCubesSlideInIsStart = true;
		this.cubeSlideIn(this.leftCube);
		this.cubeSlideIn(this.rightCube);
		this.startWaitRightCubeSlideUpAnimationDone();
	}
	startWaitRightCubeSlideUpAnimationDone () {
		if (this.state.transitionEventSupport)
			return this.rightCube.addEventListener('transitionend', this.rightCubeTransitionEndBind);
		this.rightCubePosition = this.state.roundTo(this.rightCube.getBoundingClientRect().x, 2);
		window.setTimeout(this.waitRightCubeSlideUpAnimationDoneBind, this.topCubesAnimationDuration);
	}
	rightCubeTransitionEnd (e) {
		if (e.target.parentNode.id !== 'preloaderSide_top') return;
		this.rightCube.removeEventListener('transitionend', this.rightCubeTransitionEndBind);
		this.readyToSlideOut = true;
	}
	waitRightCubeSlideUpAnimationDone () {
		let newRightCubePosition = this.state.roundTo(this.rightCube.getBoundingClientRect().x, 2);
		if (this.rightCubePosition === newRightCubePosition) return this.readyToSlideOut = true;
		this.rightCubePosition = newRightCubePosition;
		this.rAF(this.waitRightCubeSlideUpAnimationDone);
	}
	windowLoadHandler () {
		window.removeEventListener('load', this.windowLoadHandlerBind);
		this.endStart || this.end();
	}
	addWindowLoadListener () {
		window.addEventListener('load', this.windowLoadHandlerBind);
	}

	end () {
		this.endStart = true;
		this.checkBottomCubeIsSlideUpTimeout = window.setTimeout(this.continueIfBottomCubeIsSlideUpBind, 300);
	}

	continueIfBottomCubeIsSlideUp () {
		this.bottomCubeIsSlideUp ? this.checkTopCubesSlideInIsStartAndContinue() : this.end();
	}

	checkTopCubesSlideInIsStartAndContinue () {
		if (this.topCubesSlideInIsStart) return this.setCheckReadyToSlideOutTimeout();
		window.clearTimeout(this.preloaderStartHandlerTimeout);
		this.rAF(this.topCubesSlideIn);
		this.setCheckReadyToSlideOutTimeout();
	}

	setCheckReadyToSlideOutTimeout () {
		this.checkReadyToSlideOutTimeout = window.setTimeout(this.checkReadyToSlideOutBind, 300);
	}

	checkReadyToSlideOut () {
		this.readyToSlideOut ? this.cubesSlideOut() : this.setCheckReadyToSlideOutTimeout();
	}

	cubesSlideOut () {
		this.side_top.classList.add('preloaderSide_slideUp');
		this.side_bottom.classList.add('preloaderSide_slideDown');
		this.hiBgImageRemoveBlured();
    this.startWaitCubeSlideOutAnimationDone();
	}
	hiBgImageRemoveBlured () {
		this.state.hiBgLazyImageIsLoaded && (this.state.hiBgImageBlured = false,
			this.imgLazy.classList.remove('hiScreen__bg-image_blurred'));
	}
	startWaitCubeSlideOutAnimationDone () {
		if (this.state.transitionEventSupport)
			return this.side_top.addEventListener('transitionend', this.cubeSideTransitionEndBind);
		this.topSideCubePosition = this.state.roundTo(this.side_top.getBoundingClientRect().y, 2);
		window.setTimeout(this.waitCubeSlideOutAnimationDoneBind, this.cubeSlideOutAnimationDuration);
	}
	cubeSideTransitionEnd (e) {
		if (e.target.id !== 'preloaderSide_top') return;
		this.side_top.removeEventListener('transitionend', this.cubeSideTransitionEndBind);
		this.preloaderOFF();
	}
	waitCubeSlideOutAnimationDone () {
		let newTopSideCubePosition = this.state.roundTo(this.side_top.getBoundingClientRect().y, 2);
		if (this.topSideCubePosition === newTopSideCubePosition && newTopSideCubePosition < 0) return this.preloaderOFF();
		this.topSideCubePosition = newTopSideCubePosition;
		this.rAF(this.waitCubeSlideOutAnimationDone);
	}

	preloaderOFF () {
		this.state.preloaderIsOff = true;
		this.side_top.remove();
		this.side_bottom.remove();
		this.side_top = this.side_bottom = this.leftCube = this.rightCube = this.bottomCube = null;
	}
}
