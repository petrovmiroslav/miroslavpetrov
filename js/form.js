'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Form };

class Form {
	constructor (State) {
		this.state = State;
		/*this.state.formResize = this.resize.bind(this);
		this.state.clientDevice.windowResizeHandlersQueue.resizeForm = this.resize.bind(this);*/
		
		this.form = null;
		this.phoneNumInput = null;
		this.phoneNumber = [];
		this.fileInput =  null;
		this.filePreview = null;
		this.resetFileInputButton = null;

		this.phoneNumberInputFocusHandlerBind = this.phoneNumberInputFocusHandler.bind(this);
		this.phoneNumberInputBlurHandlerBind = this.phoneNumberInputBlurHandler.bind(this);
		this.phoneNumberInputHandlerBind = this.phoneNumberInputHandler.bind(this);
		this.inputValidPhoneNumberBind = this.inputValidPhoneNumber.bind(this);
		this.fileInputChangeHandlerBind = this.fileInputChangeHandler.bind(this);
		this.resetFileInputButtonClickBind = this.resetFileInputButtonClick.bind(this);
		this.submitHandlerBind = this.submitHandler.bind(this);

		this.inputTickTimeout = null;
		this.formData = null;
		this.req = null;
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
		this.form = document.getElementById('form');
		this.phoneNumInput = this.form.phoneNumber;
		this.fileInput =  this.form.file;
		this.filePreview = this.form.querySelector('.filePreview');
		this.resetFileInputButton = this.form.resetFileInput;

		this.addPhoneNumberListeners();

		this.addFileInputChangeListener();

		this.addResetFileInputButtonClickListener();

		this.addSubmitListener();
	}

	addPhoneNumberListeners () {
		this.addPhoneNumberInputFocusListener();
		this.addPhoneNumberInputBlurListener();
		this.addPhoneNumberInputListener();
		this.addPhoneNumberInputClickListener();
	}

	addPhoneNumberInputClickListener () {
		this.phoneNumInput.addEventListener('click', function(){console.log('CLICK')});
	}

	addPhoneNumberInputFocusListener () {
		this.phoneNumInput.addEventListener('focus', this.phoneNumberInputFocusHandlerBind);
	}
	phoneNumberInputFocusHandler (e) {
		if(this.phoneNumInput.value === "") {
			this.phoneNumInput.value = "+7 (";
		}
	}
	addPhoneNumberInputBlurListener () {
		this.phoneNumInput.addEventListener('blur', this.phoneNumberInputBlurHandlerBind);
	}
	phoneNumberInputBlurHandler (e) {
		if (this.phoneNumInput.value.length < 2 ) this.phoneNumInput.value = '';
		if (this.phoneNumInput.value.length < 18) {
			alert("Номер телефона должен состоять из 11 цифр");
		}
	}
	addPhoneNumberInputListener () {
		this.phoneNumInput.addEventListener('input', this.phoneNumberInputHandlerBind);
	}
	phoneNumberInputHandler (e) {console.log('input');
		window.clearTimeout(this.inputTickTimeout);
		this.inputTickTimeout = window.setTimeout(this.inputValidPhoneNumberBind, 250);
	}
	
	inputValidPhoneNumber () {
		if (this.phoneNumInput.value !== "") {
			this.phoneNumber = this.phoneNumInput.value.split("").filter(this.phoneNumberFilterFunc);

			this.phoneNumInput.value = this.addChar(this.phoneNumber).join("");
		}
	}
	phoneNumberFilterFunc (char) {
		if (/\d/.exec(char)) {
			return char;
		}
	}
	addChar (arr) {
		arr.splice(0,0,"+");
		
		if (arr[1] !== '7') {
			arr.splice(1,0,"7");
		}
		
		if(!arr[2]) {
			return arr;
		} else {
			arr.splice(2,0," (");
		}
		if(!arr[6]) {
			return arr;
		} else {
			arr.splice(6,0,") ");
		}
		if(!arr[10]) {
			return arr;
		} else {
			arr.splice(10,0,"-");
		}
		if(!arr[13]) {
			return arr;
		} else {
			arr.splice(13,0,"-");
		}
		if(!arr[16]) {
			return arr;
		} else {
			arr.splice(16);
		}
		return arr;
	}
	
	addFileInputChangeListener () {
		this.fileInput.addEventListener('change', this.fileInputChangeHandlerBind);
	}
	fileInputChangeHandler (e) {
		if (this.fileInput.files.length > 0) {
			if (this.fileInput.files[0].size < 10485760) {
				this.filePreview.textContent = this.fileInput.files[0].name;
				this.enableResetFileInputButton();
			} else {
				this.fileInput.value = '';
				this.filePreview.textContent = 'Размер файла не может превышать 10 MB';
				this.disableResetFileInputButton();
			}
		}
	}
	displayFileName () {

	}

	enableResetFileInputButton () {
		this.resetFileInputButton.disabled = false;
		this.resetFileInputButton.classList.remove('opacity0');
	}
	disableResetFileInputButton () {
		this.resetFileInputButton.disabled = true;
		this.resetFileInputButton.classList.add('opacity0');
	}

	addResetFileInputButtonClickListener () {
		this.resetFileInputButton.addEventListener('click', this.resetFileInputButtonClickBind);
	}
	resetFileInputButtonClick (e) {
		e.preventDefault();
		this.filePreview.textContent = '';
		this.disableResetFileInputButton();
	}

	addSubmitListener () {
		this.form.addEventListener('submit', this.submitHandlerBind);
	}
	submitHandler (e) {
		e.preventDefault();

		this.formData = new FormData(this.form);
		this.formData.set('hidden', 'submit');
		if (0/*self.fetch*/) {
		  fetch(this.form.action, {
		    method: 'POST',
		    body: this.formData
		  })
			  .then((response) => {
			    //return response.json();
			    console.log(response);
			  });
		} else {
	    this.req = new XMLHttpRequest();
			this.req.onload = function(req) {
				let responseData = JSON.parse(req.response);
				console.log(responseData);

				this.form.email.value = responseData.email;

				if (responseData.error.length > 0) {
					for (let err in responseData.error) {
						console.log(responseData.error[err]);
						//errorHandler(responseData.error[err]);
					}
				} else {
					console.log('THERE IS NO ERROR');
				}
			};
			this.req.open("POST", this.form.action, true);
			this.req.send(this.formData);
		}
	}
}
