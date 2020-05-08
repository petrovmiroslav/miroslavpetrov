'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { LazyLoader };

class LazyLoader {
	constructor (State) {
		this.state = State;

		this.imgForLazyLoadHiScreen = null;
		this.hiScreen = null;
		this.divForDownload = null;
		this.imgMini = null;
		this.imgLazy = null;

		this.checkReadyToRemoveMiniImgInterval = null;
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
		this.lazyLoadAndReplaceHiBgImage();
		this.loadVideos();
	}

	lazyLoadAndReplaceHiBgImage () {
		this.hiScreen = document.querySelector('.hiScreen');
		this.divForDownload = document.querySelector('.forDownload');
		this.imgMini = document.querySelector('.hiScreen__bg-image_mini');
		this.imgLazy = document.querySelector('.hiScreen__bg-image_lazy');

		this.divForDownload.querySelector('img').remove();
		this.imgForLazyLoadHiScreen = document.createElement('img');
	  this.imgForLazyLoadHiScreen.setAttribute('src', './img/hiScreenBg.jpg');
	  this.divForDownload.appendChild(this.imgForLazyLoadHiScreen);
	  this.addImgForLazyLoadHiScreenListener();
	}

	addImgForLazyLoadHiScreenListener () {
		let that = this;
    let f = function (ref) {
    	ref.imgForLazyLoadHiScreen.removeEventListener('load', func);
    	ref.imgForLazyLoadHiScreen.remove();
    	ref.imgForLazyLoadHiScreen = null;
    	ref.setStateHiBgLazyImageIsLoadedTrue();
    	ref = null;
    };
    let func = function () {
    	return f(that);
    }
  	this.imgForLazyLoadHiScreen.addEventListener('load', func);
	}

	setStateHiBgLazyImageIsLoadedTrue () {
		this.state.hiBgLazyImageIsLoaded = true;
		this.prepareToRemoveMiniImg();
	}

	prepareToRemoveMiniImg () {
		this.setCheckReadyToRemoveMiniImgInterval();
	}

	setCheckReadyToRemoveMiniImgInterval () {
		this.checkReadyToRemoveMiniImgInterval = window.setInterval(this.checkReadyToRemoveMiniImg.bind(this),50);
	}
	checkReadyToRemoveMiniImg () {
		if (this.state.hiBgLazyImageIsTargetTransform) {
			window.clearInterval(this.checkReadyToRemoveMiniImgInterval);
			this.imgLazy.classList.add("hiScreen__bg-image_lazy-afterLoad");
			this.rAF(this.imgLazyRemoveClassBlurred);
			this.rAF(this.setRemoveMiniImgTimeout);

			if (this.state.deviceIsTouchscreen) {
				this.hiScreen.classList.add('hiScreen_for-blure-effect');
				this.setRemoveHiScreenClassTimeout();
			}
		}
	}
	imgLazyRemoveClassBlurred () {
		this.imgLazy.classList.remove('hiScreen__bg-image_blurred');
	}
	setRemoveMiniImgTimeout () {
		window.setTimeout(this.removeMiniImg.bind(this), 1000);
	}
	removeMiniImg () {
		this.imgMini.remove();


		this.imgForLazyLoadHiScreen = null;
		this.divForDownload = null;
		this.imgMini = null;
		this.imgLazy = null;
	}
	setRemoveHiScreenClassTimeout () {
		window.setTimeout(this.removeHiScreenClass.bind(this), 700);
	}
	removeHiScreenClass () {
		this.hiScreen.classList.remove('hiScreen_for-blure-effect');
	}

	loadVideos () {
		this.sourcesBGVideo = [
														{ src: 'http://miroslavpetrov.ml/petrovproweb/img/polina.webm',
														  type: 'video/webm'
														},
														{ src: 'http://miroslavpetrov.ml/petrovproweb/img/polina.mp4',
														  type: 'video/mp4'
														}
													];
		this.fullscreenBgVideo = document.querySelector('#bgvid');
		this.addVideoSource(this.fullscreenBgVideo, this.sourcesBGVideo);

		this.sourcesRainVideo = [
														  { src: 'https://www.w3schools.com/howto/rain.mp4',
														    type: 'video/mp4'
														  }
														];
		this.rainVideo = document.querySelector('#rainVideo');
		this.addVideoSource(this.rainVideo, this.sourcesRainVideo);
	}
	addVideoSource (video, sources) {
		for (let i = 0; i < sources.length; i++) {
			let bgvidSource = document.createElement('source');
	    for (var attr in sources[i]) {
	      bgvidSource.setAttribute(attr, sources[i][attr]);
	    }
	    video.appendChild(bgvidSource);
		}
	}

}