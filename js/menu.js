'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Menu };

class Menu {
	constructor (State) {
		this.state = State;

		this.menuButton = null;
		this.menu = null;
		this.content = null;

		this.checkReadyToInitInterval = null;

		this.menuButtonClickHandlerBind = this.menuButtonClickHandler.bind(this);
	}

	init () {
		this.menuButton = document.querySelector('.menuButton__lines-wrapper');
		this.menu = document.querySelector('.menu');
		this.slide1 = document.querySelector('.slide1');
		this.slide2 = document.querySelector('.slide2');
		this.flipper = document.querySelector('.flipperContainerWrapper');


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

	openMenu () {
		this.state.menuIsOpen = true;

		this.disableMenuButton();

		if (this.state.slide1IsActive) {
			this.content = this.slide1;
			this.openMenuIfSlide1IsActive();
		} else {
			this.content = this.slide2;
			this.openMenuIfSlide2IsActive();
		}
	}

	openMenuIfSlide1IsActive () {
		this.prepareForOpenMenuIfSlide1IsActive();
	}

	prepareForOpenMenuIfSlide1IsActive () {
		this.state.hiBgImageTransformOFF();
		this.state.fullscreenSliderOFF();
	}

	openMenuIfSlide2IsActive () {
		this.prepareForOpenMenuIfSlide2IsActive();
		this.drawFlipper();
	}

	prepareForOpenMenuIfSlide2IsActive () {
		this.state.fullscreenSliderOFF();
	}

	drawFlipper () {
		let n = 5;

    let frontFlipperSide = this.content.outerHTML;
    let backFlipperSide = this.menu.outerHTML;

    let flipperContainer = document.createElement('div');
    flipperContainer.classList.add('flipperContainer');

    for (var i = 0; i < n; i++) {
    	
    }
	}
}