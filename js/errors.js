'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Errors };

class Errors {
	constructor (State) {
		this.state = State;
		this.state.errHandler = this.createToasts.bind(this);

		this.toastsList = [];
		this.slideInTimeouts = [];
		this.slideOutTimeouts = [];
		this.slideRemoveTimeouts = [];
		this.toastsON = false;
		this.toastsPAUSE = false;
		this.slideInStop = false;

		this.currToastSlideInBind = this.currToastSlideIn.bind(this);
		this.currToastSlideOutBind = this.currToastSlideOut.bind(this);
		this.currToastRemoveBind = this.currToastRemove.bind(this);
		this.clearAllSlideOutTimeoutsBind = this.clearAllSlideOutTimeouts.bind(this);
		this.setAllSlideOutTimeoutsBind = this.setAllSlideOutTimeouts.bind(this);
		this.toastsLoopBind = this.toastsLoop.bind(this);
	}

	init () {
		this.toasts = document.querySelector('.toasts');
	}

	createToasts (e) {
		let arrMsg = [e];
		console.log(e);
		if (e instanceof Error)
			return this.reportAError(e);

		let lngBeforeAppend = this.toasts.children.length;
		
		this.toasts.classList.remove('toasts_out');

		let fr = document.createDocumentFragment();
		for (let i = 0; i < arrMsg.length; i++) {
			let toast = document.createElement('div');
			toast.classList.add('toasts__toast', 'shadow_8');
			let bg = document.createElement('div');
			bg.classList.add('toasts__toast-bg');
			let msg = document.createElement('p');
			msg.classList.add('toasts__toast-msg');
			msg.textContent = arrMsg[i];
			toast.append(bg);
			toast.append(msg);
			fr.append(toast);
		}
		this.toasts.append(fr);

		if (this.toasts.children.length > 0) {
			for (let i = lngBeforeAppend; i < this.toasts.children.length; i++) {
				let state = {	ref: this.toasts.children[i],
											inT: false,
											in: false,
											outT: false,
											out: false,
											removeT: false,
											remove: false };
				this.toastsList.push(state);
			}
		}

		if (!this.toastsON) {
			this.slideInTimeouts.push(1);
			this.toastSlideInTimer();
			window.requestAnimationFrame(this.toastsLoopBind);
			this.toastsON = true;
		}
	}

	toastsLoop () {
		if (this.toastsPAUSE) return;
		let lng = this.toastsList.length,
				remove = 0;
		for (let i = 0; i < lng; i++) {
			this.currToastSlideIn(i, lng);
			this.currToastSlideOut(i);
			remove = this.currToastRemove(i, remove);
		}
		remove && (this.toastsList.splice(0, remove), lng -= remove);
		if (lng > 0) 
			return window.requestAnimationFrame(this.toastsLoopBind);
		this.toastsON = false;
		this.toasts.classList.add('toasts_out');
	}

	toastSlideInTimer () {
		this.slideInTimeouts.shift();
		for (let i = 0; i < this.toastsList.length; i++) {
			if (!this.toastsList[i].inT)
				return this.toastsList[i].inT = true;
		}
	}
	toastSlideOutTimer () {
		this.slideOutTimeouts.shift();
		for (let i = 0; i < this.toastsList.length; i++) {
			if (!this.toastsList[i].outT) return this.toastsList[i].outT = true;
		}
	}
	toastSlideRemoveTimer () {
		this.slideRemoveTimeouts.shift();
		for (let i = 0; i < this.toastsList.length; i++) {
			if (!this.toastsList[i].removeT) return this.toastsList[i].removeT = true;
		}
	}

	currToastSlideIn (i, lng) {
		if (!this.toastsList[i].inT || this.toastsList[i].in || this.slideInStop) return;
		this.slideInStop = false;
		this.tryNextToastSlideIn(i, lng);
		this.toastsList[i].ref.classList.add('toasts__toast_slideIn');
		this.slideOutTimeouts.push(window.setTimeout(this.toastSlideOutTimer.bind(this), 5000));
		this.addToastHoverListeners(i);
		this.toastsList[i].in = true;

		/*if (this.toastsList[i].inT) {
			if (!this.toastsList[i].in) {
				if (!this.slideInStop) {
					this.slideInStop = false;
					this.tryNextToastSlideIn(i, lng);

					this.toastsList[i].ref.classList.add('toasts__toast_slideIn');
					this.slideOutTimeouts.push(window.setTimeout(this.toastSlideOutTimer.bind(this), 5000));
					this.addToastHoverListeners(i);
					this.toastsList[i].in = true;
				}
			}
		}*/
	}
	tryNextToastSlideIn (i, lng) {
		if (i + 1 >= lng) return;
		let RECT = this.toastsList[i+1].ref.getBoundingClientRect();
		if ((this.state.windowHeight - RECT.top + RECT.height + 10) > 0 && RECT.height !== 0)
			return this.slideInTimeouts.push(window.setTimeout(this.toastSlideInTimer.bind(this), 300));
		this.slideInStop = true;
	}
	currToastSlideOut (i) {
		if (!this.toastsList[i].outT || this.toastsList[i].out) return;
		this.toastsList[i].ref.classList.add('toasts__toast_slideOut','toasts__toast_fast');
		this.slideRemoveTimeouts.push(window.setTimeout(this.toastSlideRemoveTimer.bind(this), 100));
		this.toastsList[i].out = true;
		/*if (this.toastsList[i].outT) {
			if (!this.toastsList[i].out) {
				this.toastsList[i].ref.classList.add('toasts__toast_slideOut','toasts__toast_fast');
				this.slideRemoveTimeouts.push(window.setTimeout(this.toastSlideRemoveTimer.bind(this), 100));
				this.toastsList[i].out = true;
			}
		}*/
	}
	currToastRemove (i, remove) {
		if (!this.toastsList[i].removeT || this.toastsList[i].remove) return remove;
		this.removeToastHoverListeners(i);
		this.toastsList[i].ref.remove();
		this.toastsList[i].ref = null;
		this.toastsList[i].remove = true;
		if (this.slideInStop || (this.slideInTimeouts.length === 0)) {
			this.slideInStop = false;
			this.slideInTimeouts.push(window.setTimeout(this.toastSlideInTimer.bind(this), 100));
		}
		return ++remove;

		/*if (this.toastsList[i].removeT) {
			if (!this.toastsList[i].remove) {
				this.removeToastHoverListeners(i);
				this.toastsList[i].ref.remove();
				this.toastsList[i].ref = null;
				this.toastsList[i].remove = true;
				if (this.slideInStop || (this.slideInTimeouts.length === 0)) {
					this.slideInStop = false;
					this.slideInTimeouts.push(window.setTimeout(this.toastSlideInTimer.bind(this), 100));
				}
				return ++remove;
			}
		}
		return remove;*/
	}

	addToastHoverListeners (i) {
		this.toastsList[i].ref.addEventListener('mouseenter', this.clearAllSlideOutTimeoutsBind);
		this.toastsList[i].ref.addEventListener('mouseout', this.setAllSlideOutTimeoutsBind);
	}
	removeToastHoverListeners (i) {
		this.toastsList[i].ref.removeEventListener('mouseenter', this.clearAllSlideOutTimeoutsBind);
		this.toastsList[i].ref.removeEventListener('mouseout', this.setAllSlideOutTimeoutsBind);
	}

	clearAllSlideOutTimeouts () {
		if (this.toastsPAUSE) return;
		this.toastsPAUSE = true;
		for (let i = 0; i < this.slideInTimeouts.length; i++) {
			window.clearTimeout(this.slideInTimeouts[i]);
		}
		for (let i = 0; i < this.slideOutTimeouts.length; i++) {
			window.clearTimeout(this.slideOutTimeouts[i]);
		}
		for (let i = 0; i < this.slideRemoveTimeouts.length; i++) {
			window.clearTimeout(this.slideRemoveTimeouts[i]);
		}
	}
	setAllSlideOutTimeouts () {
		if (!this.toastsPAUSE) return;
		this.toastsPAUSE = false;
		window.requestAnimationFrame(this.toastsLoopBind);

		let lengthIn = this.slideInTimeouts.length;
		this.slideInTimeouts.length = 0;
		for (let i = 0; i < lengthIn; i++) {
			this.slideInTimeouts.push(window.setTimeout(()=>{
				window.requestAnimationFrame(this.toastSlideInTimer.bind(this));
			},1000 + (i*150)));
		}

		let lengthOut = this.slideOutTimeouts.length;
		this.slideOutTimeouts.length = 0;
		for (let i = 0; i < lengthOut; i++) {
			this.slideOutTimeouts.push(window.setTimeout(()=>{
				window.requestAnimationFrame(this.toastSlideOutTimer.bind(this));
			},1000 + (i*150)));
		}

		let lengthRemove = this.slideRemoveTimeouts.length;
		this.slideRemoveTimeouts.length = 0;
		for (let i = 0; i < lengthRemove; i++) {
			this.slideRemoveTimeouts.push(window.setTimeout(()=>{
				window.requestAnimationFrame(this.toastSlideRemoveTimer.bind(this));
			},1000 + (i*150)));
		}
	}

	reportAError (e) {
		console.log("REPORT!!!---", e);
	}
}