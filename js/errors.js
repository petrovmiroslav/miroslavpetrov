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
		//let arrMsg = ['0 dfdg hhgh hhh dssssss gfg', '1 fj jhbdgig ngggu ngjndgdkk v', '2 j shdhfjn vugez gfigi gngdjn vdg', '3 dfdg hhgh hhh dssssss gfg', '4 fj jhbdgig ngggu ngjndgdkk v', '5 j shdhfjn vugez gfigi gngdjn vdg', '6 dfdg hhgh hhh dssssss gfg', '7 fj jhbdgig ngggu ngjndgdkk v', '8 j shdhfjn vugez gfigi gngdjn vdg'];
		let arrMsg = [e];

		console.log(e instanceof Error);
		console.log(e);
		if (e instanceof Error) {
			return this.reportAError(e);
		}

		let lngBeforeAppend = this.toasts.children.length;
		
		this.toasts.classList.remove('toasts_out');

		let fr = document.createDocumentFragment();
		for (let i = 0; i < arrMsg.length; i++) {
			let toast = document.createElement('div');
			toast.classList.add('toasts__toast');
			let bg = document.createElement('div');
			bg.classList.add('toasts__toast-bg');
			let msg = document.createElement('div');
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
		if (!this.toastsPAUSE) {
			let lng = this.toastsList.length,
					remove = 0;
			/*let ARR = [];*/
			for (let i = 0; i < lng; i++) {
				// ARR.push({i: i,
				// 					int: this.toastsList[i].inT,
				// 					in: this.toastsList[i].in,
				// 					outT: this.toastsList[i].outT,
				// 					out: this.toastsList[i].out,
				// 					removeT: this.toastsList[i].removeT,
				// 					remove: this.toastsList[i].remove});
				// console.log('STOP--', this.slideInStop, ' timersLNG', this.slideInTimeouts.length, this.slideInTimeouts, ' lng--', lng);
				this.currToastSlideIn(i, lng);

				this.currToastSlideOut(i);
				
				remove = this.currToastRemove(i, remove);
				
			}
			if (remove) {
				this.toastsList.splice(0, remove);
				lng -= remove;
			}
			if (lng > 0) {
				window.requestAnimationFrame(this.toastsLoopBind);
			} else {
				this.toastsON = false;
				this.toasts.classList.add('toasts_out');
			}
			/*console.log(ARR);*/
		}
	}

	toastSlideInTimer () {
		this.slideInTimeouts.shift();
		for (let i = 0; i < this.toastsList.length; i++) {
			if (!this.toastsList[i].inT) {
				return this.toastsList[i].inT = true;
			}
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
		if (this.toastsList[i].inT) {
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
		}
	}
	tryNextToastSlideIn (i, lng) {
		if (i + 1 < lng) {
			let RECT = this.toastsList[i+1].ref.getBoundingClientRect();
			/*console.log(RECT);*/
			if ((this.state.windowHeight - RECT.top + RECT.height + 10) > 0 && RECT.height !== 0) {
				/*console.log('NEXT!!!(try)');*/
				this.slideInTimeouts.push(window.setTimeout(this.toastSlideInTimer.bind(this), 300));
			} else {
				this.slideInStop = true;
			}
		}
	}
	currToastSlideOut (i) {
		if (this.toastsList[i].outT) {
			if (!this.toastsList[i].out) {
				this.toastsList[i].ref.classList.add('toasts__toast_slideOut','toasts__toast_fast');
				this.slideRemoveTimeouts.push(window.setTimeout(this.toastSlideRemoveTimer.bind(this), 100));
				this.toastsList[i].out = true;
			}
		}
	}
	currToastRemove (i, remove) {
		if (this.toastsList[i].removeT) {
			if (!this.toastsList[i].remove) {
				this.removeToastHoverListeners(i);
				this.toastsList[i].ref.remove();
				this.toastsList[i].ref = null;
				this.toastsList[i].remove = true;
				if (this.slideInStop || (this.slideInTimeouts.length === 0)) {
					this.slideInStop = false;
					/*console.log('NEXT!!!(remove)');*/
					this.slideInTimeouts.push(window.setTimeout(this.toastSlideInTimer.bind(this), 100));
				}
				return ++remove;
			}
		}
		return remove;
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
		if (!this.toastsPAUSE) {
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
	}
	setAllSlideOutTimeouts () {
		if (this.toastsPAUSE) {
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
	}

	reportAError (e) {
		console.log("REPORT!!!---", e);
	}
}