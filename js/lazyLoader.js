'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { LazyLoader };

class LazyLoader {
	constructor (State) {
		this.state = State;

		this.imgForLazyLoadHiScreen = {};
		this.hiScreen = {};
		this.divForDownload = {};
		this.imgMini = {};
		this.imgLazy = {};

		this.hiBgImageLoadHandlerBind = this.hiBgImageLoadHandler.bind(this);
		this.removeMiniImgBind = this.removeMiniImg.bind(this);
		this.hiBgImageBlurTransitionEndBind = this.hiBgImageBlurTransitionEnd.bind(this);
		this.removeHiScreenClass = this.removeHiScreenClass.bind(this);
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
		this.hiScreen = document.querySelector('.hiScreen');
		this.hiScreenTexts = this.hiScreen.querySelectorAll('.hiScreen__text');
		this.divForDownload = document.querySelector('.forDownload');
		this.imgMini = document.querySelector('.hiScreen__bg-image_mini');
		this.imgLazy = document.querySelector('.hiScreen__bg-image_lazy');

		this.rAF(this.lazyLoadAndReplaceHiBgImage);
		this.rAF(this.loadVideos);
		this.rAF(this.addPlantsImgSourceRAF);
	}

	lazyLoadAndReplaceHiBgImage () {
		this.imgForLazyLoadHiScreen = document.createElement('img');
		
		this.imgForLazyLoadHiScreen.setAttribute('src', this.state.static.hiBg.max);
	  this.divForDownload.appendChild(this.imgForLazyLoadHiScreen);
	  this.addImgForLazyLoadHiScreenListener();
	}
	hiBgImageLoadHandler () {
		this.imgForLazyLoadHiScreen.removeEventListener('load', this.hiBgImageLoadHandlerBind);
  	this.imgForLazyLoadHiScreen.remove();
  	this.imgForLazyLoadHiScreen = null;
  	this.state.hiBgLazyImageIsLoaded = true;
  	this.switchHiBgImage();
	}
	addImgForLazyLoadHiScreenListener () {
		this.imgForLazyLoadHiScreen.addEventListener('load', this.hiBgImageLoadHandlerBind);
	}

	switchHiBgImage () {
		this.state.deviceIsTouchscreen || this.state.switchHiBgImageTransformTarget();
		this.state.hiBgImageMini = false;
		this.imgLazy.classList.add('hiScreen__bg-image_lazy-afterLoad');
		this.imgLazyRemoveClassBlurred();
		window.setTimeout(this.removeMiniImgBind, 1000);

		if (this.state.deviceIsTouchscreen) {
			for (var i = this.hiScreenTexts.length - 1; i >= 0; i--) {
				this.hiScreenTexts[i].classList.add('hiScreen__text__forBlurTransition');
			}
			this.waitHiBgImageBlurTransitionEnd();
		}
	}

	imgLazyRemoveClassBlurred () {
		if (!this.state.preloaderIsOff) return this.rAF(this.imgLazyRemoveClassBlurred);
		if (!this.state.hiBgImageBlured) return;
		this.state.hiBgImageBlured = false;
		this.imgLazy.classList.remove('hiScreen__bg-image_blurred');
	}

	removeMiniImg () {
		this.imgMini.remove();
		this.imgForLazyLoadHiScreen = this.imgMini = null;
	}

	waitHiBgImageBlurTransitionEnd () {
		if (this.state.transitionEventSupport)
			return this.imgLazy.addEventListener('transitionend', this.hiBgImageBlurTransitionEndBind);
		window.setTimeout(this.removeHiScreenClass, 700);
	}
	hiBgImageBlurTransitionEnd (e) {
		if (e.target.parentNode.id !== 'hiScreenWrapper' || e.propertyName !== 'filter') return;
		this.imgLazy.removeEventListener('transitionend', this.hiBgImageBlurTransitionEndBind);
		this.removeHiScreenClass();
	}
	removeHiScreenClass () {
		for (var i = this.hiScreenTexts.length - 1; i >= 0; i--) {
			this.hiScreenTexts[i].classList.remove('hiScreen__text__forBlurTransition');
		}
		this.hiScreenTexts = null;
	}

	loadVideos () {
		this.fullscreenBgVideo = document.querySelectorAll('.parallax__bg-fullscreen-video');
		this.addVideoSource(this.fullscreenBgVideo, this.state.static.bGVideo);
	}
	addVideoSource (video, sources) {
		if (video.length) {
			for (let j = 0; j < video.length; j++) {
				for (let i = 0; i < sources.length; i++) {
					let bgvidSource = document.createElement('source');
			    for (var attr in sources[i]) {
			      bgvidSource.setAttribute(attr, sources[i][attr]);
			    }
			    video[j].appendChild(bgvidSource);
				}
			}
		} else {
			for (let i = 0; i < sources.length; i++) {
				let bgvidSource = document.createElement('source');
		    for (var attr in sources[i]) {
		      bgvidSource.setAttribute(attr, sources[i][attr]);
		    }
		    video.appendChild(bgvidSource);
			}
		}
	}
	addPlantsImgSourceRAF () {
		this.rAF(this.addPlantsImgSource);
	}
	addPlantsImgSource () {
		document.querySelector('.certification__plantParallaxImg_back').setAttribute('src', this.state.static.plants.back);
		if (this.state.deviceIsTouchscreen) return;
		let b = document.querySelector('.certification__plantParallaxImg_base'),
				f = document.querySelector('.certification__plantParallaxImg_fore');
		b.setAttribute('src', this.state.static.plants.base);
		f.setAttribute('src', this.state.static.plants.fore);
		b.classList.remove('hidden');
		f.classList.remove('hidden');
		b = f = null;
	}
}