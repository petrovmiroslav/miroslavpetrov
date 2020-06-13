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
    this.clientDevice.windowResizeHandlersQueue.resizeCube3d = this.resize.bind(this);

		this.cube3d = null;
		this.cube3dScene = null;
		this.cube3dLoadingIcon = null;
		this.cube3dLevels = null;
		this.frontSides = null;
		this.backSides = null;
		this.leftSides = null;
		this.rightSides = null;
		this.topSides = null;
		this.bottomSides = null;
		this.texts = null;

		this.cube3dOnMouseMoveBind = this.cube3dOnMouseMove.bind(this);
		this.cube3dOnMouseDownBind = this.cube3dOnMouseDown.bind(this);
		this.cube3dOnMouseUpBind = this.cube3dOnMouseUp.bind(this);
		this.cube3dOnTouchMoveBind = this.cube3dOnTouchMove.bind(this);
		this.cube3dOnTouchStartBind = this.cube3dOnTouchStart.bind(this);
		this.cube3dOnTouchEndBind = this.cube3dOnTouchEnd.bind(this);
		this.loopBind = this.loop.bind(this);
		this.waitCube3dStopRotationBind = this.waitCube3dStopRotation.bind(this);

		this.lev = 5;
		this.text = 'MiroslavPetrov';
		this.currentLevel = 1;
		this.gap = -14.5;
		this.gaps = [];
		this.gapscnt = 0;
  	this.md = false;
  	this.mouseX = 0;
  	this.oldMouseX = 0;
  	this.vx = [];
    this.px = [];

		this.cube3dWidth = null;
		this.cube3dPause = true;
		this.cube3dRotateYValue = 0;
		this.activateLevelCount = 0;
	}
	
	init () {
		this.cube3d = document.querySelector('.cube3d');
		this.cube3dScene = document.querySelector('.cube3d__scene');
		this.cube3dLoadingIcon = document.querySelector('.cube3d__loadingIconContainer');


		
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

		this.rAF(this.activate);
	}

	activate () {
		this.cube3dLoadingIcon.classList.add('hidden');
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
    	if (i >= Math.ceil(this.lev / 2)) {
    		levelZIndex = this.lev + 1 - i;
    	}

    	let divClickTarget = '<div id="' + i + '" class="cube3d__clickTarget cube3d__clickTarget_level' + i + '"></div>';

      html += '<div id="cube3d-level' + i + '" class="cube3d__level" ' +
				      'style="' + 
				      	'width: ' + sideWidth + 'px; ' +
				      	'height: ' + sideHeight + 'px; ' +
				      	'z-index: ' + levelZIndex  + '; ' + 
				      	//'transform: translateZ(-' + this.translateZValue + 'px) rotateY( 0deg);' +
				      '">' +
	      					'<div class="cube3d__side cube3d__side_front" ' + 
	      					'style="' +
	      						'transform: rotateY(0deg) translateZ(' + this.translateZValue + 'px);' +
	      					'">'+
		      						'<p class="cube3d__text cube3d__text_shift_up" ' + fontSize +'>' + this.text + '</p>' +
		      						'<p class="cube3d__text cube3d__text_shift_down" ' + fontSize +'>' + this.text + '</p>' +
		      						divClickTarget +
	      					'</div>'+
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
			            '<div class="cube3d__side cube3d__side_top" style="transform: rotateX(90deg) translateZ(' + this.translateZValue + 'px);"></div>'+
			            '<div class="cube3d__side cube3d__side_bottom" style="transform: rotateX(-90deg) translateZ(' + this.translateZValue * -0.6 + 'px);"></div>'	+
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
  	if (this.state.drawCube3dDone) {
  		this.cube3dWidth = this.cube3d.clientWidth;
	  	this.translateZValue = this.cube3dWidth / 2;
	  	let sideWidth = this.cube3dWidth,
	    		sideHeight = this.cube3dWidth / 5,
	    		fontSize = 'style="font-size: ' + this.translateZValue * 0.525 + 'px;"';

	  	/*this.cube3dLevels.forEach(function (level) {
	  		level.style.width = sideWidth + 'px';
	  		level.style.height = sideHeight + 'px';
	  		level.style.transform = 'translateZ(-' + translateZValue + 'px) rotateY(0deg)';
	  	});
	  	this.frontSides.forEach(function (frontSide) {
	  		frontSide.style.transform = 'rotateY(0deg) translateZ(' + translateZValue + 'px)';
	  	});
	  	this.backSides.forEach(function (backSide) {
	  		backSide.style.transform = 'rotateY(180deg) translateZ(' + translateZValue + 'px)';
	  	});
	  	this.leftSides.forEach(function (leftSide) {
	  		leftSide.style.transform = 'rotateY(-90deg) translateZ(' + translateZValue + 'px)';
	  	});
	  	this.rightSides.forEach(function (rightSide) {
	  		rightSide.style.transform = 'rotateY(90deg) translateZ(' + translateZValue + 'px)';
	  	});
	  	this.topSides.forEach(function (topSide) {
	  		topSide.style.transform = 'rotateX(90deg) translateZ(' + translateZValue + 'px)';
	  	});
	  	this.bottomSides.forEach(function (bottomSide) {
	  		bottomSide.style.transform = 'rotateX(-90deg) translateZ(' + translateZValue * -0.6 + 'px)';
	  	});
	  	this.texts.forEach(function (text) {
	  		text.style['font-size'] = translateZValue * 0.525 + 'px';
	  	});*/
	  	for (let i = 0; i < this.cube3dLevels.length; i++) {
	  		this.cube3dLevels[i].style.width = sideWidth + 'px';
	  		this.cube3dLevels[i].style.height = sideHeight + 'px';
			  //this.cube3dLevels[i].style.transform = 'translateZ(-' + this.translateZValue + 'px) rotateY(0deg)';
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
  }

  addCube3dClickListener () {
  	if (this.state.deviceIsTouchscreen) {
      this.cube3d.addEventListener('touchstart', this.cube3dOnTouchStartBind);
    } else {
      this.cube3d.addEventListener('mousedown', this.cube3dOnMouseDownBind);
    }
  }
  removeCube3dClickListener() {
    if (this.state.deviceIsTouchscreen) {
      this.cube3d.removeEventListener('touchmove', this.cube3dOnMouseMoveBind);
    } else {
      this.cube3d.removeEventListener('mousedown', this.cube3dOnMouseDownBind);
    }
  }

  addCube3dMoveAndUpListeners () {
    if (this.state.deviceIsTouchscreen) {
      	document.addEventListener('touchmove', this.cube3dOnTouchMoveBind);
      	document.addEventListener('touchend', this.cube3dOnTouchEndBind);
    } else {
  			document.addEventListener('mousemove', this.cube3dOnMouseMoveBind);
  			document.addEventListener('mouseup', this.cube3dOnMouseUpBind);
    }
  }
  removeCube3dMoveAndUpListeners () {
    if (this.state.deviceIsTouchscreen) {
      document.removeEventListener('touchmove', this.cube3dOnTouchMoveBind);
      document.removeEventListener('touchend', this.cube3dOnTouchEndBind);
    } else {
      document.removeEventListener('mousemove', this.cube3dOnMouseMoveBind);
    	document.removeEventListener('mouseup', this.cube3dOnMouseUpBind);
    }
  }
  
	cube3dOnTouchStart (e) { console.log('cube3dOnTouchStart');
		e.preventDefault();

  	window.clearTimeout(this.cube3dPauseTimeout);
  	if (this.cube3dPause) {
  		this.cube3dPauseOFF(e);
  	}

  	this.clearClickPositionHistory(e);

  	this.setCurrentLevel(e);

  	this.gaps.length = 0;
  	this.md = true;
	}
	cube3dOnTouchMove (e) {
		e.preventDefault(); 
    this.mouseX = e.touches[0].clientX; console.log(event.touches[0].clientX);
	}
	cube3dOnTouchEnd (e) {console.log('cube3dOnTouchEnd');
    if (this.md) {
      this.md = false;
    	
    	this.cube3dRotateYValue = 0;
    	this.waitCube3dStopRotation();
    }
	}
  cube3dOnMouseDown (e) {console.log('cube3dOnMouseDown');
  	e.preventDefault();

  	window.clearTimeout(this.cube3dPauseTimeout);
  	if (this.cube3dPause) {
  		this.cube3dPauseOFF(e);
  	}
  	this.clearClickPositionHistory(e);

  	this.setCurrentLevel(e);

  	this.gaps.length = 0;
  	this.md = true;
  }
  cube3dOnMouseMove (e) {console.log(event.clientX);
    //e.preventDefault();
    if (this.md) {
    	this.mouseX = e.clientX;  
    }
  }
  cube3dOnMouseUp (e) {console.log('cube3dOnMouseUp');
  	console.log("UP");

  	if (this.md) {
      //e.preventDefault();
      this.md = false;
    }

    //this.cube3dPauseTimeout = window.setTimeout(this.waitCube3dStopRotationBind, 2000);
    this.cube3dRotateYValue = 0;
    this.waitCube3dStopRotation();
  }
  clearClickPositionHistory (event) {
  	if (event) {
  		if (this.state.deviceIsTouchscreen) {
  			this.oldMouseX = event.touches[0].clientX;
	  		this.mouseX = event.touches[0].clientX;
	  	} else {
	  		this.oldMouseX = event.clientX;
		  	this.mouseX = event.clientX;
	  	}
  	}
  }
  waitCube3dStopRotation () {console.log('WAIT');
  	let newRotateYValue = +/\((\S*)deg\)/.exec(this.cube3dLevels[0].style.transform)[1];
  	if (this.cube3dRotateYValue === newRotateYValue) {
  		return this.cube3dPauseON();
  	}
  	this.cube3dRotateYValue = newRotateYValue;
  	this.cube3dPauseTimeout = window.setTimeout(this.waitCube3dStopRotationBind, 2000);
  }
  cube3dPauseON () {console.log('cube3dPauseON');
  	this.cube3dPause = true;
  	this.removeCube3dMoveAndUpListeners();
  }
  cube3dPauseOFF (event) {console.log('cube3dPauseOFF');
  	this.cube3dPause = false;
  	this.addCube3dMoveAndUpListeners();
  	this.loop();
  }

  cube3dStart () {
  	this.cube3d.classList.remove('opacity0');
  }

  cube3dStop () {
  	if (!this.cube3dPause) {console.log('CUBESTOP');
  		window.clearTimeout(this.cube3dPauseTimeout);
	  	this.cube3dPauseON();

	  	this.gap = 0;
	  	for (let i = 0; i < this.lev + 2; i++) {
	  		this.vx[i] = 0;
	      this.px[i] = -20;//this.px[0];
	    }
	    this.render();
  	}
  	this.cube3d.classList.add('opacity0');
  }

  setCurrentLevel (event) {
  	let	level = this.currentLevel,
  			re = /level(\d)/,
  			thisLev = this.lev;
  	event.target.classList.forEach(function (className) {
  		let match = re.exec(className);
  		if (match) {
  			if (match[1] <= thisLev) {
  				level = match[1];
  			}
  		}
  	});
  	this.currentLevel = level;
  }

  loop () {/*console.log(Date.now());*/
  	if (!this.cube3dPause) {
  		this.update();
	  	this.render();

	  	window.requestAnimationFrame(this.loopBind);
  	}
  }

  update () {
    if (this.md) {
      this.gap = this.averageGaps(this.mouseX - this.oldMouseX);
    }
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
    if (isNaN(n)) {
      return 0;
    }
    let gl = this.gaps.length;
    this.gaps[this.gapscnt] = n;
    let ave = 0;
    for (let i = 0; i < gl; i++) {
      ave += this.gaps[i];
    };
    this.gapscnt = (this.gapscnt + 1) % 10;
    let tmp = ave / gl*0.8;
    if (isNaN(tmp)) {
      tmp = 0;
    }
    return tmp;
  }
  render() {
  	for (let i = 0; i < this.cube3dLevels.length; ++i) {
		  this.cube3dLevels[i].style.transform = 'translateZ(-' + this.translateZValue + 'px) rotateY(' + this.px[i+1] + 'deg)';
		}
  }
}
//Twisty thing - more cross browser - in CSS/JS by dehash.com released under MIT License https://opensource.org/licenses/MIT 

// Update - working on making it cross browser, faster, using fewer resources, and running on the GPU in all browsers & devices  -
// as a result of the updates this example now works in IE10 and iPad, & much faster in Firefox, about the same in chrome - more tweaks to do -

// A very useful pen for IE10 CSS 3D - https://codepen.io/thebabydino/details/bdvya

//Note: for iPad & touch screens view click Share then Full Page

// work in progress - just playing around to try to get some interesting effects - drag over the image it should twist around in some sort of css3d space - should work in chrome and FF not sure about ie - seen similar ideas for displaying graphics many times but i think one of the best was an old flash one by yugop.com but I cannot find it online anymore and it has been done many times since.