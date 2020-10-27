'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Cube3d };

class Cube3d {
	constructor (State, ClientDevice) {
		this.state = State;
		this.state.drawCube3dDone = false;
		this.state.cube3dCreate = this.create.bind(this);
		this.state.cube3dStart = this.cube3dStart.bind(this);
		this.state.cube3dStop = this.cube3dStop.bind(this);

		this.clientDevice = ClientDevice;
    this.clientDevice.windowResizeHandlersQueue.resizeCube3d = this.resizeRAF.bind(this);

		this.cube3d = {};
		this.cube3dScene = {};
		this.cube3dLevels = {};
		this.frontSides = {};
		this.backSides = {};
		this.leftSides = {};
		this.rightSides = {};
		this.topSides = {};
		this.bottomSides = {};
		this.texts = {};

		this.cube3dOnMouseMoveBind = this.cube3dOnMouseMove.bind(this);
		this.cube3dOnMouseDownBind = this.cube3dOnMouseDown.bind(this);
		this.cube3dOnMouseUpBind = this.cube3dOnMouseUp.bind(this);
		this.cube3dOnTouchMoveBind = this.cube3dOnTouchMove.bind(this);
		this.cube3dOnTouchStartBind = this.cube3dOnTouchStart.bind(this);
		this.cube3dOnTouchEndBind = this.cube3dOnTouchEnd.bind(this);
		this.loopBind = this.loop.bind(this);
		this.waitCube3dStopRotationBind = this.waitCube3dStopRotation.bind(this);
    this.hideUserHintBind = this.hideUserHint.bind(this);
    this.userHintOpacity0Bind = this.userHintOpacity0.bind(this);
    this.userHintOpacity1Bind = this.userHintOpacity1.bind(this);
    this.cube3dBlockSliderTimeoutFuncBind = this.cube3dBlockSliderTimeoutFunc.bind(this);

		this.lev = 5;
		this.text = 'MiroslavPetrov';
		this.currentLevel = 1;
    this.levelRegExp = /level(\d)/;
		this.gap = -14.5;
		this.gaps = [];
		this.gapscnt = this.mouseX = this.oldMouseX = 0;
  	this.md = false;
  	this.vx = [];
    this.px = [];
    this.cube3dLevelsRotateValue = [];

		this.cube3dWidth = this.cube3dRotateYValue = this.activateLevelCount = this.cube3dBlockSliderTimeout = 0;
		this.cube3dPause = true;
    this.userStartPlay = false;
	}
	
	init () {
		this.cube3d = document.querySelector('.cube3d');
		this.cube3dScene = this.cube3d.querySelector('.cube3d__scene');
    this.userHint = this.cube3d.querySelector('.userHint_cube3d');
    this.cubeGravity = document.querySelector('.aboutSection__cubeGravity');
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

	create () {
		this.cube3dWidth = this.cube3d.clientWidth;
		this.draw();
    this.activate();
	}

	activate () {
		this.cube3dScene.classList.remove('hidden');

		this.addCube3dClickListener();
		this.addCube3dMoveAndUpListeners();

		this.cube3dPause = false;
		this.loop();

		this.cube3dPauseTimeout = window.setTimeout(this.waitCube3dStopRotationBind, 2000);
	}

	draw() {
    this.cube3dScene.innerHTML = '';

    this.translateZValue = this.cube3dWidth / 2;
    let html = '',
    		sideWidth = this.cube3dWidth,
    		sideHeight = this.cube3dWidth / 5,
    		fontSize = 'style="font-size: ' + this.translateZValue * 0.525 + 'px;"';
    for (let i = 1; i < this.lev + 1; i++) {
    	let levelZIndex = 'auto';
      i >= Math.ceil(this.lev / 2) && (levelZIndex = this.lev + 1 - i);

    	let divClickTarget = '<div id="' + i + '" class="cube3d__clickTarget cube3d__clickTarget_level' + i + '"></div>',
    	  top = '<div class="cube3d__side cube3d__side_top" style="transform: rotateX(90deg) translateZ(' + this.translateZValue + 'px);"></div>',
    	  bottom = '<div class="cube3d__side cube3d__side_bottom" style="transform: rotateX(-90deg) translateZ(' + this.translateZValue * -0.6 + 'px);"></div>';

      html += 
      '<div id="cube3d-level' + i + '" class="cube3d__level" ' +
	      'style="' + 
	      	'width: ' + sideWidth + 'px; ' +
	      	'height: ' + sideHeight + 'px; ' +
	      	'z-index: ' + levelZIndex  + '; ' + 
	    '">' +
    		(i < Math.ceil(this.lev / 2) ? top+bottom : bottom+top) +
        '<div class="cube3d__side cube3d__side_back" style="transform: rotateY(180deg) translateZ(' + this.translateZValue + 'px);">'+
					'<p class="cube3d__text cube3d__text_shift_up" ' + fontSize +'>' + this.text + '</p>' +
					'<p class="cube3d__text cube3d__text_shift_down" ' + fontSize +'>' + this.text + '</p>' +
					divClickTarget +
				'</div>'+
        '<div class="cube3d__side cube3d__side_left" style="transform: rotateY(-90deg) translateZ(' + this.translateZValue + 'px);">'+
					'<p class="cube3d__text cube3d__text_shift_up-left" ' + fontSize +'>' + this.text + '</p>' +
					'<p class="cube3d__text cube3d__text_shift_down-left" ' + fontSize +'>' + this.text + '</p>' +
					divClickTarget +
				'</div>'+
        '<div class="cube3d__side cube3d__side_right" style="transform: rotateY(90deg) translateZ(' + this.translateZValue + 'px);">'+
					'<p class="cube3d__text cube3d__text_shift_up-left" ' + fontSize +'>' + this.text + '</p>' +
					'<p class="cube3d__text cube3d__text_shift_down-left" ' + fontSize +'>' + this.text + '</p>' +
					divClickTarget +
				'</div>'+
				'<div class="cube3d__side cube3d__side_front" ' + 
				'style="' +
					'transform: rotateY(0deg) translateZ(' + this.translateZValue + 'px);' +
				'">'+
						'<p class="cube3d__text cube3d__text_shift_up" ' + fontSize +'>' + this.text + '</p>' +
						'<p class="cube3d__text cube3d__text_shift_down" ' + fontSize +'>' + this.text + '</p>' +
						divClickTarget +
				'</div>'+
			'</div>';
    }
    this.cube3dScene.innerHTML = html;

    this.setRefs();

    for (let i = 0; i < this.lev + 2; i++) {
    	this.vx.push(0);
      this.px.push(1);
    }

    this.state.drawCube3dDone = true;
  }

  setRefs () {
  	this.cube3dLevels = this.cube3d.querySelectorAll('.cube3d__level');
  	this.frontSides = this.cube3d.querySelectorAll('.cube3d__side_front');
		this.backSides = this.cube3d.querySelectorAll('.cube3d__side_back');
		this.leftSides = this.cube3d.querySelectorAll('.cube3d__side_left');
		this.rightSides = this.cube3d.querySelectorAll('.cube3d__side_right');
		this.topSides = this.cube3d.querySelectorAll('.cube3d__side_top');
		this.bottomSides = this.cube3d.querySelectorAll('.cube3d__side_bottom');
		this.texts = this.cube3d.querySelectorAll('.cube3d__text');
  }

  removeClassHidden () {
  	this.cube3dScene.classList.remove('hidden');
  }
  resize () {
    if (!this.state.drawCube3dDone) return;
		this.cube3dWidth = this.cube3d.clientWidth;
  	this.translateZValue = this.cube3dWidth / 2;
  	let sideWidth = this.cube3dWidth,
    		sideHeight = this.cube3dWidth / 5,
    		fontSize = 'style="font-size: ' + this.translateZValue * 0.525 + 'px;"';

  	for (let i = 0; i < this.cube3dLevels.length; i++) {
  		this.cube3dLevels[i].style.width = sideWidth + 'px';
  		this.cube3dLevels[i].style.height = sideHeight + 'px';
		}
  	for (let i = 0; i < this.frontSides.length; i++) {
		  this.frontSides[i].style.transform = 'rotateY(0deg) translateZ(' + this.translateZValue + 'px)';
		}
  	for (let i = 0; i < this.backSides.length; i++) {
		  this.backSides[i].style.transform = 'rotateY(180deg) translateZ(' + this.translateZValue + 'px)';
		}
  	for (let i = 0; i < this.leftSides.length; i++) {
		  this.leftSides[i].style.transform = 'rotateY(-90deg) translateZ(' + this.translateZValue + 'px)';
		}
  	for (let i = 0; i < this.rightSides.length; i++) {
		  this.rightSides[i].style.transform = 'rotateY(90deg) translateZ(' + this.translateZValue + 'px)';
		}
  	for (let i = 0; i < this.topSides.length; i++) {
		  this.topSides[i].style.transform = 'rotateX(90deg) translateZ(' + this.translateZValue + 'px)';
		}
  	for (let i = 0; i < this.bottomSides.length; i++) {
		  this.bottomSides[i].style.transform = 'rotateX(-90deg) translateZ(' + this.translateZValue * -0.6 + 'px)';
		}
  	for (let i = 0; i < this.texts.length; i++) {
		  this.texts[i].style['font-size'] = this.translateZValue * 0.525 + 'px';
		}
		this.render();
  }

  addCube3dClickListener () {
    if (this.state.deviceIsTouchscreen)
      return this.cube3d.addEventListener('touchstart', this.cube3dOnTouchStartBind, this.state.passiveListener);
    this.cube3d.addEventListener('mousedown', this.cube3dOnMouseDownBind, this.state.passiveListener);
  }
  removeCube3dClickListener() {
    if (this.state.deviceIsTouchscreen)
      return this.cube3d.removeEventListener('touchstart', this.cube3dOnMouseMoveBind, this.state.passiveListener);
    this.cube3d.removeEventListener('mousedown', this.cube3dOnMouseDownBind, this.state.passiveListener);
  }

  addCube3dMoveAndUpListeners () {
    if (this.state.deviceIsTouchscreen)
      return document.addEventListener('touchmove', this.cube3dOnTouchMoveBind, this.state.passiveListener),
      document.addEventListener('touchend', this.cube3dOnTouchEndBind, this.state.passiveListener);
    document.addEventListener('mousemove', this.cube3dOnMouseMoveBind, this.state.passiveListener);
    document.addEventListener('mouseup', this.cube3dOnMouseUpBind, this.state.passiveListener);

    this.addUserHintListeners();
  }
  removeCube3dMoveAndUpListeners () {
    if (this.state.deviceIsTouchscreen)
      return document.removeEventListener('touchmove', this.cube3dOnTouchMoveBind, this.state.passiveListener),
      document.removeEventListener('touchend', this.cube3dOnTouchEndBind, this.state.passiveListener);
    document.removeEventListener('mousemove', this.cube3dOnMouseMoveBind, this.state.passiveListener);
    document.removeEventListener('mouseup', this.cube3dOnMouseUpBind, this.state.passiveListener);
  }

  addUserHintListeners () {
    if (this.userStartPlay) return;
    this.cube3d.addEventListener('mouseover', this.userHintOpacity0Bind, this.state.passiveListener);
    this.cube3d.addEventListener('mouseout', this.userHintOpacity1Bind, this.state.passiveListener);
    this.cubeGravity.addEventListener('mouseover', this.userHintOpacity0Bind, this.state.passiveListener);
    this.cubeGravity.addEventListener('mouseout', this.userHintOpacity1Bind, this.state.passiveListener);
  }
  removeUserHintListeners () {
    if (this.state.deviceIsTouchscreen) return;
    this.cube3d.removeEventListener('mouseover', this.userHintOpacity0Bind, this.state.passiveListener);
    this.cube3d.removeEventListener('mouseout', this.userHintOpacity1Bind, this.state.passiveListener);
    this.cubeGravity.removeEventListener('mouseover', this.userHintOpacity0Bind, this.state.passiveListener);
    this.cubeGravity.removeEventListener('mouseout', this.userHintOpacity1Bind, this.state.passiveListener);
  }
  
	cube3dOnTouchStart (e) {
  	this.cube3dMoveStartHandler(e);
	}
	cube3dOnTouchMove (e) {
    this.mouseX = e.touches[0].clientX;
	}
	cube3dOnTouchEnd () {
    this.cube3dMoveEndHandler();
	}
  cube3dOnMouseDown (e) {
  	this.cube3dMoveStartHandler(e);
  }
  cube3dOnMouseMove (e) {
    this.md && (this.mouseX = e.clientX);
  }
  cube3dOnMouseUp () {
    this.cube3dMoveEndHandler();
  }
  cube3dMoveStartHandler (e) {
    window.clearTimeout(this.cube3dPauseTimeout);
    this.cube3dPause && this.cube3dPauseOFF();
    this.clearClickPositionHistory(e);
    this.setCurrentLevel(e);
    this.gaps.length = 0;
    this.md = this.state.cube3dBlockSlider = true;
    window.clearTimeout(this.cube3dBlockSliderTimeout);
    this.userStartPlay || (this.removeUserHintListeners(), this.hideUserHint());
  }
  cube3dMoveEndHandler () {
    this.md && (this.md = this.cube3dRotateYValue = 0, this.cube3dBlockSliderTimeout = window.setTimeout(this.cube3dBlockSliderTimeoutFuncBind,200), this.waitCube3dStopRotation());
  }
  cube3dBlockSliderTimeoutFunc () {
    this.state.cube3dBlockSlider = false;
  }
  clearClickPositionHistory (event) {
    if (!event) return;
    if (this.state.deviceIsTouchscreen)
      return this.oldMouseX = event.touches[0].clientX,
      this.mouseX = event.touches[0].clientX;
  	this.oldMouseX = event.clientX;
	  this.mouseX = event.clientX;
  }
  waitCube3dStopRotation () {
    let d = !0;
    for (let i = 0; i < this.cube3dLevelsRotateValue.length-1; i++) {
      this.cube3dLevelsRotateValue[i] === this.cube3dLevelsRotateValue[i+1] || (d = !1);
      break; 
    }
    d && this.cube3dRotateYValue === this.cube3dLevelsRotateValue[0] || (d = !1);
    this.cube3dRotateYValue = this.cube3dLevelsRotateValue[0];
    if (d) return this.cube3dPauseON();
  	this.cube3dPauseTimeout = window.setTimeout(this.waitCube3dStopRotationBind, 2000);
  }
  cube3dPauseON () {console.log('cube3dPauseON');
  	this.cube3dPause = true;
  	this.removeCube3dMoveAndUpListeners();
    this.userStartPlay || this.rAF(this.displayUserHint);
  }
  cube3dPauseOFF () {console.log('cube3dPauseOFF');
  	this.cube3dPause = false;
  	this.addCube3dMoveAndUpListeners();
  	this.loop();
  }

  cube3dStart () {
    this.resize();
  	this.cube3d.classList.remove('opacity0');
    
    this.cube3dPauseOFF();
    this.cube3dPauseTimeout = window.setTimeout(this.waitCube3dStopRotationBind, 200);
  }

  cube3dStop () {
  	if (!this.cube3dPause) {console.log('CUBESTOP');
  		window.clearTimeout(this.cube3dPauseTimeout);
	  	this.cube3dPauseON();
	  	/*this.gap = 0;
	  	for (let i = 0; i < this.lev + 2; i++) {
	  		this.vx[i] = 0;
	      this.px[i] = -20;//this.px[0];
	    }
	    this.render();*/

  	}
  	this.cube3d.classList.add('opacity0');
  }

  setCurrentLevel (event) {
    for (var i = event.target.classList.length - 1; i >= 0; i--) {
      let match = this.levelRegExp.exec(event.target.classList[i]);
      if (this.levelRegExp.exec(event.target.classList[i]))
        return match[1] <= this.lev && (this.currentLevel = match[1]);
    }
  }

  loop () {
    if (this.cube3dPause) return;
		this.update();
  	this.render();
  	window.requestAnimationFrame(this.loopBind);
  }

  update () {
    this.md && (this.gap = this.averageGaps(this.mouseX - this.oldMouseX));
    this.oldMouseX = this.mouseX;
    this.gap *= .93
    this.px[this.currentLevel] += this.gap;
    for (let i = 1; i < this.lev + 1; i++) {
      if (i != this.currentLevel) {
          let ax = (this.px[i + 1] + this.px[i - 1] - this.px[i] / 0.5) / 10;
          this.vx[i] = (this.vx[i] + ax) / 1.25;
          this.px[i] += this.vx[i];
      }
    }
    this.px[0] = this.px[1];
    this.px[this.lev + 1] = this.px[this.lev];
  }
  averageGaps(n) {
    if (isNaN(n)) return 0;
    let gl = this.gaps.length;
    this.gaps[this.gapscnt] = n;
    let ave = 0;
    for (let i = 0; i < gl; i++) {
      ave += this.gaps[i];
    };
    this.gapscnt = (this.gapscnt + 1) % 10;
    let tmp = ave / gl*0.8;
    isNaN(tmp) && (tmp = 0);
    return tmp;
  }
  render() {
    this.cube3dLevelsRotateValue = [];
  	for (let i = 0; i < this.cube3dLevels.length; ++i) {
      this.cube3dLevelsRotateValue[i] = Math.round(this.px[i+1]); 
		  this.cube3dLevels[i].style.transform = 'translateZ(-' + this.translateZValue + 'px) rotateY(' + this.px[i+1] + 'deg)';
		}
  }

  resizeRAF () {
    window.requestAnimationFrame(this.resize.bind(this));
  }

  displayUserHint () {
    this.userHint.classList.remove('hidden');
  }
  hideUserHint () {
    this.userStartPlay = true;
    this.userHint.classList.add('hidden');
  }
  hideUserHintRAF () {
    this.userHint.classList.add('hidden');
  }
  userHintOpacity0 () {
    this.userHint.classList.add('opacity0');
  }
  userHintOpacity1 () {
    this.userHint.classList.remove('opacity0');
  }
}
//Twisty thing - more cross browser - in CSS/JS by dehash.com released under MIT License https://opensource.org/licenses/MIT 

// Update - working on making it cross browser, faster, using fewer resources, and running on the GPU in all browsers & devices  -
// as a result of the updates this example now works in IE10 and iPad, & much faster in Firefox, about the same in chrome - more tweaks to do -

// A very useful pen for IE10 CSS 3D - https://codepen.io/thebabydino/details/bdvya

//Note: for iPad & touch screens view click Share then Full Page

// work in progress - just playing around to try to get some interesting effects - drag over the image it should twist around in some sort of css3d space - should work in chrome and FF not sure about ie - seen similar ideas for displaying graphics many times but i think one of the best was an old flash one by yugop.com but I cannot find it online anymore and it has been done many times since.