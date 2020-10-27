'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Portfolio };

class Portfolio {
	constructor (State) {
		this.state = State;
		this.state.portfolioResize = this.resize.bind(this);
		this.state.clientDevice.windowResizeHandlersQueue.resizePortfolio = this.resize.bind(this);

		this.parallax = {};
		this.deviceSlider = {};
		this.imacButton = {};
		this.iphoneButton = {};
		this.imacSVG = {};
		this.iphoneSVG = {};
		this.portfolioIframe = {};
		this.curProject = {};
		this.iframePosition = {iMac: {}, iPhone: {}};

		this.imacIsActive = true;
		
		this.deviceSwitchHandlerBind = this.deviceSwitchHandler.bind(this);
		this.waitDeviceSliderAnimationDoneRAFBind = this.waitDeviceSliderAnimationDoneRAF.bind(this);
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
		this.portfolioSection = this.parallax.querySelector('.portfolio');
		this.deviceSlider = this.parallax.querySelector('.portfolio__deviceContainer');
		this.imacButtonInput = document.getElementById('iMacView');
		this.imacButton = document.getElementById('iMacButton');
		this.iphoneButtonInput = document.getElementById('iPhoneView');
		this.iphoneButton = document.getElementById('iPhoneButton');
		this.imacSVG = document.getElementById('iMacSVG');
		this.iphoneSVG = document.getElementById('iPhoneSVG');
		this.portfolioIframe = document.getElementById('portfolioIframe');
		this.imacDisplay = document.getElementById('iMacDisplay');
		this.iphoneDisplay = document.getElementById('iPhoneDisplay');
		this.curProject = this.parallax.querySelector('.portfolio__project');
		this.externalLink = document.getElementById('externalLinkView');

		this.addDeviceSwitchListener();
		this.addProjectsClickListeners();
	}

	addDeviceSwitchListener () {
		this.imacButtonInput.addEventListener('click', this.deviceSwitchHandlerBind, false);
		this.iphoneButtonInput.addEventListener('click', this.deviceSwitchHandlerBind, false);
	}

	deviceSwitchHandler (e) {
		if (e.target.id === 'iMacView' && !this.imacIsActive) {
			this.imacIsActive = true;
			this.imacButton.classList.add('portfolio__switchButton_checked');
			this.imacButton.classList.remove('portfolio__switchButton_hoverEnable');
			this.imacButton.firstElementChild.classList.remove('portfolio__switchButtonBG_hoverEnable');

			this.iphoneButton.classList.remove('portfolio__switchButton_checked');
			this.iphoneButton.classList.add('portfolio__switchButton_hoverEnable');
			this.iphoneButton.firstElementChild.classList.add('portfolio__switchButtonBG_hoverEnable');
			this.imacSVG.parentNode.classList.remove('portfolio__deviceContainer_iphoneChecked');
			this.imacSVG.parentNode.classList.remove('opacity0');
			this.iphoneSVG.parentNode.classList.remove('portfolio__deviceContainer_iphoneChecked');
			this.iphoneSVG.parentNode.classList.add('opacity0');
			this.iframeOff();
		} else {
			if (e.target.id === 'iPhoneView' && this.imacIsActive) {
				this.imacIsActive = false;
				this.imacButton.classList.remove('portfolio__switchButton_checked');
				this.imacButton.classList.add('portfolio__switchButton_hoverEnable');
				this.imacButton.firstElementChild.classList.add('portfolio__switchButtonBG_hoverEnable');
				this.iphoneButton.classList.add('portfolio__switchButton_checked');
				this.iphoneButton.classList.remove('portfolio__switchButton_hoverEnable');
				this.iphoneButton.firstElementChild.classList.remove('portfolio__switchButtonBG_hoverEnable');
				this.imacSVG.parentNode.classList.add('portfolio__deviceContainer_iphoneChecked');
				this.imacSVG.parentNode.classList.add('opacity0');
				this.iphoneSVG.parentNode.classList.add('portfolio__deviceContainer_iphoneChecked');
				this.iphoneSVG.parentNode.classList.remove('opacity0');
				this.iframeOff();
			}
		}
		this.startWaitDeviceSliderAnimationDone();
	}

	resize () {
		if (this.state.slide1IsActive)
			return;

		let imacDisplayRECT = this.imacDisplay.getBoundingClientRect(),
				iphoneDisplayRECT = this.iphoneDisplay.getBoundingClientRect(),
				portfolioSectionRECT = this.portfolioSection.getBoundingClientRect(),
				deviceSliderRECT = this.deviceSlider.getBoundingClientRect();
		this.iframePosition.scrollTopPos = portfolioSectionRECT.top + this.parallax.scrollTop;

		this.iframePosition.iMac.top = imacDisplayRECT.top - portfolioSectionRECT.top + "px";
		this.iframePosition.iMac.width = imacDisplayRECT.width * 2 + "px";
		this.iframePosition.iMac.height = imacDisplayRECT.height * 2 + "px";

		this.iframePosition.iPhone.top = iphoneDisplayRECT.top - portfolioSectionRECT.top + "px";
		this.iframePosition.iPhone.width = iphoneDisplayRECT.width * 2 + "px";
		this.iframePosition.iPhone.height = iphoneDisplayRECT.height * 2 + "px";

		if (this.imacIsActive) {
			this.iframePosition.iMac.left = imacDisplayRECT.left + "px";
			this.iframePosition.iMac.animDonePosIn = Math.round(deviceSliderRECT.left);
			this.iframePosition.iMac.animDonePosOut = Math.round(-deviceSliderRECT.width);

			this.iframePosition.iPhone.left = iphoneDisplayRECT.left - deviceSliderRECT.width + "px";
		} else {
			this.iframePosition.iMac.left = imacDisplayRECT.left + deviceSliderRECT.width + "px";
			this.iframePosition.iMac.animDonePosIn = Math.round(deviceSliderRECT.left + deviceSliderRECT.width);
			this.iframePosition.iMac.animDonePosOut = Math.round(deviceSliderRECT.left);

			this.iframePosition.iPhone.left = iphoneDisplayRECT.left + "px";
		}
		this.setIframePosition();
	}
	setIframePosition () {
		if (this.imacIsActive)
			return this.portfolioIframe.style.top = this.iframePosition.iMac.top,
			this.portfolioIframe.style.left = this.iframePosition.iMac.left,
			this.portfolioIframe.style.width = this.iframePosition.iMac.width,
			this.portfolioIframe.style.height = this.iframePosition.iMac.height;

		this.portfolioIframe.style.top = this.iframePosition.iPhone.top;
		this.portfolioIframe.style.left = this.iframePosition.iPhone.left;
		this.portfolioIframe.style.width = this.iframePosition.iPhone.width;
		this.portfolioIframe.style.height = this.iframePosition.iPhone.height;
	}
	iframeOn () {
		this.portfolioIframe.classList.remove('opacity0');
		this.portfolioIframe.classList.add('portfolio__Iframe_opacityTransition');
	}
	iframeOff () {
		this.portfolioIframe.classList.add('opacity0');
		this.portfolioIframe.classList.remove('portfolio__Iframe_opacityTransition');
	}

	resizeRAF () {
		window.requestAnimationFrame(this.resize.bind(this));
	}

	startWaitDeviceSliderAnimationDone () {
		window.setTimeout(this.waitDeviceSliderAnimationDoneRAFBind, 300);
	}
	waitDeviceSliderAnimationDoneRAF () {
		window.requestAnimationFrame(this.waitDeviceSliderAnimationDoneBind);
	}
	waitDeviceSliderAnimationDone () {
		let rect = this.deviceSlider.getBoundingClientRect();
		console.log(Math.round(rect.left),'---', this.iframePosition.iMac.animDonePosIn,'---', this.iframePosition.iMac.animDonePosOut);
		if (this.imacIsActive) {
			if (Math.round(rect.left) !== this.iframePosition.iMac.animDonePosIn)
				return this.rAF(this.waitDeviceSliderAnimationDone);
			
			this.setIframePosition();
			this.iframeOn();
		} else {
			if (Math.round(rect.left) !== this.iframePosition.iMac.animDonePosOut)
				return this.rAF(this.waitDeviceSliderAnimationDone);

			this.setIframePosition();
			this.iframeOn();
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

		if (this.sameProject(project))
			return;

		this.externalLink.href = project.value;
		this.portfolioIframe.src = project.value;
		this.curProject.classList.remove('portfolio__project_projectChecked');
		this.curProject.firstElementChild.classList.remove('portfolio__projectDescriptionContainer_projectChecked');
		project.classList.add('portfolio__project_projectChecked');
		project.firstElementChild.classList.add('portfolio__projectDescriptionContainer_projectChecked');
		this.curProject = project;
		this.rAF(this.scrollToDeviceSlider);
	}

	scrollToDeviceSlider () {
		this.parallax.scrollTop = this.iframePosition.scrollTopPos;
	}

	returnTargetProject (e) {
		let target = e.target;
		return e.target.tagName === "BUTTON" || (e.target.parentNode.tagName === "BUTTON" && (target = e.target.parentNode) || (target = e.target.parentNode.parentNode)), target;
	}

	sameProject (p) {
		if (this.portfolioIframe.src === p.value)
			return true;
		return false;
	}
}