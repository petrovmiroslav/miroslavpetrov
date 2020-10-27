'use strict'
import { ReleaseTheKraken } from '../test/ReleaseTheKraken.js';
let Kraken = new ReleaseTheKraken;

export { Bubbles };

class Bubbles {
	constructor (State, ClientDevice) {
		this.state = State;
		this.bubblesCreated = false;
		this.state.bubblesUpdate = this.bubblesUpdate.bind(this);
		this.state.bubblesStart = false;
		this.state.bubblesPause = true;
		this.state.bubblesPauseON = this.bubblesPause.bind(this);
		this.state.bubblesPauseOFF = this.bubblesStart.bind(this);

		this.clientDevice = ClientDevice;
		this.clientDevice.windowResizeHandlersQueue.resizeBubbles = this.bubblesResize.bind(this);

		this.engine = null;
		this.canvasRECT = {};
		this.toCreateBlocks = [];
		this.blocksRECT = [];
		this.hover = this.drag = this.mousemoveTicking = false;
		this.windowWidth = this.windowHeight = 0;

		this.mousemoveBind = this.mousemove.bind(this);
		this.mousedownBind = this.mousedown.bind(this);
		this.mouseupBind = this.mouseup.bind(this);
		this.addCanvasCursorGrabRAFBind = this.addCanvasCursorGrabRAF.bind(this);
		this.removeCanvasCursorGrabRAFBind = this.removeCanvasCursorGrabRAF.bind(this);
		this.addCanvasCursorGrabBind = this.addCanvasCursorGrab.bind(this);
		this.removeCanvasCursorGrabBind = this.removeCanvasCursorGrab.bind(this);
		this.addCanvasCursorGrabbingRAFBind = this.addCanvasCursorGrabbingRAF.bind(this);
		this.removeCanvasCursorGrabbingRAFBind = this.removeCanvasCursorGrabbingRAF.bind(this);
		this.addCanvasCursorGrabbingBind = this.addCanvasCursorGrabbing.bind(this);
		this.removeCanvasCursorGrabbingBind = this.removeCanvasCursorGrabbing.bind(this);
		this.addHoverBind = this.addHover.bind(this);
	}

	init () {
		this.canvas = document.getElementById('canvas');
		this.canvasWrapper = this.canvas.parentNode;
		this.form = document.getElementById('form');
		this.phoneNumInput = this.form.phoneNumber;
		
		for (let i = 0, elForBlocks = this.form.querySelectorAll('.form__input'); i < elForBlocks.length; i++) {
			this.toCreateBlocks.push(elForBlocks[i]);
		}
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

	bubblesCreate () {
		if (!this.canvasWrapper.firstElementChild) {
			let canvas = document.createElement('canvas');
			canvas.id = 'canvas';
			canvas.classList.add('bubbles__canvas');
			this.canvas = canvas;
		}

		this.engine = Matter.Engine.create({
	    enableSleeping: true,
	  });

	  this.render = Matter.Render.create({
	    element: this.canvasWrapper,
	    canvas: this.canvas,
	    engine: this.engine,
	    options: {
	      width: this.canvasRECT.width,
	      height: this.canvasRECT.height,
	      background: '#212126',
	      pixelRatio: 'auto',
	      showShadows: false,
	      wireframes: false,
	      useDeviceOrientation: false,
	      showAngleIndicator: false
	    }
		});
		this.runner = Matter.Runner.create();

		this.createWalls();
		this.createBlocks();
		this.createCircles();
		this.createMouse();

		this.canvasWrapper.firstElementChild || this.canvasWrapper.append(canvas);

		this.bubblesCreated = true;
	}

	bubblesResize () {
		if (!this.bubblesCreated) return;
		if (this.state.windowWidth === this.windowWidth && this.state.windowHeight === this.windowHeight) return;
		this.windowWidth = this.state.windowWidth;
	  this.windowHeight = this.state.windowHeight;


		this.state.bubblesPause = true;
		Matter.Render.stop(this.render);
	  Matter.Runner.stop(this.runner);

  	this.mouse.element.removeEventListener("mousewheel", this.mouse.mousewheel);
		this.mouse.element.removeEventListener("DOMMouseScroll", this.mouse.mousewheel);
		this.mouse.element.removeEventListener("mousedown", this.mouse.mousedown);
		this.mouse.element.removeEventListener("mousemove", this.mouse.mousemove);
		this.mouse.element.removeEventListener("mouseup", this.mouse.mouseup);
  	this.mouse.element.removeEventListener('touchmove', this.mousemoveBind, this.state.passiveListener);
		this.mouse.element.removeEventListener('touchstart', this.mousedownBind, this.state.passiveListener);
		this.mouse.element.removeEventListener('touchend', this.mouseupBind, this.state.passiveListener);


  	this.canvasWrapper.innerHTML = '';
  	this.canvas = {};
  	Matter.Engine.clear(this.engine);
  	this.render.canvas = {};
    this.render.context = {};
    this.render.textures = {};
    this.engine = {};
    this.render = {};
    this.runner = {};
    this.mouse = {};
    this.mouseConstraint = {};
    this.walls = {};
    this.blocksRECT = [];
    this.blocks = {};
    this.stack = {};
    this.bubblesCreated = false;

    this.bubblesUpdate();
	}

	bubblesUpdate () {
		if (this.state.slide1IsActive) return;
		this.canvasRECT = this.canvasWrapper.getBoundingClientRect();
		for (var i = this.toCreateBlocks.length - 1; i >= 0; i--) {
			let getBCR = this.toCreateBlocks[i].getBoundingClientRect(),
			rect = {
				top: getBCR.top - this.canvasRECT.top,
				left: getBCR.left,
				width: getBCR.width,
				height: getBCR.height
			};
			this.blocksRECT.push(rect);
		}
		this.bubblesCreate();
	}

	createWalls () {
    this.walls  = Matter.Composite.create(); 
    let wallSize = 500;
    Matter.Composite.add(this.walls, Matter.Bodies.rectangle(this.canvasRECT.right/2, this.canvasRECT.height+wallSize/2, this.canvasRECT.width, wallSize, { isStatic: true }));
    Matter.Composite.add(this.walls, Matter.Bodies.rectangle(this.canvasRECT.right+wallSize/2+1, this.canvasRECT.height*-1, wallSize, this.canvasRECT.height*4, { isStatic: true }));
    Matter.Composite.add(this.walls, Matter.Bodies.rectangle(this.canvasRECT.left-wallSize/2-1, this.canvasRECT.height*-1, wallSize, this.canvasRECT.height*4, { isStatic: true }));
    Matter.Composite.add(this.walls, Matter.Bodies.rectangle(this.canvasRECT.right/2, -(this.canvasRECT.height*3+wallSize/2), this.canvasRECT.width, wallSize, { isStatic: true }));
   
    Matter.World.add(this.engine.world, this.walls);
	}
	createBlocks () {
		this.blocks = Matter.Composite.create();
		for (let i = 0; i < this.blocksRECT.length; i++) {
			let block = Matter.Bodies.rectangle(this.blocksRECT[i].left + this.blocksRECT[i].width / 2, this.blocksRECT[i].top + this.blocksRECT[i].height / 2, this.blocksRECT[i].width, this.blocksRECT[i].height, { isStatic: true, render: {visible: false} });
			
			Matter.Composite.add(this.blocks, block);
		}
		Matter.World.add(this.engine.world, this.blocks);
	}
	createCircles () {
		let RECT = this.canvasRECT,
		stackOption = {
    	circlesSize: Math.min(RECT.width*0.1, RECT.height*0.1),
			circleRenderOptions: {
				restitution: 0.4,
				render: {
		        fillStyle: 'rgba(242,75,89, 1)',
		        lineWidth: 0,
		        strokeStyle: "rgba(100,100,100, 0.2)"
		    }}
		};
		stackOption.colums = Math.floor(RECT.width / (stackOption.circlesSize * 1.5));
    stackOption.rows = Math.floor(RECT.height / (stackOption.circlesSize * 1.5));
    stackOption.x = stackOption.circlesSize / 2;
    stackOption.columnGap = stackOption.circlesSize / 2;
    stackOption.rowGap = stackOption.circlesSize / 2;
    stackOption.y = stackOption.rows * (stackOption.circlesSize + stackOption.rowGap) * -1.2;

		this.stack = Matter.Composites.stack(
			stackOption.x, 
			stackOption.y, 
			stackOption.colums, 
			stackOption.rows, 
			stackOption.columnGap, 
			stackOption.rowGap, 
			function(x, y, i, j) {
				x += Matter.Common.random(stackOption.circlesSize * 0.4 * -1, stackOption.circlesSize * 0.4);
				return Matter.Bodies.circle(
					x, 
					y, 
					Matter.Common.random(stackOption.circlesSize * 0.3, stackOption.circlesSize * 0.7),
					stackOption.circleRenderOptions
				);
			}
	  );

	  Matter.World.add(this.engine.world, this.stack);
	}

	createMouse () {
  	this.mouse = Matter.Mouse.create(this.render.canvas);
  	this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
              stiffness: 1,
              render: {
              	type: "line",
                visible: false
              }
            }
        });
    Matter.World.add(this.engine.world, this.mouseConstraint);
    this.render.mouse = this.mouse;

    this.fixEventListeners();

    Matter.Events.on(this.mouseConstraint, "startdrag", this.addCanvasCursorGrabbingBind);
  	Matter.Events.on(this.mouseConstraint, "enddrag", this.removeCanvasCursorGrabbingBind);
  	Matter.Events.on(this.mouseConstraint, "mousemove", this.addHoverBind);
  }

  fixEventListeners () {
  	this.mouse.element.removeEventListener("mousewheel", this.mouse.mousewheel);
		this.mouse.element.removeEventListener("DOMMouseScroll", this.mouse.mousewheel);
		this.mouse.element.removeEventListener('touchmove', this.mouse.mousemove);
  	this.mouse.element.removeEventListener('touchstart', this.mouse.mousedown);
  	this.mouse.element.removeEventListener('touchend', this.mouse.mouseup);
  	if (this.state.deviceIsTouchscreen) {
  		this.mouse.element.addEventListener('touchmove', this.mousemoveBind, this.state.passiveListener);
  		this.mouse.element.addEventListener('touchstart', this.mousedownBind, this.state.passiveListener);
  		this.mouse.element.addEventListener('touchend', this.mouseupBind, this.state.passiveListener);
  	}
  }
  mousemove (event) {
		var position = Matter.Mouse._getRelativeMousePosition(event, this.mouse.element, this.mouse.pixelRatio),
      touches = event.changedTouches;

    if (touches) {
        this.mouse.button = 0;
    }

    this.mouse.absolute.x = position.x;
    this.mouse.absolute.y = position.y;
    this.mouse.position.x = this.mouse.absolute.x * this.mouse.scale.x + this.mouse.offset.x;
    this.mouse.position.y = this.mouse.absolute.y * this.mouse.scale.y + this.mouse.offset.y;
    this.mouse.sourceEvents.mousemove = event;
	}
	mousedown (event) {
    var position = Matter.Mouse._getRelativeMousePosition(event, this.mouse.element, this.mouse.pixelRatio),
        touches = event.changedTouches;

    if (touches) {
        this.mouse.button = 0;
    } else {
        this.mouse.button = event.button;
    }

    this.mouse.absolute.x = position.x;
    this.mouse.absolute.y = position.y;
    this.mouse.position.x = this.mouse.absolute.x * this.mouse.scale.x + this.mouse.offset.x;
    this.mouse.position.y = this.mouse.absolute.y * this.mouse.scale.y + this.mouse.offset.y;
    this.mouse.mousedownPosition.x = this.mouse.position.x;
    this.mouse.mousedownPosition.y = this.mouse.position.y;
    this.mouse.sourceEvents.mousedown = event;

  }
  mouseup (event) {
    var position = Matter.Mouse._getRelativeMousePosition(event, this.mouse.element, this.mouse.pixelRatio),
        touches = event.changedTouches;
    
    this.mouse.button = -1;
    this.mouse.absolute.x = position.x;
    this.mouse.absolute.y = position.y;
    this.mouse.position.x = this.mouse.absolute.x * this.mouse.scale.x + this.mouse.offset.x;
    this.mouse.position.y = this.mouse.absolute.y * this.mouse.scale.y + this.mouse.offset.y;
    this.mouse.mouseupPosition.x = this.mouse.position.x;
    this.mouse.mouseupPosition.y = this.mouse.position.y;
    this.mouse.sourceEvents.mouseup = event;
	}
	addCanvasCursorGrab () {
		window.requestAnimationFrame(this.addCanvasCursorGrabRAFBind);
	}
	addCanvasCursorGrabRAF () {
		this.mousemoveTicking = false;
		this.canvas.classList.add("bubbles__canvas_grab");
	}
	removeCanvasCursorGrab () {
		window.requestAnimationFrame(this.removeCanvasCursorGrabRAFBind);
	}
	removeCanvasCursorGrabRAF () {
		this.mousemoveTicking = false;
		this.canvas.classList.remove("bubbles__canvas_grab");
	}
	addCanvasCursorGrabbing () {
		window.requestAnimationFrame(this.addCanvasCursorGrabbingRAFBind);
	}
	addCanvasCursorGrabbingRAF () {
		this.canvas.classList.add("bubbles__canvas_grabbing");
	}
	removeCanvasCursorGrabbing () {
		window.requestAnimationFrame(this.removeCanvasCursorGrabbingRAFBind);
	}
	removeCanvasCursorGrabbingRAF () {
		this.canvas.classList.remove("bubbles__canvas_grabbing");
	}
	
	addHover () {
		if (this.mousemoveTicking) return;
		if (this.mouseConstraint.body !== null) return;

		this.hoverObj = Matter.Query.point(this.stack.bodies, this.mouse.position);

		if (this.hoverObj.length > 0)
			return this.hover || (this.mousemoveTicking = true,
			this.hover = true,
			this.addCanvasCursorGrab());

		this.hover && (this.mousemoveTicking = true,
			this.hover = false,
			this.removeCanvasCursorGrab());
	}

  bubblesStart () {
  	if (!this.bubblesCreated)
  		return this.bubblesUpdate();

  	this.state.bubblesStart && (this.state.bubblesPause = false,
			Matter.Render.run(this.render),
			Matter.Runner.run(this.runner, this.engine));
  }
  bubblesPause () {
  	this.state.bubblesPause = true;
  	Matter.Render.stop(this.render);
	  Matter.Runner.stop(this.runner);
  }
}