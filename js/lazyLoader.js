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
		this.rAF(this.lazyLoadAndReplaceHiBgImage);
		this.rAF(this.loadVideos);
	}

	lazyLoadAndReplaceHiBgImage () {
		this.hiScreen = document.querySelector('.hiScreen');
		this.divForDownload = document.querySelector('.forDownload');
		this.imgMini = document.querySelector('.hiScreen__bg-image_mini');
		this.imgLazy = document.querySelector('.hiScreen__bg-image_lazy');

		this.divForDownload.querySelector('img').remove();
		this.imgForLazyLoadHiScreen = document.createElement('img');
		
		this.imgForLazyLoadHiScreen.setAttribute('src', 'https://petrovmiroslav.github.io/static/hiScreenBg.jpg');
	  /*this.imgForLazyLoadHiScreen.setAttribute('src', './img/hiScreenBg.jpg');*/
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
		if (this.state.hiBgLazyImageIsTargetTransform || this.state.deviceIsTouchscreen) {
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
														{ src: 'https://petrovmiroslav.github.io/static/polina.mp4',
														  type: 'video/mp4'
														},
														{ src: 'https://r3---sn-8ph2xajvh-2xxe.googlevideo.com/videoplayback?expire=1590334486&ei=tj_KXtR12oHzArqpt6gL&ip=212.60.22.52&id=o-AJZ7ksXEjTHgsBEHarcTvQRL4g1j4yih4Gl6ifD4r8Sl&itag=22&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ratebypass=yes&dur=25.077&lmt=1574000296348480&fvip=3&c=WEB&txp=2216222&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANNCn_cUCcrL8lF76lPjM6KAkk_GgmyYACJVqBVeEgtfAiBt1Ps7AzKTSLZU5I9pf2OvsJaFo9faL27DBU-36CvmlQ%3D%3D&cms_redirect=yes&mh=K4&mip=46.42.144.126&mm=31&mn=sn-8ph2xajvh-2xxe&ms=au&mt=1590312810&mv=m&mvi=2&pcm2cms=yes&pl=19&lsparams=mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl&lsig=AG3C_xAwRQIhAKgdyyjITrHOt0gb7E_z-XKsPPFfrmyTVxqaXMAqX3uMAiByqH47DK-N8mbTwJrkwLlYdURxRWFlwfsjjhohUemZAw%3D%3D',
														  type: 'video/mp4'
														},
														{ src: 'https://gdurl.com/V7m2',
														  type: 'video/webm'
														},
														{ src: 'http://miroslavpetrov.ml/petrovproweb/img/polina.webm',
														  type: 'video/webm'
														},
														{ src: 'http://miroslavpetrov.ml/petrovproweb/img/polina.mp4',
														  type: 'video/mp4'
														}
													];
		this.fullscreenBgVideo = document.querySelectorAll('.parallax__bg-fullscreen-video');
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

}