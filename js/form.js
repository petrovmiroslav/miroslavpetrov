'use strict';
export { Form };

class Form {
	constructor (State) {
		this.state = State;

		this.form = {};
		this.phoneNumInput = {};
		this.phoneNumber = [];
		this.fileInput =  {};
		this.filePreview = {};
		this.resetFileInputButton = {};

		this.phoneNumberInputFocusHandlerBind = this.phoneNumberInputFocusHandler.bind(this);
		this.phoneNumberInputBlurHandlerBind = this.phoneNumberInputBlurHandler.bind(this);
		this.phoneNumberInputHandlerBind = this.phoneNumberInputHandler.bind(this);
		this.inputValidPhoneNumberBind = this.inputValidPhoneNumber.bind(this);
		this.fileInputChangeHandlerBind = this.fileInputChangeHandler.bind(this);
		this.resetFileInputButtonClickBind = this.resetFileInputButtonClick.bind(this);
		this.submitHandlerBind = this.submitHandler.bind(this);
		this.XMLHttpRequestOnloadHandlerBind = this.XMLHttpRequestOnloadHandler.bind(this);
		this.catchErrBind = this.catchErr.bind(this);
		this.formInputHandlerBind = this.formInputHandler.bind(this);

		this.inputTickTimeout = 0;
		this.formData = {};
		this.req = {};
		this.result = {};
		this.JSON = {};
		this.serverErr = false;
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
		this.fileInputButton = this.form.file.labels[0];
		this.filePreview = this.form.querySelector('.form__filePreview');
		this.resetFileInputButton = this.form.resetFileInput;
		this.submitButton = this.form.submit;
		this.loadingSection = document.querySelector('.loading_form');

		this.form.reset();
		this.addPhoneNumberListeners();
		this.addFileInputListeners();
		this.addSubmitListener();
	}

	addPhoneNumberListeners () {
		this.addPhoneNumberInputFocusListener();
		this.addPhoneNumberInputBlurListener();
		this.addPhoneNumberInputListener();
	}

	addPhoneNumberInputFocusListener () {
		this.phoneNumInput.addEventListener('focus', this.phoneNumberInputFocusHandlerBind);
	}
	phoneNumberInputFocusHandler (e) {
		this.phoneNumInput.value === "" && (this.phoneNumInput.value = "+7 (");
	}
	addPhoneNumberInputBlurListener () {
		this.phoneNumInput.addEventListener('blur', this.phoneNumberInputBlurHandlerBind);
	}
	phoneNumberInputBlurHandler (e) {
		if (this.phoneNumInput.value.length < 5 ) return this.phoneNumInput.value = '';
		this.phoneNumInput.value.length < 18 && this.state.errHandler('Phone number must be 11 digits');
	}
	addPhoneNumberInputListener () {
		this.phoneNumInput.addEventListener('input', this.phoneNumberInputHandlerBind);
	}
	phoneNumberInputHandler (e) {
		window.clearTimeout(this.inputTickTimeout);
		this.inputTickTimeout = window.setTimeout(this.inputValidPhoneNumberBind, 250);
	}

	inputValidPhoneNumber () {
		if (this.phoneNumInput.value === "") return;
		this.phoneNumber = this.phoneNumInput.value.split("").filter(this.phoneNumberFilterFunc);
		this.phoneNumInput.value = this.addChar(this.phoneNumber).join("");
	}
	phoneNumberFilterFunc (char) {
		if (/\d/.exec(char)) return char;
	}
	addChar (arr) {
		arr.splice(0,0,"+");
		arr[1] !== '7' && arr.splice(1,0,"7");
		if(!arr[2]) return arr;
		arr.splice(2,0," (");
		if(!arr[6]) return arr;
		arr.splice(6,0,") ");
		if(!arr[10]) return arr;
		arr.splice(10,0,"-");
		if(!arr[13]) return arr;
		arr.splice(13,0,"-");
		if(!arr[16]) return arr;
		arr.splice(16);
		return arr;
	}

	addFileInputListeners () {
		this.fileInput.addEventListener('change', this.fileInputChangeHandlerBind);
		this.fileInput.addEventListener('click', this.resetFileInputButtonClickBind);
	}
	fileInputChangeHandler (e) {
		if (this.fileInput.files.length === 0) return;
		if (this.fileInput.files[0].size < 10485760)
			return this.filePreview.textContent = this.fileInput.files[0].name,
			this.enableResetFileInputButton();
		this.fileInput.value = '';
		this.filePreview.textContent = 'File not selected. File size cannot exceed 10 MB';
		this.disableResetFileInputButton();
	}

	enableResetFileInputButton () {
		this.fileInputButton.textContent = 'Delete a file';
	}
	disableResetFileInputButton () {
		this.fileInputButton.textContent = 'Attach file';
	}
	submitButtonSwitchSuccess () {
		this.submitButton.classList.add('submit_success');
		this.submitButton.value = 'Sent!';
	}
	enableSubmitButton () {
		this.submitButton.disabled = false;
		this.submitButton.value = 'Submit';
		this.submitButton.classList.add('submit_hoverEnable');
	}
	disableSubmitButton () {
		this.submitButton.disabled = true;
		this.submitButton.classList.remove('submit_hoverEnable');
	}
	addFormInputListener () {
		this.form.addEventListener('input', this.formInputHandlerBind);
	}
	removeFormInputListener () {
		this.form.removeEventListener('input', this.formInputHandlerBind);
	}

	formInputHandler () {
		this.removeFormInputListener();
		this.enableSubmitButton();
	}

	resetFileInputButtonClick (e) {
		if (this.fileInput.files.length === 0) return;
		e.preventDefault();
		this.filePreview.textContent = '';
		this.fileInput.value = '';
		this.disableResetFileInputButton();
	}

	addSubmitListener () {
		this.form.addEventListener('submit', this.submitHandlerBind);
	}
	async submitHandler (e) {
		e.preventDefault();
		this.disableSubmitButton();
		this.cleanUp();

		this.formData = new FormData(this.form);
		this.formData.set('hidden', 'submit');

		await this.sendFormData().catch(this.catchErrBind);

		this.handleResponse();
		this.cleanUp();
	}

	async sendFormData () {
		if (self.fetch)
			return await this.fetchReq();
		await this.XMLHttpReq();
	}

	async fetchReq () {
		this.req = await fetch(this.form.action, {
	    method: 'POST',
	    body: this.formData
	  });
	  if (!this.req) return;

  	if (!this.req.ok) {
  		this.state.errHandler('Message not sent. Service is temporarily unavailable');
	  	throw new Error('Status is not OK');
	  }

	  this.result = await this.req.text();
	  this.JSON = JSON.parse(this.result);
	}

	XMLHttpReq () {
		return new Promise((resolve, reject)=>{
			this.req = new XMLHttpRequest();
			this.req.onload = this.XMLHttpRequestOnloadHandler.bind(this, resolve);
			this.req.onerror = this.XMLHttpRequestOnerrorHandler.bind(this, reject);
			this.req.open("POST", this.form.action, true);
			this.req.send(this.formData);
		});
	}

	async XMLHttpRequestOnloadHandler (resolve) {
		try {
			this.result = this.req.response;
			this.JSON = JSON.parse(this.req.response);
		} catch (e) {
			this.catchErrBind(e);
		}
		resolve('ok');
	}

	async XMLHttpRequestOnerrorHandler (reject, e) {
		reject(e);
	}

	catchErr (e) {
		this.state.errHandler(e);
		try {
			let json = /{"error":.*"}/.exec(this.result);
			json === null || (this.JSON = JSON.parse(json));
		} catch (e) {
			return this.state.errHandler('Message not sent. Service is temporarily unavailable');
		}
	}

	handleResponse () {
		if (!this.JSON)
			return this.state.errHandler('Message not sent. Service is temporarily unavailable');
		if (this.JSON.send) {
			this.submitButtonSwitchSuccess();
		} else {
			this.state.errHandler('Message not sent.');
		}
		this.addFormInputListener();

		if (this.JSON.error && this.JSON.error.length > 0) {
			for (var i = 0; i < this.JSON.error.length; i++) {
				this.errorMsgHandler(this.JSON.error[i]);
			}
		}
	}

	cleanUp () {
		this.result = {};
		this.JSON	= {};
		this.serverErr = false;
	}

	errorMsgHandler(errorMsg) {
		switch (errorMsg) {
			case 'Incorrect email':
			  this.state.errHandler('Please enter a valid email address');
				break;
			case 'nameIsNull':
			  this.state.errHandler('Field "Name" is not filled');
			  break;
			case 'nameIsTooShort':
			  this.state.errHandler('Name must contain more than one character');
			  break;
			case 'nameIsTooLong':
			  this.state.errHandler('Name must be less than 100 characters');
			  break;
			case 'phoneNumberIsTooShort':
			  this.state.errHandler('Phone number must be 11 digits');
			  break;
			case 'phoneNumberIsTooLong':
			  this.state.errHandler('Phone number must be less than 20 digits');
			  break;
			case 'Incorrect phoneNumber':
			  this.state.errHandler('Please enter a valid phone number');
			  break;
			case 'infoIsNull':
			  break;
			case 'infoIsTooShort':
			  break;
			case 'infoIsTooLong':
			  this.state.errHandler('Information must contain less than two thousand characters');
			  break;
			case 'fileIsExe':
			  this.state.errHandler('The file cannot have an .exe extension');
			  break;
			case 'fileIsTooBig':
			  this.state.errHandler('File size cannot exceed 10 MB');
			  break;
			case 'fileIsNotUploads':
			  break;
			case 'mailIsNotSend':
			  break;

			default:
				this.serverErr || (this.serverErr = true,
					this.state.errHandler('Service is temporarily unavailable'));
				let err = /^Mailer Error:.*$/.exec(errorMsg);
				err === null || this.state.errHandler(new Error(err + '---' + this.result));
			  break;
		}
	}
}
