'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Form };

class Form {
	constructor (State) {
		this.state = State;
		this.state.formValue = {};
		
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
		this.XMLHttpRequestOnloadHandlerBind = this.XMLHttpRequestOnloadHandler.bind(this);
		this.catchErrBind = this.catchErr.bind(this);
		

		this.inputTickTimeout = null;
		this.formData = null;
		this.req = null;
		this.result = null;
		this.JSON = null;
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
		this.filePreview = this.form.querySelector('.filePreview');
		this.resetFileInputButton = this.form.resetFileInput;
		this.submitButton = this.form.submit;

		this.addPhoneNumberListeners();

		this.addFileInputChangeListener();

		this.addResetFileInputButtonClickListener();

		this.addSubmitListener();

		//this.form.addEventListener('click', ()=>{this.state.errHandler();});
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
		if (this.phoneNumInput.value.length < 5 ) return this.phoneNumInput.value = '';
		if (this.phoneNumInput.value.length < 18) {
			this.state.errHandler('Номер телефона должен состоять из 11 цифр');
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
	fileInputChangeHandler (e) {console.log('FILE');
		if (this.fileInput.files.length > 0) {
			if (this.fileInput.files[0].size < 10485760) {
				this.filePreview.textContent = this.fileInput.files[0].name;
				this.enableResetFileInputButton();
			} else {
				this.fileInput.value = '';
				this.filePreview.textContent = 'Файл не выбран. Размер файла не может превышать 10 MB';
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
	enableSubmitFileInputButton () {
		this.submitButton.disabled = false;
	}
	disableSubmitFileInputButton () {
		this.submitButton.disabled = true;
	}

	addResetFileInputButtonClickListener () {
		this.resetFileInputButton.addEventListener('click', this.resetFileInputButtonClickBind);
	}
	resetFileInputButtonClick (e) {
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
		this.disableSubmitFileInputButton();

		this.result = null;
		this.JSON = null;
		this.serverErr = false;

		this.formData = new FormData(this.form);
		this.formData.set('hidden', 'submit');
		
		await this.sendFormData().catch(this.catchErrBind);
		
		this.handleResponse();

		this.enableSubmitFileInputButton();

		this.cleanUp();		
	}
	async sendFormData () {
		if (self.fetch) {
			await this.fetchReq();
		} else {
			await this.XMLHttpReq();
		}
	}

	async fetchReq () {
		this.req = await fetch(this.form.action, {
	    method: 'POST',
	    body: this.formData
	  });
	  if (this.req) {
	  	if (!this.req.ok) {
	  		this.state.errHandler('Сообщение не отправлено. Сервис временно не доступен');
		  	throw new Error('Status is not OK');
		  }

		  this.result = await this.req.text();
		  this.JSON = JSON.parse(this.result);
	  }
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
		console.log(e);
		// console.log(JSON.parse(/{"error":.*"}/.exec(this.result)));
		// console.log(this.result);

		this.state.errHandler(e);
		try {
			let json = /{"error":.*"}/.exec(this.result);
			if (json !== null) {
				this.JSON = JSON.parse(json);
			}
		} catch (e) {
			return this.state.errHandler('Сообщение не отправлено. Сервис временно не доступен');
		}
	}

	handleResponse () {
		if (this.JSON) {
			if (this.JSON.send) {
				console.log('ПИСЬМО ОТПРАВЛЕНО');
			} else {
				this.state.errHandler('Сообщение не отправлено');
			}

			if (this.JSON.error) {
				if (this.JSON.error.length > 0) {
					for (var i = 0; i < this.JSON.error.length; i++) {
						this.errorMsgHandler(this.JSON.error[i]);
					}
				}
			}
		} else {
			console.log('ERROR!');
			return this.state.errHandler('Сообщение не отправлено. Сервис временно не доступен');
		}

		//console.log(this.result);
		console.log(this.JSON);
	}

	cleanUp () {
		this.result = null;
		this.JSON	= null;
		this.serverErr = false;
	}

	errorMsgHandler(errorMsg) {
		switch (errorMsg) {
			case 'Incorrect email':
			  console.log('EMAILLLLL');
			  this.state.errHandler('Введите корректный адрес эл. почты');
				break;
			case 'nameIsNull':
			  console.log('nameIsNullLLLLL');
			  this.state.errHandler('Поле "Имя" не заполнено');
			  break;
			case 'nameIsTooShort':
			  console.log('nameIsTooShortLLLLL');
			  this.state.errHandler('Имя должно содержать более одного знака');
			  break;
			case 'nameIsTooLong':
			  console.log('nameIsTooLongLLLLL');
			  this.state.errHandler('Имя должно содержать менее ста знаков');
			  break;
			case 'phoneNumberIsTooShort':
			  console.log('phoneNumberIsTooShortLLLLL');
			  this.state.errHandler('Номер телефона должен состоять из 11 цифр');
			  break;
			case 'phoneNumberIsTooLong':
			  console.log('phoneNumberIsTooLongLLLLL');
			  this.state.errHandler('Номер телефона должен содержать менее 20 цифр');
			  break;
			case 'Incorrect phoneNumber':
			  console.log('Incorrect phoneNumberLLLLL');
			  this.state.errHandler('Введите корректный номер телефона');
			  break;
			case 'infoIsNull':
			  console.log('infoIsNullLLLLL');
			  break;
			case 'infoIsTooShort':
			  console.log('infoIsTooShortLLLLL');
			  break;
			case 'infoIsTooLong':
			  console.log('infoIsTooLongLLLLL');
			  this.state.errHandler('Информация должна содержать менее двух тысяч знаков');
			  break;
			case 'fileIsExe':
			  console.log('fileIsExeLLLLL');
			  this.state.errHandler('Файл не может иметь расширение .exe');
			  break;
			case 'fileIsTooBig':
			  console.log('fileIsTooBigLLLLL');
			  this.state.errHandler('Размер файла не может превышать 10 MB');
			  break;
			case 'fileIsNotUploads':
			  console.log('fileIsNotUploadsLLLLL');
			  break;
			case 'mailIsNotSend':
			  console.log('mailIsNotSendLLLLL');
			  break;

			default:
				if (!this.serverErr) {
					this.serverErr = true;
					this.state.errHandler('Сервис временно не доступен');
				}

				let err = /^Mailer Error:.*$/.exec(errorMsg);
				if (err !== null) {
					this.state.errHandler(new Error(err + '---' + this.result));
				}
			  break;
		}
	}
}
