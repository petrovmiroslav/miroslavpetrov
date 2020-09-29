'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Portfolio };

class Portfolio {
	constructor (State) {
		this.state = State;
		this.state.portfolioResize = this.resize.bind(this);
		this.state.clientDevice.windowResizeHandlersQueue.resizePortfolio = this.resize.bind(this);

		this.parallax = null;
		this.deviceSlider = null;
		this.imacButton = null;
		this.iphoneButton = null;
		this.imacButtonBG_back = null;
		this.imacButtonBG_highlight = null;
		this.iphoneButtonBG_back = null;
		this.iphoneButtonBG_highlight = null;
		this.imacSVG = null;
		this.iphoneSVG = null;
		this.portfolioIframe = null;
		this.iframePosition = {iMac: {}, iPhone: {}};
		this.deviceSliderRECT = null;
		this.deviceSliderAnimationStartPosition = null;
		this.deviceSliderAnimationDonePosition = null;

		this.imacIsActive = true;
		this.curProject = null;

		this.imacButtonClickHandlerBind = this.imacButtonClickHandler.bind(this);
		this.iphoneButtonClickHandlerBind = this.iphoneButtonClickHandler.bind(this);
		this.waitDeviceSliderAnimationDoneBind = this.waitDeviceSliderAnimationDone.bind(this);
		this.projectsClickHandlerBind = this.projectsClickHandler.bind(this);
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

	init () {
		this.parallax = document.querySelector('.parallax__scrollable-container');
		this.deviceSlider = document.querySelector('.portfolio__deviceSlider');
		this.imacButton = document.getElementById('iMacButton');
		this.iphoneButton = document.getElementById('iPhoneButton');
		this.imacButtonBG_back = this.imacButton.querySelector('.portfolio__switchButtonBG_back');
		this.imacButtonBG_highlight = this.imacButton.querySelector('.portfolio__switchButtonBG_highlight');
		this.iphoneButtonBG_back = this.iphoneButton.querySelector('.portfolio__switchButtonBG_back');
		this.iphoneButtonBG_highlight = this.iphoneButton.querySelector('.portfolio__switchButtonBG_highlight');
		this.imacSVG = document.getElementById('iMacSVG');
		this.iphoneSVG = document.getElementById('iPhoneSVG');
		this.portfolioIframe = document.getElementById('portfolioIframe');
		this.imacDisplay = document.getElementById('iMacDisplay');
		this.iphoneDisplay = document.getElementById('iPhoneDisplay');
		this.curProject = this.parallax.querySelector('.portfolio__project');

		this.addDeviceSwitchButtonsClickListeners();
		this.addProjectsClickListeners();
	}

	addDeviceSwitchButtonsClickListeners () {
		this.imacButton.addEventListener('click', this.imacButtonClickHandlerBind, false);
		this.iphoneButton.addEventListener('click', this.iphoneButtonClickHandlerBind, false);
	}
	imacButtonClickHandler () {
		if (!this.imacIsActive) {
			this.imacIsActive = true;
			this.imacButton.classList.add('portfolio__switchButton_checked');
			this.imacButtonBG_back.classList.add('opacity0');
			this.imacButtonBG_highlight.classList.add('portfolio__switchButtonBG_checked');
			this.iphoneButton.classList.remove('portfolio__switchButton_checked');
			this.iphoneButtonBG_back.classList.remove('opacity0');
			this.iphoneButtonBG_highlight.classList.remove('portfolio__switchButtonBG_checked');
			this.deviceSlider.classList.remove('portfolio__deviceSlider_iphoneChecked');
			this.imacSVG.classList.add('portfolio__device_checked');
			this.iphoneSVG.classList.remove('portfolio__device_checked');
			this.portfolioIframe.classList.add('opacity0');
			
			this.startWaitDeviceSliderAnimationDone();
		}
	}
	iphoneButtonClickHandler () {
		if (this.imacIsActive) {
			this.imacIsActive = false;
			this.imacButton.classList.remove('portfolio__switchButton_checked');
			this.imacButtonBG_back.classList.remove('opacity0');
			this.imacButtonBG_highlight.classList.remove('portfolio__switchButtonBG_checked');
			this.iphoneButton.classList.add('portfolio__switchButton_checked');
			this.iphoneButtonBG_back.classList.add('opacity0');
			this.iphoneButtonBG_highlight.classList.add('portfolio__switchButtonBG_checked');
			this.deviceSlider.classList.add('portfolio__deviceSlider_iphoneChecked');
			this.imacSVG.classList.remove('portfolio__device_checked');
			this.iphoneSVG.classList.add('portfolio__device_checked');
			this.portfolioIframe.classList.add('opacity0');

			this.startWaitDeviceSliderAnimationDone();
		}
	}

	resize () {
		if (!this.state.slide1IsActive) {
			let imacDisplayRECT = this.imacDisplay.getBoundingClientRect();
			let iphoneDisplayRECT = this.iphoneDisplay.getBoundingClientRect();
			let deviceSliderRECT = this.deviceSlider.getBoundingClientRect();
			this.iframePosition.scrollTopPos = deviceSliderRECT.top + this.parallax.scrollTop;

			this.iframePosition.iMac.top = imacDisplayRECT.top - deviceSliderRECT.top + "px";
			this.iframePosition.iMac.width = imacDisplayRECT.width * 2 + "px";
			this.iframePosition.iMac.height = imacDisplayRECT.height * 2 + "px";

			this.iframePosition.iPhone.top = iphoneDisplayRECT.top - deviceSliderRECT.top + "px";
			this.iframePosition.iPhone.width = iphoneDisplayRECT.width * 2 + "px";
			this.iframePosition.iPhone.height = iphoneDisplayRECT.height * 2 + "px";
			
			if (this.imacIsActive) {
				this.iframePosition.iMac.left = imacDisplayRECT.left + "px";
				this.iframePosition.iMac.animDonePos = Math.round(deviceSliderRECT.left);

				this.iframePosition.iPhone.left = iphoneDisplayRECT.left + "px";
				this.iframePosition.iPhone.animDonePos = Math.round(-deviceSliderRECT.width / 2);
			} else {
				this.iframePosition.iMac.left = imacDisplayRECT.left + deviceSliderRECT.width / 2 + "px";
				this.iframePosition.iMac.animDonePos = Math.round(deviceSliderRECT.left + deviceSliderRECT.width / 2);

				this.iframePosition.iPhone.left = iphoneDisplayRECT.left + deviceSliderRECT.width / 2 + "px";
				this.iframePosition.iPhone.animDonePos = Math.round(deviceSliderRECT.left);
			}
			
			this.setIframePosition();
		}
	}
	setIframePosition () {
		if (this.imacIsActive) {
			this.portfolioIframe.style.top = this.iframePosition.iMac.top;
			this.portfolioIframe.style.left = this.iframePosition.iMac.left;
			this.portfolioIframe.style.width = this.iframePosition.iMac.width;
			this.portfolioIframe.style.height = this.iframePosition.iMac.height;
		} else {
			this.portfolioIframe.style.top = this.iframePosition.iPhone.top;
			this.portfolioIframe.style.left = this.iframePosition.iPhone.left;
			this.portfolioIframe.style.width = this.iframePosition.iPhone.width;
			this.portfolioIframe.style.height = this.iframePosition.iPhone.height;
		}
	}

	resizeRAF () {
		window.requestAnimationFrame(this.resize.bind(this));
	}

	startWaitDeviceSliderAnimationDone () {
		window.setTimeout(()=>{
			return window.requestAnimationFrame(this.waitDeviceSliderAnimationDoneBind);
		}, 300);
	}
	waitDeviceSliderAnimationDone () {
		let rect = this.deviceSlider.getBoundingClientRect();
		console.log(Math.round(rect.left),'---', this.iframePosition.iMac.animDonePos,'---', this.iframePosition.iPhone.animDonePos);
		if (this.imacIsActive) {
			if (Math.round(rect.left) !== this.iframePosition.iMac.animDonePos) {
				this.rAF(this.waitDeviceSliderAnimationDone);
			} else {
				this.setIframePosition();
				this.portfolioIframe.classList.remove('opacity0');
			}
		} else {
			if (Math.round(rect.left) !== this.iframePosition.iPhone.animDonePos) {
				this.rAF(this.waitDeviceSliderAnimationDone);
			} else {
				this.setIframePosition();
				this.portfolioIframe.classList.remove('opacity0');
			}
		}
	}

	removeOpacity0ClassPortfolioIframe () {
		this.portfolioIframe.classList.remove('opacity0');
	}

	addProjectsClickListeners () {
		let allProjects = document.querySelectorAll('.portfolio__project');
		for (let i = 0; i < allProjects.length; i++) {
			allProjects[i].addEventListener('click', this.projectsClickHandlerBind);
		}
	}
	projectsClickHandler (e) {
		e.preventDefault();
		let project = this.returnTargetProject(e);
		if (!this.sameProject(project)) {
			console.log(project.href);
			this.portfolioIframe.src = project.href;
			this.curProject.firstElementChild.classList.remove('portfolio__projectDescriptionContainer_projectChecked');
			project.firstElementChild.classList.add('portfolio__projectDescriptionContainer_projectChecked');
			this.curProject = project;
			this.rAF(this.scrollToDeviceSlider);
		}
		
	}

	scrollToDeviceSlider () {
		this.parallax.scrollTop = this.iframePosition.scrollTopPos;
	}

	returnTargetProject (e) {
		if (e.target.tagName !== "A") {
			if (e.target.parentNode.tagName !== "A") {
				if (e.target.parentNode.parentNode.tagName !== "A") {
					return document.querySelector('.portfolio__project');
				} else {
					return e.target.parentNode.parentNode;
				}
			} else {
				return e.target.parentNode;
			}
		} else {
			return e.target;
		}
	}

	sameProject (p) {
		console.log(this.portfolioIframe.src === p.href);
		if (this.portfolioIframe.src === p.href) {
			return true;
		}
		return false;
	}
}