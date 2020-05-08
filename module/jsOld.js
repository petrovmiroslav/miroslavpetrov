//'use strict';
console.log('%c Хотите чтобы я стал частью вашей команды? Пожалуйста, напишите – @.ru \n Обнаружил ошибку? ', 'background-color: #ffdd2d; color: #333;');



const GlobalVarObj = {};


(function ready(fn) {
  if (document.readyState != 'loading'){
    DOMContentLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', DOMContentLoaded);
  }
})();

function DOMContentLoaded() {
  Preloader.start ();

  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  //Движение фото вслед за движением мыши
  const hiBgImage = document.querySelector('.hi-background-image');
  const hiBgWindowWidth = window.innerWidth / 5;
  const hiBgWindowHeight = window.innerHeight / 5 ;
  let tickingHiBgImageTransform = false,
      timeoutHiBgImageTransformEvent = false;
  function requestTickHiBgImageTransform(e) {
      if(!tickingHiBgImageTransform) {
          timeoutHiBgImageTransformEvent = e;

          window.requestAnimationFrame(hiBgImageTransformFunction);
      }
      tickingHiBgImageTransform = true;
  }
  function hiBgImageTransformFunction() {
    tickingHiBgImageTransform = false;

    const mouseX = timeoutHiBgImageTransformEvent.clientX / hiBgWindowWidth;
    const mouseY = timeoutHiBgImageTransformEvent.clientY / hiBgWindowHeight;
    hiBgImage.style.transform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
  }
  function addHiBgImageTransformListener () {
    if ('ontouchstart' in window) {

    } else {
      document.addEventListener('mousemove', requestTickHiBgImageTransform);
    }
    
  };
  function removeHiBgImageTransformListener () {
    document.removeEventListener('mousemove', requestTickHiBgImageTransform);
  };
  addHiBgImageTransformListener();
  
  /////

  /////
  //Menu button and menu dropdown
  let menuOpen = false,
      menuButton = document.querySelector('#wrapperMenuButton'),
      menuWrapper = document.querySelector('.menuWrapper'),
      mainSlide = document.querySelector('.flipperContainerWrapper ~ .slide1'),
      parallaxSection = document.querySelector('.main > .slide2 .parallax'),
      flipperScrollTo = false,
      flipperIsDraw = false;
  
  menuButton.addEventListener('click', menuOpenHendler);
  function menuOpenHendler (){
    menuButton.removeEventListener('click', menuOpenHendler);
    removeFullscreenSliderListeners();
    removeScrollAngleHandler();

    this.classList.toggle('open');
    
    menuOpen ? 
    function () {
      if(hiBlockActive) {
        addHiBgImageTransformListener();
      }
      menuOpen = false;

      window.setTimeout(function(){
        menuButton.classList.toggle('hidden');
        flipperHandler();
      },300);
    }() :
    function () {
      if(hiBlockActive) {
        removeHiBgImageTransformListener();
      } else {
        if(cube3dOn) {
          cube3dStop();
        }
        document.querySelector('.main > .slide2 .angleBGGradientAnimationLayer').classList.add('animationNone');
        document.querySelector('.main > .slide2 #bgvid').classList.add('blur');
        document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.add('hidden');
      }
      menuOpen = true;

      if (mainSlide.classList.contains('slide2')) {
        flipperScrollTo = parallaxSection.scrollTop;
      }

      window.setTimeout(function(){
        menuButton.classList.toggle('hidden');
        flipperHandler();
      },300);
    }();
  }
  //Menu button and menu dropdown//////////////////
  ////////TOUCHHANDLE
  let touchStartY = 0;
  let touchEndY = 0;
  function touchStartHandler (e) {
    //e.preventDefault();
    touchStartY = e.changedTouches[0].clientY;
  }
  function touchEndHandler (e) {
    touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
  }
  function handleSwipe() {
      if (touchEndY - touchStartY < -20) {
        hiBlockScrollDown ();
        return true;
      }
      if (touchEndY - touchStartY > 20) {
        if (!hiBlockActive) {
          hiBlockScrollDown ();
          return true;
        }
      }
  }
  function addFullscreenSliderTouchListener () {
    document.addEventListener('touchstart', touchStartHandler, false);
    document.addEventListener('touchend', touchEndHandler, false); 
  }
  function removeFullscreenSliderTouchListener () {
    document.removeEventListener('touchstart', touchStartHandler, false);
    document.removeEventListener('touchend', touchEndHandler, false); 
  }
  function addFullscreenSliderListeners () {
    addFullscreenSliderTouchListener();
    addFullscreenSliderWheelListener();
    addFullscreenSliderKeyDownListener();
  }
  function removeFullscreenSliderListeners () {
    removeFullscreenSliderTouchListener();
    removeFullscreenSliderWheelListener();
    removeFullscreenSliderKeyDownListener();
  }
  function addFullscreenSliderTouchListenerRecursion () {
    if (Preloader.isHidden) {
      addFullscreenSliderListeners();
    } else {
      window.setTimeout(function() {
        addFullscreenSliderTouchListenerRecursion();
      }, 400);
    }
  }
  addFullscreenSliderTouchListenerRecursion();
  //addFullscreenSliderTouchListener();

  ////////TOUCHHANDLE//////////////
  ////////KEYDOWN HANDLE
  function addFullscreenSliderKeyDownListener () {
    window.addEventListener('keydown', keydownHandler);
  }
  function removeFullscreenSliderKeyDownListener () {
    window.removeEventListener('keydown', keydownHandler);
  }
  function keydownHandler (e) {
    if (e.keyCode == 40) {
      if (hiBlockActive) {
        hiBlockScrollDown ();
        
        return true;
      }
    } else {
      if (e.keyCode == 38) {
        if (!hiBlockActive) {
          //console.log("UP: ", direction);
          hiBlockScrollDown ();
          
          return true;
        }
      }
    }
  }
  ////////KEYDOWN HANDLE///////////
  ////////WHEELHANDLE
  function addFullscreenSliderWheelListener () {
    if (window.addEventListener) window.addEventListener("wheel", mouseWheel, false);
    window.onmousewheel = document.onmousewheel = mouseWheel;
  }
  function removeFullscreenSliderWheelListener () {
    if (window.addEventListener) window.removeEventListener("wheel", mouseWheel, false);
    window.onmousewheel = document.onmousewheel = null;
  }
  let mouseWheelHandleTick = false;
  function mouseWheel (e) {

    if (false == !!event) event = window.event;
    let direction = ((event.deltaY) ? event.deltaY/120 : event.deltaY/-3) || false;
    if (direction && !!wheel_handle && typeof wheel_handle == "function") {
        //if (event.preventDefault) event.preventDefault();
        //event.returnValue = false;
        if (!mouseWheelHandleTick) {
          mouseWheelHandleTick = true;
          wheel_handle(direction);
          window.setTimeout(function(){
            mouseWheelHandleTick = false;
          }, 1500);
        }
    }
  }

  function wheel_handle (direction) {
    if (direction > 0) {
      if (hiBlockActive) {
        //console.log("DOWN: ", direction);
        hiBlockScrollDown ();
        
        return true;
      }
    } else {
      if (!hiBlockActive) {
        //console.log("UP: ", direction);
        hiBlockScrollDown ();
        
        return true;
      }
    }
  }
////////WHEELHANDLE////////////////
  let hiBlockActive = true,
      lastScrollPosition = 0,
      canIScrollUp = false;

  function addFullscreenSliderScrollListener () {
    document.addEventListener('scroll', hiBlockScrollDown);
  };
  function removeFullscreenSliderScrollListener () {
    document.removeEventListener('scroll', hiBlockScrollDown);
  };
  

  //addFullscreenSliderScrollListener();
  

  function hiBlockScrollDown () {
    //console.log(window.scrollY);
    //lastScrollPosition = window.scrollY;
    lastScrollPosition = parallaxSection.scrollTop;
    if (hiBlockActive) {
      hiBlockActive = false;
      mainSlide = document.querySelector('.flipperContainerWrapper ~ .slide2');
      removeHiBgImageTransformListener();
      //removeFullscreenSliderScrollListener();
      /*removeFullscreenSliderTouchListener();
      removeFullscreenSliderKeyDownListener();
      removeFullscreenSliderWheelListener();*/
      removeFullscreenSliderListeners();
      //document.querySelector('html').style['scrollbar-width'] = 'auto';
      document.querySelector('html').style.position = 'fixed';
      
      menuButton.classList.toggle('hidden');
      document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.remove('hidden');
      sliderHandler (f1);


      window.setTimeout(function() {
        //addFullscreenSliderScrollListener();
        /*addFullscreenSliderTouchListener();
        addFullscreenSliderKeyDownListener();*/
        window.setTimeout(function() {
          
          addFullscreenSliderListeners();
          addScrollAngleHandler();
          setAngle();
        }, 200);
        document.querySelector('html').style.position = 'static';
        //document.querySelector('.slide2').insertAdjacentHTML('afterbegin', document.querySelector('.wrapperMenuButton').outerHTML);
        //document.querySelector('.main > .slide2').appendChild(menuButton);
        document.querySelector('.main > .slide2').insertBefore(menuButton, document.querySelector('.main > .slide2').firstChild);
        menuButton.classList.toggle('hidden');
        cube3dStart();
      }, 700);
    } else {
      //document.querySelector('#h1').innerHTML = document.querySelector('#h1').innerHTML + '</br>' + lastScrollPosition + '--' + window.scrollY;
      //if(window.scrollY <= 0) {
        if(parallaxSection.scrollTop <=0) {
        //lastScrollPosition = window.scrollY;
        lastScrollPosition = parallaxSection.scrollTop;
        menuButton.classList.toggle('hidden');
        
        if (lastScrollPosition <= 0) {
          /*canIScrollUp = true;

          if (canIScrollUp) {*
            canIScrollUp = false;*/
            //console.log("slide!!!");
            hiBlockActive = true;
            mainSlide = document.querySelector('.flipperContainerWrapper ~ .slide1');
            addHiBgImageTransformListener();
            //removeFullscreenSliderScrollListener();
            /*removeFullscreenSliderTouchListener();
            removeFullscreenSliderKeyDownListener();*/
            removeFullscreenSliderListeners();
            removeScrollAngleHandler();
            //document.querySelector('html').style['scrollbar-width'] = 'none';
            document.querySelector('html').style.position = 'fixed';
            //document.querySelector('html').style['overflow-y'] = 'scroll';
            cube3dStop();
            document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.add('hidden');
            sliderHandler (f1);

            window.setTimeout(function() {
              //addFullscreenSliderScrollListener();
              /*addFullscreenSliderTouchListener();
              addFullscreenSliderKeyDownListener();*/
              window.setTimeout(function() {
                addFullscreenSliderListeners();
              }, 200);
              document.querySelector('html').style.position = 'static';
              //document.querySelector('.main > #hiScreenWrapper').appendChild(menuButton);
              document.querySelector('.main > #hiScreenWrapper').insertBefore(menuButton, document.querySelector('.main > #hiScreenWrapper').firstChild);
              menuButton.classList.toggle('hidden');
            }, 700);
          //}
        }
      }
    }
  }
  /////FULLSCREEN SLIDER
  const body = document.querySelector('body');
  const FlipperContainer = document.querySelector('.flipperContainer');
  const FlipperContainerWrapper = document.querySelector('.flipperContainerWrapper');
  const SliderContainer = document.querySelector('.sliderContainer');
  const SliderContainerWrapper = document.querySelector('.sliderContainerWrapper');
  //const SliderContainer = document.querySelector('.sliderContainer');
  
  function addBodyClickListener () {
      body.addEventListener('click', f1);
  };

  slide1 = document.querySelector('.sliderContainerWrapper ~ .slide1');
  slide2 = document.querySelector('.sliderContainerWrapper ~ .slide2');

  function f1 () {

    //flipperHandler (f1);
    sliderHandler (f1);
  }
  
  function drawFlipper () {
    let n = 5;

    frontFlipperSide = mainSlide.outerHTML;
    backFlipperSide = menuWrapper.outerHTML;
    
    FlipperContainer.innerHTML = "";

    for (var i = 0; i < n; i++) {

      FlipperContainer.insertAdjacentHTML('beforeend', '<div class="flipper flipper' + i + '"><div class="front"><div class="flipperInnerWrapper">' 
        + frontFlipperSide 
        + '</div></div><div class="back"><div class="flipperInnerWrapper">' 
        + backFlipperSide 
        + '</div></div></div>');
    }

    if(menuWrapper.classList.contains('hidden')) {
      document.querySelectorAll('.flipperContainerWrapper video').forEach(function(videoInFlipperContainerWrapper){
        let sourcesToDelete = [];
        for (children in videoInFlipperContainerWrapper.children) {
          if (videoInFlipperContainerWrapper.children[children]) {
            if (videoInFlipperContainerWrapper.children[children].tagName) {
              if (videoInFlipperContainerWrapper.children[children].tagName == 'SOURCE') {
                sourcesToDelete.push(videoInFlipperContainerWrapper.children[children]);
              }
            }
          }
        }
        for (let j = 0; j < sourcesToDelete.length; j++) {
            videoInFlipperContainerWrapper.removeChild(sourcesToDelete[j]);
        }
      });
    }

    document.querySelectorAll('.flipperInnerWrapper .menuWrapper').forEach((el)=>{
      el.classList.toggle('hidden');
    });
    document.querySelectorAll('.flipper').forEach((el)=>{
      el.style.width = 'calc(100% / ' + n +')';
    });
    document.querySelectorAll('.flipperInnerWrapper').forEach((el)=>{
      el.style.width = 'calc(100% * ' + n +')';
    });

    for (var i = 1; i < n; i++) {
      document.querySelectorAll('.flipper' + i + ' .flipperInnerWrapper').forEach((el)=>{
        el.style.transform = 'translateX(-' + 100/n * i + '%)';
      });
    }
  }

  function drawSlider (from, to) {

    frontSlideContent = from.outerHTML;
    backSlideContent = to.outerHTML;

    SliderContainer.innerHTML = "";

    SliderContainer.style.flexDirection = "column";
    SliderContainerWrapper.style.zIndex = 3;
    //slide2.style.position = 'absolute';

    SliderContainer.insertAdjacentHTML('beforeend', '<div class="slider side side1"><div class="sliderInnerWrapper">' 
      + frontSlideContent 
      + '</div></div>');
    SliderContainer.insertAdjacentHTML('beforeend', '<div class="slider side side2"><div class="sliderInnerWrapper">' 
      + frontSlideContent 
      + '</div></div>');
  }

  function makeSliderHiddenBefore (whichSlide) {
    
    whichSlide.classList.toggle('hidden');
    SliderContainerWrapper.classList.toggle('sliderContainerWrapperHidden');
    void(SliderContainerWrapper.offsetHeight);
  }
  function makeFlipperHiddenBeforeOLD (whichSlide) {
    
    FlipperContainerWrapper.classList.toggle('flipperContainerWrapperHidden');

    if (mainSlide.classList.contains('slide2')) {
      if (menuOpen) {
        flipperScrollTo = parallaxSection.scrollTop;
        document.querySelectorAll('.flipperInnerWrapper .parallax').forEach((el)=>{
          el.scrollTop = flipperScrollTo;
          el.style['overflow-y'] = 'hidden';
        });
        document.querySelectorAll('.flipperInnerWrapper #wrapperParallax').forEach((el)=>{
          el.style['overflow-y'] = 'scroll';
        });
      }
    }

    whichSlide.classList.toggle('hidden');
    void(FlipperContainerWrapper.offsetHeight);
  }
  function makeFlipperHiddenBefore (whichSlide, to, animationDuration) {
    
    

    window.requestAnimationFrame(function(){
      FlipperContainerWrapper.classList.toggle('flipperContainerWrapperHidden');
      if (mainSlide.classList.contains('slide2')) {
        if (menuOpen) {

            //flipperScrollTo = parallaxSection.scrollTop;
            checkFlipperScrollToAndContinue();

            function checkFlipperScrollToAndContinue() {
              if (flipperScrollTo || flipperScrollTo == 0) {
                document.querySelectorAll('.flipperInnerWrapper .parallax').forEach((el)=>{
                  el.scrollTop = flipperScrollTo;
                  el.style['overflow-y'] = 'hidden';
                });
                flipperScrollTo = false;
                document.querySelectorAll('.flipperInnerWrapper #wrapperParallax').forEach((el)=>{
                  el.style['overflow-y'] = 'scroll';
                });

                window.requestAnimationFrame(function(){
                  whichSlide.classList.toggle('hidden');
                  void(FlipperContainerWrapper.offsetHeight);

                  FlipperRotate(to, animationDuration);
                });
              } else {
                window.requestAnimationFrame(checkFlipperScrollToAndContinue);
              }
            }
        } else {
          window.requestAnimationFrame(function(){
            whichSlide.classList.toggle('hidden');
            void(FlipperContainerWrapper.offsetHeight);

            FlipperRotate(to, animationDuration);
          });
        }
      } else {
        window.requestAnimationFrame(function(){
          whichSlide.classList.toggle('hidden');
          void(FlipperContainerWrapper.offsetHeight);

          FlipperRotate(to, animationDuration);
        });
      }
    });
  }


  function makeFlipperHiddenAfterOLD (whichFlipper, animationDuration) {
    window.setTimeout(function(){
      whichFlipper.classList.toggle('hidden');
      FlipperContainerWrapper.classList.toggle('flipperContainerWrapperHidden');
      whichFlipper.insertBefore(menuButton, whichFlipper.firstChild);
      menuButton.classList.toggle('hidden');
      menuButton.addEventListener('click', menuOpenHendler);
      void(FlipperContainerWrapper.offsetHeight);
      if(menuWrapper.classList.contains('hidden')) {
        addFullscreenSliderListeners();
        if(!hiBlockActive) {
          addScrollAngleHandler();
          document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.remove('hidden');
          window.setTimeout(cube3dStart, 200);
        }
      }
    }, animationDuration);
  }
  function makeFlipperHiddenAfter (whichFlipper) {
      whichFlipper.classList.toggle('hidden');
      FlipperContainerWrapper.classList.toggle('flipperContainerWrapperHidden');
      whichFlipper.insertBefore(menuButton, whichFlipper.firstChild);
      menuButton.classList.toggle('hidden');
      
      document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.remove('hidden');

      window.requestAnimationFrame(function(){
        menuButton.addEventListener('click', menuOpenHendler);
        void(FlipperContainerWrapper.offsetHeight);
        if(menuWrapper.classList.contains('hidden')) {
          addFullscreenSliderListeners();
          if(!hiBlockActive) {
            addScrollAngleHandler();
            document.querySelector('.main > .slide2 .angleBGGradientAnimationLayer').classList.remove('animationNone');
            document.querySelector('.main > .slide2 #bgvid').classList.remove('blur');
            window.setTimeout(cube3dStart, 200);
          }
        }
      });
  }

  function FlipperRotate (to, animationDuration) {

    window.requestAnimationFrame(function(){
      FlipperContainer.classList.toggle('rotate');
      window.requestAnimationFrame(function(){
        //makeFlipperHiddenAfter(to, animationDuration);
        window.setTimeout(function(){
          window.requestAnimationFrame(function(){
            makeFlipperHiddenAfter(to);
          });
        }, animationDuration);
      });
    });
  }

  function changeFlipperFromToOLD (from, to, animationDuration) {

    makeFlipperHiddenBefore(from, to, animationDuration);
    FlipperContainer.classList.toggle('rotate');
    makeFlipperHiddenAfter(to, animationDuration);
  }
  function changeFlipperFromTo (from, to, animationDuration) {

    makeFlipperHiddenBefore(from, to, animationDuration);
  }

  function flipperHandler () {

    if(menuWrapper.classList.contains('hidden')) {
      
      drawFlipper();
      void(FlipperContainerWrapper.offsetHeight);
      changeFlipperFromTo(mainSlide, menuWrapper, 800);
    } else {
      changeFlipperFromTo(menuWrapper, mainSlide, 800);
      /*makeFlipperHiddenBefore(menuWrapper);
      FlipperContainer.classList.toggle('rotate');
      makeFlipperHiddenAfter(mainSlide, 1000);*/
    }
  }

  function sliderHandler (handler) {

    body.removeEventListener('click', handler);

    if(slide2.classList.contains('hidden')) {
      drawSlider(slide1, slide2);

      slide2.classList.toggle('hidden');
      makeSliderHiddenBefore(slide1);

      SliderContainer.classList.toggle('rotate');

      window.setTimeout(()=>{
        
        SliderContainerWrapper.classList.toggle('sliderContainerWrapperHidden');
        void(SliderContainerWrapper.offsetHeight);
      }, 350);
      
    } else {
      
      SliderContainerWrapper.classList.toggle('sliderContainerWrapperHidden');
      void(SliderContainerWrapper.offsetHeight);

      SliderContainer.classList.toggle('rotate');

      window.setTimeout(()=>{
        
        SliderContainerWrapper.classList.toggle('sliderContainerWrapperHidden');
        slide1.classList.toggle('hidden');
        slide2.classList.toggle('hidden');
        
        //addBodyClickListener();
      }, 500);

    }
  }

  //addBodyClickListener ();  

  //FULLSCREEN SLIDER/////////////////

  //SCROLL ANGLE HANDLER//
  let windowHeight = document.documentElement.clientHeight,
    angleContainer = document.querySelector(".main > .slide2 .angleContainer"),
    angle = 0,
    scrollAngleHandlerticking = false,
    scrollAngleHandlertickingTimeOut = false;

  GlobalVarObj.angle = 0;

  function scrollAngleHandler (e) {
    if (!scrollAngleHandlerticking) {
      //console.log("SCROLL");
      scrollAngleHandlerticking = true;
      if (angleContainer.getBoundingClientRect().top/windowHeight > 0.15) {
        window.clearTimeout(scrollAngleHandlertickingTimeOut);
        scrollAngleHandlertickingTimeOut = window.setTimeout(function() {
            !cube3dOn ? cube3dStart() : false;
          },800);

        setAngle();
      } else {
        window.clearTimeout(scrollAngleHandlertickingTimeOut);
        scrollAngleHandlertickingTimeOut = window.setTimeout(function() {
          cube3dOn ? cube3dStop() : false;
        },800);

        scrollAngleHandlerticking = false;
      }
    }
  }  
  function setAngle () {
    GlobalVarObj.angle = (angleContainer.getBoundingClientRect().top - windowHeight/2)/windowHeight/2*-100;
    if (GlobalVarObj.angle > -10 && GlobalVarObj.angle <= -0.5) {
      if (angleContainer.classList.contains('angle0')) {
        window.requestAnimationFrame(function(){
          setAngleAnimationOUT();
          angleContainer.classList.remove('angle0');
          angleContainer.style.transform = "rotate(" + Math.round(GlobalVarObj.angle) + "deg) scale(1.2)";
          scrollAngleHandlerticking = false;
        });
      } else {
        window.requestAnimationFrame(function(){
          angleContainer.style.transform = "rotate(" + Math.round(GlobalVarObj.angle) + "deg) scale(1.2)";
          scrollAngleHandlerticking = false;
        });
      }
    } else {
        if (GlobalVarObj.angle > -0.5) {
          if (!angleContainer.classList.contains('angle0')) {
            window.requestAnimationFrame(function(){
              setAngleAnimationIN();
              angleContainer.classList.add('angle0');
              scrollAngleHandlerticking = false;
            });
          }
          scrollAngleHandlerticking = false;
        } else {
          if (angleContainer.classList.contains('angle0')) {
            window.requestAnimationFrame(function(){
              setAngleAnimationOUT();
              angleContainer.classList.remove('angle0');
              angleContainer.style.transform = "rotate(-10deg) scale(1.2)";
              scrollAngleHandlerticking = false;
            });
          } else {
            window.requestAnimationFrame(function(){
              angleContainer.style.transform = "rotate(-10deg) scale(1.2)";
              scrollAngleHandlerticking = false;
            });
          }
        }
    }

  }

  function scrollAngleHandler2 (e) {
    if (!scrollAngleHandlerticking) {
        window.requestAnimationFrame(function() {
          console.log("SCROLLreq");
          if (angleContainer.getBoundingClientRect().top/windowHeight > 0.15) {
            window.clearTimeout(scrollAngleHandlertickingTimeOut);
            scrollAngleHandlertickingTimeOut = window.setTimeout(function() {
              //console.log('ON  --', cube3dOn);
              !cube3dOn ? cube3dStart() : false;
            },800);
            setAngle();

          } else {
            window.clearTimeout(scrollAngleHandlertickingTimeOut);
            scrollAngleHandlertickingTimeOut = window.setTimeout(function() {
              //console.log('OFF  --', cube3dOn);
              cube3dOn ? cube3dStop() : false;
            },800);
          }
          scrollAngleHandlerticking = false;
        });
        scrollAngleHandlerticking = true;
    }
  }
  function setAngle2 () {
    //console.log(angleContainer.getBoundingClientRect().top/windowHeight);
    angle = (angleContainer.getBoundingClientRect().top - windowHeight/2)/windowHeight/2*-100;
    ///console.log(angle, ' -- ', angle > -10 && angle < 0);
    if (angle > -10 && angle <= -0.5) {
      window.requestAnimationFrame(setAngleAnimationOUT);
      angleContainer.style.transform = "rotate(" + Math.round(angle) + "deg) scale(1.2)";
    } else {
      if (angle > -0.5) {
        if(!cube3dWrapper.classList.contains('translateUp')) {
          window.requestAnimationFrame(function(){
            setAngleAnimationIN(true);
          });
          angleContainer.style.transform = "rotate(" + 0 + "deg) scale(1)";
        }/* else {
          window.requestAnimationFrame(function(){
            setAngleAnimationIN(false);
          });
        }  */

      } else {
          window.requestAnimationFrame(setAngleAnimationOUT);
          angleContainer.style.transform = "rotate(-10deg) scale(1.2)";
      }
    }
  }
  function setAngleAnimationIN () {
    //if(cube3dMove) {
      cube3dWrapper.classList.add('translateUp');
      document.querySelector('.main > .slide2 .headerBGSpan').classList.add('headerBGSpanVisible');
      document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.add('translateUP');
      document.querySelector('.main > .slide2 .stackDescriptionWrapper').classList.add('translateUP');
    //}
  }
  function setAngleAnimationOUT () {
    cube3dWrapper.classList.remove('translateUp');
    document.querySelector('.main > .slide2 .headerBGSpan').classList.remove('headerBGSpanVisible');
    document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.remove('translateUP');
    document.querySelector('.main > .slide2 .stackDescriptionWrapper').classList.remove('translateUP');
  }
  function resizeAngleSection () {
    document.querySelector('.main > .slide2 .angleBGGradientAnimationLayer').classList.add('hidden');
    window.requestAnimationFrame(function(){
      document.querySelector('.main > .slide2 .angleBGGradientAnimationLayer').classList.remove('hidden');
      windowHeight = document.documentElement.clientHeight;
      scrollAngleHandler();
    });
  }
  function addScrollAngleHandler () {
    parallaxSection.addEventListener('scroll', scrollAngleHandler);
    window.addEventListener('resize', resizeAngleSection);
  }
  function removeScrollAngleHandler () {
    window.clearTimeout(scrollAngleHandlertickingTimeOut);
    parallaxSection.removeEventListener('scroll', scrollAngleHandler);
    window.removeEventListener('resize', resizeAngleSection);
  }
  

  //SCROLL ANGLE HANDLER/////////////////

  //BGVIDEO///
  /*var vid = document.getElementById("bgvid");
  var pauseButton = document.querySelector(".bgvidButton");

  if (window.matchMedia('(prefers-reduced-motion)').matches) {
      vid.removeAttribute("autoplay");
      vid.pause();
      pauseButton.innerHTML = "Paused";
  }

  function vidFade() {
    vid.classList.add("stopfade");
  }

  vid.addEventListener('ended', function()
  {
  // only functional if "loop" is removed 
  vid.pause();
  // to capture IE10
  vidFade();
  }); 


  pauseButton.addEventListener("click", function() {
    vid.classList.toggle("stopfade");
    if (vid.paused) {
      vid.play();
      pauseButton.innerHTML = "Pause";
    } else {
      vid.pause();
      pauseButton.innerHTML = "Paused";
    }
  })*/
  //BGVIDEO////////////////////

  ////CUBE/////

  /* Twisty thing - more cross browser - in CSS/JS by dehash.com released under MIT License https://opensource.org/licenses/MIT */

// Update - working on making it cross browser, faster, using fewer resources, and running on the GPU in all browsers & devices  -
// as a result of the updates this example now works in IE10 and iPad, & much faster in Firefox, about the same in chrome - more tweaks to do -

// A very useful pen for IE10 CSS 3D - https://codepen.io/thebabydino/details/bdvya

//Note: for iPad & touch screens view click Share then Full Page

// work in progress - just playing around to try to get some interesting effects - drag over the image it should twist around in some sort of css3d space - should work in chrome and FF not sure about ie - seen similar ideas for displaying graphics many times but i think one of the best was an old flash one by yugop.com but I cannot find it online anymore and it has been done many times since.
  var self = window;
  
    let cube3dOn = false,
      cube3dPause = false,
      touchEnabled,
      md = false,
      raf,
      mouseX = 0,
      gap = 0,
      slow = 7,
      oldMouseX = 0,
      numLevels = 12,
      gaps = [],
      gapscnt = 0,
      vx = [],
      px = [],
      styles = [],
      cube3dContainer = document.querySelector('.main > .slide2 #cube3d-CubeContainer'),
      cube3dWrapper = document.querySelector('.main > .slide2 #cube3d-Wrapper'),
      lev = 5,
      currentLevel = 0,//Math.round(lev/2),
      text = 'MiroslavPetrov',
      cube3dPauseTimer = false;

    function cube3dInit() {
        //cube3dOn = true;
        addCube3dListeners();
        draw();
        onResizeHandler();
        
    }
    cube3dInit();

    function cube3dStart () {
        cube3dOn = true;
        cube3dPause = false;
        if(cube3dWrapper.classList.contains('hidden')) {
          cube3dWrapper.classList.toggle('hidden');
        }
        onResizeHandler();
        addCube3dListeners();
        md = true;
        mouseX = 500;
        loop();
        setTimeout(()=>{md = false; mouseX = 0;},200);
        cube3dWrapper.style.opacity = 0.99;
        cube3dPauseTimerSet();
        document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.add('hidden');
        //console.log('CUBESTART');
    }

    function cube3dStop () {
      cube3dOn = false;
      removeCube3dListeners();
      cube3dWrapper.style.opacity = 0;
      setTimeout(()=>{cube3dWrapper.classList.toggle('hidden');},300);
      cube3dPauseTimerStop();
      document.querySelector('.main > .slide2 .cube3dLoadingWrapper').classList.remove('hidden');
      //console.log('CUBESTOP');
    }



    function cube3dPauseTimerSet () {
      cube3dPauseTimer = window.setTimeout(function(){
        cube3dPause = true;
      },5000);
    }

    function cube3dPauseTimerStop () {
      window.clearTimeout(cube3dPauseTimer);
    }


    function addCube3dListeners() {
      touchEnabled = 'ontouchstart' in window || navigator.msMaxTouchPoints;
        if (touchEnabled == true) {
          //console.log("touchEnabled");
          cube3dContainer.addEventListener('touchmove', onTouchMove, false);
          cube3dContainer.addEventListener('touchstart', onTouchStart, false);
          document.addEventListener('touchend', onTouchEnd, false);
        } else {
          //console.log("mouseEnabled");
          cube3dContainer.addEventListener('mousemove', onMouseMove, false);
          cube3dContainer.addEventListener('mousedown', onMouseDown, false);
          document.addEventListener('mouseup', onMouseUp, false);
        }
        addEventListener('resize', onResizeHandler, false);
      
        //cube3dContainer.addEventListener('mousedown', setCube3dLevelListener, false);
    }
    function removeCube3dListeners() {
      touchEnabled = 'ontouchstart' in window || navigator.msMaxTouchPoints;
        if (touchEnabled == true) {
          cube3dContainer.removeEventListener('touchmove', onTouchMove, false);
          cube3dContainer.removeEventListener('touchstart', onTouchStart, false);
          document.removeEventListener('touchend', onTouchEnd, false);
        } else {
          cube3dContainer.removeEventListener('mousemove', onMouseMove, false);
          cube3dContainer.removeEventListener('mousedown', onMouseDown, false);
          document.removeEventListener('mouseup', onMouseUp, false);
        }
        removeEventListener('resize', onResizeHandler, false);
        //cube3dContainer.removeEventListener('mousedown', setCube3dLevelListener, false);
    }

    function draw() {
      cube3dContainer.innerHTML = null;
      for (var i = 1; i < lev + 1; i++) {
        cube3dContainer.insertAdjacentHTML('beforeend', '<div id="cube3d-level' + i + '" class="cube3d-level"></div>');
      }

      for (let i = Math.ceil(lev/2); i < lev + 1; i++) {
        document.querySelector('#cube3d-level' + i).style["z-index"] = lev + 1 - i;
      
      }

      for (let i = 1; i < lev+1; i++) {
        
        document.querySelectorAll('#cube3d-level' + i).forEach((el) => {
          el.innerHTML = null;
          //el.insertAdjacentHTML('afterbegin', '<div class="cube3d-front cube3d-side"></div><div class="cube3d-back cube3d-side"></div><div class="cube3d-left cube3d-side"></div><div class="cube3d-right cube3d-side"></div><div class="cube3d-top cube3d-side"></div><div class="cube3d-bottom cube3d-side"></div>');
          el.insertAdjacentHTML('afterbegin', 
            '<div class="cube3d-front cube3d-side"></div>'+
            '<div class="cube3d-back cube3d-side"></div>'+
            '<div class="cube3d-left cube3d-side"></div>'+
            '<div class="cube3d-right cube3d-side"></div>'+
            '<div class="cube3d-top cube3d-side"></div>'+
            '<div class="cube3d-bottom cube3d-side"></div>');
        });

      }
      
      for (var i = 1; i < lev + 1; i++) {

        document.querySelectorAll('#cube3d-level' + i + '> div').forEach((el) => {
          
          if (!el.classList.contains('cube3d-top') && !el.classList.contains('cube3d-bottom')) {
            el.innerHTML = null;
            el.insertAdjacentHTML('beforeend', '<div id="' + i + '" class="cube3d-divForClick"></div>');
            
            for (let j = 0; j < 2; j++) {
              el.insertAdjacentHTML('beforeend', '<p class="cube3d-text cube3d-text' + j + '">' + text + '</p>');
            }
          }
        });
      }

      

      for (var i = 0; i < numLevels ; i++) {
          vx.push(0);
          px.push(1);
        }
    }

    function setCube3dLevelListener(e) {        
      currentLevel = e.target.id;
    }

    function loop() {
        if (!cube3dPause && cube3dOn) {
          update();
          render();
          raf = requestAnimFrame(loop);
          //console.log("LOOP");
        }
    }

    function update() {
        if (md) {
          gap = averageGaps(mouseX - oldMouseX);
          oldMouseX = mouseX;
        }
        gap *= .93//.97;
        px[currentLevel] += gap;
        for (let i = 1; i < numLevels - 1; i++) {
          if (i != currentLevel) {
              var ax = (px[i + 1] + px[i - 1] - px[i] / 0.5) / 10; //var ax = (px[i + 1] + px[i - 1] - px[i] / 0.5) / 11;
              vx[i] = (vx[i] + ax) / 1.25;
              px[i] += vx[i];
          }
        }
        px[0] = px[1];
        px[numLevels - 1] = px[numLevels - 2];

    }

    function render() {
        for (var i = 1; i < lev +1; i++) {
          for (var j = 0; j < 4; j++) {
              //document.querySelector('.main > .slide2 #cube3d-level' + i).style.transform = "rotateY(" + px[i] + "deg) translateY(calc(" + cube3dWrapper.clientWidth + "px * 0.4 / " + lev + "))";
            document.querySelector('.main > .slide2 #cube3d-level' + i)
            .style.transform = "rotateY(" + px[i] + "deg) translateY(" + cube3dWrapper.clientWidth * 0.4 / lev + "px)";
          };
        }
    }

    function onResizeHandler() {
      let cube3dWrapperWidth = cube3dWrapper.clientWidth;

      //cube3dContainer.style.transform = "translateY(calc(-" + cube3dWrapperWidth + "px * 0.8 / " + lev + " / 2))";
      //cube3dContainer.style.top = "calc(" + cube3dWrapperWidth + "px * 0.8 / 5 / 2)";
      
      /*for (let i = 1; i < lev+1; i++) {
        document.querySelectorAll('.main > .slide2 #cube3d-level' + i).forEach((el) => {
            el.style.top = "calc(" + cube3dWrapperWidth + "px * 0.8 / 50)";
        });
      }*/

      document.querySelectorAll('.main > .slide2 .cube3d-front').forEach((el) => {
          //el.style.transform = "translateZ(calc(" + cube3dWrapperWidth + "px * 0.8 / 2))";
        el.style.transform = "translateZ(" + cube3dWrapperWidth * 0.8 / 2 +"px)";
      });

      document.querySelectorAll('.main > .slide2 .cube3d-back').forEach((el) => {
          el.style.transform = "translateZ(-" + cube3dWrapperWidth  * 0.8 / 2 + "px) rotateY(180deg)";
      });
      
      document.querySelectorAll('.main > .slide2 .cube3d-left').forEach((el) => {
          el.style.transform = "translateX(-" + cube3dWrapperWidth  * 0.8 / 2 + "px) rotateY(-90deg)";
      });
      document.querySelectorAll('.main > .slide2 .cube3d-right').forEach((el) => {
          el.style.transform = "translateX(" + cube3dWrapperWidth  * 0.8 / 2 + "px) rotateY(90deg)";
      });
      document.querySelectorAll('.main > .slide2 .cube3d-top').forEach((el) => {
          el.style.transform = "translateY(-" + cube3dWrapperWidth * 0.8 / 2 + "px) rotateX(90deg)";
          el.style.height = cube3dWrapperWidth * 0.8 + "px";
      });   
      document.querySelectorAll('.main > .slide2 .cube3d-bottom').forEach((el) => {
          el.style.transform = "translateY(-" + cube3dWrapperWidth * 0.8 * 0.3 + "px) rotateX(-90deg)";
          el.style.height = cube3dWrapperWidth * 0.8 + "px";
      });
      document.querySelectorAll('.main > .slide2 .cube3d-side p').forEach((el) => {
          el.style.fontSize = cube3dWrapperWidth * 0.8 / lev * 1.31 + "px";
      });
      document.querySelectorAll('.main > .slide2 .cube3d-front .cube3d-text0, .main > .slide2 .cube3d-back .cube3d-text0').forEach((el) => {
          //el.style.top = "calc(-" + cube3dWrapperWidth + "px * 0.08)";
          //el.style.transform = "translateY(calc(-" + cube3dWrapperWidth + "px * 0.08))";
          el.style.transform = "translateY(" + cube3dWrapperWidth * -0.12 +"px)";
      });
      document.querySelectorAll('.main > .slide2 .cube3d-front .cube3d-text1, .main > .slide2 .cube3d-back .cube3d-text1').forEach((el) => {
          //el.style.top = "calc(" + cube3dWrapperWidth + "px * 0.08)";
          //el.style.transform = "translateY(calc(" + cube3dWrapperWidth + "px * 0.08))";
          el.style.transform = "translateY(" + cube3dWrapperWidth * 0.04 +"px)";
      });
      document.querySelectorAll('.main > .slide2 .cube3d-left .cube3d-text0, .main > .slide2 .cube3d-right .cube3d-text0').forEach((el) => {
          //el.style.top = "calc(-" + cube3dWrapperWidth + "px * 0.08)";
          //el.style.transform = "translateY(calc(-" + cube3dWrapperWidth + "px * 0.08))";
          el.style.transform = "translateY(" + cube3dWrapperWidth * -0.12 +"px) translateX(-50%)";
      });
      document.querySelectorAll('.main > .slide2 .cube3d-right .cube3d-text1, .main > .slide2 .cube3d-left .cube3d-text1').forEach((el) => {
          //el.style.top = "calc(" + cube3dWrapperWidth + "px * 0.08)";
          //el.style.transform = "translateY(calc(" + cube3dWrapperWidth + "px * 0.08))";
          el.style.transform = "translateY(" + cube3dWrapperWidth * 0.04 +"px) translateX(-50%)";
      });
    };

    function onMouseMove(event) {
        if (md) {
          event.preventDefault();
          mouseX = event.clientX;
        }
    }

    function onMouseDown(event) {
        event.preventDefault();
        if(cube3dPause) {
          cube3dPause = false;
          loop();
        }
        gaps.length = 0;
        md = true;
        if (event.target.id > 0) {
          currentLevel = event.target.id;
        } else {
          currentLevel = Math.round(lev/2);
        }
        cube3dPauseTimerStop();
    }

    function onMouseUp(event) {
        if (md) {
          event.preventDefault();
          md = false;
        }
        cube3dPauseTimerSet();
    }

    function onTouchMove(event) {
        //event.preventDefault();
        if (md) {
          var touch = event.touches[0];
          mouseX = touch.pageX;
      }
      
    }

    function onTouchStart(event) {
        //event.preventDefault();
        if(cube3dPause) {
          cube3dPause = false;
          loop();
        }
        gaps.length = 0;
        md = true;
        if (event.target.id > 0) {
          currentLevel = event.target.id;
        } else {
          currentLevel = Math.round(lev/2);
        }
        cube3dPauseTimerStop();
    }

    function onTouchEnd(event) {
        //event.preventDefault();
        if (md) {
          md = false;
        }
        cube3dPauseTimerSet();
    }

    function averageGaps(n) {
        if (isNaN(n)) {
          return 0;
        }
        let gl = gaps.length;
        gaps[gapscnt] = n;
        let ave = 0;
        for (var i = 0; i < gl; i++) {
          ave += gaps[i];
        };
        gapscnt = (gapscnt + 1) % 10;
        let tmp = ave / gl*0.8;
        if (isNaN(tmp)) {
          tmp = 0;
        }
        return tmp;
    }
    window.requestAnimFrame = function () {
      return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
          window.setTimeout(callback, 1000 / FPS);
      };
    }();
      //window.addEventListener ? window.addEventListener('load', cube3dInit, false) : window.onload = cube3dInit;
    
  ////CUBE/////////////////////////

  ///SERTIFICATION GALLERY///

  var initPhotoSwipeFromDOM = function(gallerySelector) {

      // parse slide data (url, title, size ...) from DOM elements 
      // (children of gallerySelector)
      var parseThumbnailElements = function(el) {
          var thumbElements = el.childNodes,
              numNodes = thumbElements.length,
              items = [],
              figureEl,
              linkEl,
              size,
              item;

          for(var i = 0; i < numNodes; i++) {

              figureEl = thumbElements[i]; // <figure> element

              // include only element nodes 
              if(figureEl.nodeType !== 1) {
                  continue;
              }

              linkEl = figureEl.children[0]; // <a> element

              size = linkEl.getAttribute('data-size').split('x');

              // create slide object
              item = {
                  src: linkEl.getAttribute('href'),
                  w: parseInt(size[0], 10),
                  h: parseInt(size[1], 10)
              };



              if(figureEl.children.length > 1) {
                  // <figcaption> content
                  item.title = figureEl.children[1].innerHTML; 
              }

              if(linkEl.children.length > 0) {
                  // <img> thumbnail element, retrieving thumbnail url
                  item.msrc = linkEl.children[0].getAttribute('src');
              } 

              item.el = figureEl; // save link to element for getThumbBoundsFn

              item.certificateLink = '';
              let metaArr = figureEl.getElementsByTagName("META");
              for (let i = 0; i < metaArr.length; i++) {
                if(metaArr[i].attributes.itemprop.nodeValue == 'isBasedOn') {
                  item.certificateLink = metaArr[i].attributes.content.nodeValue;
                  break;
                }
              }
              
              items.push(item);
          }

          return items;
      };

      // find nearest parent element
      var closest = function closest(el, fn) {
          return el && ( fn(el) ? el : closest(el.parentNode, fn) );
      };

      // triggers when user clicks on thumbnail
      var onThumbnailsClick = function(e) {
          e = e || window.event;
          e.preventDefault ? e.preventDefault() : e.returnValue = false;

          var eTarget = e.target || e.srcElement;

          // find root element of slide
          var clickedListItem = closest(eTarget, function(el) {
              return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
          });

          if(!clickedListItem) {
              return;
          }

          // find index of clicked item by looping through all child nodes
          // alternatively, you may define index via data- attribute
          var clickedGallery = clickedListItem.parentNode,
              childNodes = clickedListItem.parentNode.childNodes,
              numChildNodes = childNodes.length,
              nodeIndex = 0,
              index;

          for (var i = 0; i < numChildNodes; i++) {
              if(childNodes[i].nodeType !== 1) { 
                  continue; 
              }

              if(childNodes[i] === clickedListItem) {
                  index = nodeIndex;
                  break;
              }
              nodeIndex++;
          }



          if(index >= 0) {
              // open PhotoSwipe if valid index found
              openPhotoSwipe( index, clickedGallery );
          }
          return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      var photoswipeParseHash = function() {
          var hash = window.location.hash.substring(1),
          params = {};

          if(hash.length < 5) {
              return params;
          }

          var vars = hash.split('&');
          for (var i = 0; i < vars.length; i++) {
              if(!vars[i]) {
                  continue;
              }
              var pair = vars[i].split('=');  
              if(pair.length < 2) {
                  continue;
              }           
              params[pair[0]] = pair[1];
          }

          if(params.gid) {
              params.gid = parseInt(params.gid, 10);
          }

          return params;
      };

      var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
          var pswpElement = document.querySelectorAll('.pswp')[0],
              gallery,
              options,
              items;

          items = parseThumbnailElements(galleryElement);

          // define options (if needed)
          options = {

              // define gallery index (for URL)
              galleryUID: galleryElement.getAttribute('data-pswp-uid'),

              getThumbBoundsFn: function(index) {
                  // See Options -> getThumbBoundsFn section of documentation for more info
                  var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                      pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                      rect = thumbnail.getBoundingClientRect(); 

                  return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
              },


              bgOpacity: 0.9,
              spacing: 0.12,
              history: false
          };

          // PhotoSwipe opened from URL
          if(fromURL) {
              if(options.galleryPIDs) {
                  // parse real index when custom PIDs are used 
                  // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                  for(var j = 0; j < items.length; j++) {
                      if(items[j].pid == index) {
                          options.index = j;
                          break;
                      }
                  }
              } else {
                  // in URL indexes start from 1
                  options.index = parseInt(index, 10) - 1;
              }
          } else {
              options.index = parseInt(index, 10);
          }

          // exit if index not found
          if( isNaN(options.index) ) {
              return;
          }

          if(disableAnimation) {
              options.showAnimationDuration = 0;
          }

          // Pass data to PhotoSwipe and initialize it
          gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
          
          gallery.listen('beforeChange', function() { 
            document.querySelectorAll('.freeCodeCampLink a')[0].attributes.href.value = gallery.currItem.certificateLink;
          });

          gallery.init();
      };

      // loop through all gallery elements and bind events
      var galleryElements = document.querySelectorAll( gallerySelector );

      for(var i = 0, l = galleryElements.length; i < l; i++) {
          galleryElements[i].setAttribute('data-pswp-uid', i+1);
          galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if(hashData.pid && hashData.gid) {
          openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
      }

    

  };
  // execute above function
  document.querySelectorAll('.main > .slide2 .certificates figure a').forEach(function(el){
    el.addEventListener('click', function() {
      initPhotoSwipeFromDOM('.main > .slide2 .certificates');
    });
  });

  ///SERTIFICATION GALLERY///////////
}

const Preloader = {
  delayBeforeStarted: 100,
  bottomCubeAnimationDuration: 500,
  topCubesAnimationDuration: 1000,
  bottomCubeIsSlideUp: false,
  isStart: false,
  readyToSlideOut: false,
  isHidden: false,
  startHadler: function () {
              document.getElementById("preloaderWrapper").classList.add('start');
              window.scrollTo(0,0);
              document.querySelector('.main').style.display = 'block';
              document.getElementById("preloaderWrapper").classList.remove('bgLikePreloader');
              window.setTimeout(function(){
                Preloader.readyToSlideOut = true;
              }, Preloader.topCubesAnimationDuration);
            },
  slideOutHandler: function () {
    document.getElementById("preloaderWrapper").classList.add('end');
    document.querySelector('.topWrapper .left.cube').style.boxShadow = '0px calc(-30vh * 0.333) calc(30vh * 0.667) rgba(0,0,0,.5), calc(30vh * 0.25) 0px calc(30vh * 0.167) rgba(0,0,0,.5)';
    document.querySelector('.main').style.opacity = 1;
    Preloader.hidden();

    //lazyLoadAndReplaceHiBgImage();
  },
  checkBottomCubeIsSlideUp: function () {
    if (Preloader.bottomCubeIsSlideUp) {
      if (!Preloader.isStart) {
        window.clearTimeout(Preloader.preloaderStartHandlerTimeout);
        Preloader.startHadler();
        Preloader.checkReadyToSlideOut();
      } else {
        Preloader.checkReadyToSlideOut();
      }
    } else {
      window.setTimeout(Preloader.checkBottomCubeIsSlideUp ,200);
    }
  },
  checkReadyToSlideOut: function () {
    if (Preloader.readyToSlideOut) {
      window.requestAnimationFrame(Preloader.slideOutHandler);
    } else {
      window.setTimeout(Preloader.checkReadyToSlideOut ,200);
    }
  },
  hidden: function () {
    window.setTimeout(
      function () {
        window.requestAnimationFrame(function(){
          document.getElementById("preloaderWrapper").style.display = 'none'
          document.querySelector('.main').style.overflow = 'unset';
          document.querySelector('html').style.position = 'static';
          document.querySelector("body").classList.remove('bgLikePreloader');
          document.querySelector('.main > .slide2 .parallax').classList.toggle('hidden');
          Preloader.isHidden = true;
        });
        window.setTimeout(function() {
          document.querySelector('.main > .slide2 .parallax').scrollTop = 0;
        },200);
      }, Preloader.bottomCubeAnimationDuration+200
    );
  },
  start: () => {
          document.getElementById("preloaderWrapper").classList.remove('hidden');
          window.setTimeout(function(){
            window.requestAnimationFrame(function(){
                document.getElementById("preloaderWrapper").classList.remove('beforeStart');
                window.setTimeout(function(){
                  Preloader.bottomCubeIsSlideUp = true;
                  Preloader.preloaderStartHandlerTimeout = window.setTimeout(function(){
                     Preloader.isStart = true;
                     Preloader.startHadler();
                  }, 2500);     
                }, Preloader.bottomCubeAnimationDuration+100);
            });
          }, Preloader.delayBeforeStarted);
        },
  end: () => {
          Preloader.checkBottomCubeIsSlideUp();
          window.requestAnimationFrame(function(){
            lazyLoadAndReplaceHiBgImage();

            addVideoSource(document.querySelector('#bgvid'), sourcesBGVideo);
            addVideoSource(document.querySelector('#rainVideo'), sourcesRainVideo);
          });
        }
}
let sourcesBGVideo = [
  { src: 'img/polina.webm',
    type: 'video/webm'
  },
  { src: 'img/polina.mp4',
    type: 'video/mp4'
  }
];
let sourcesRainVideo = [
  { src: 'https://www.w3schools.com/howto/rain.mp4',
    type: 'video/mp4'
  }
];
function addVideoSource(video, sources) {
  for (let i = 0; i < sources.length; i++) {
    let bgvidSource = document.createElement('source');
    for (attr in sources[i]) {
      bgvidSource.setAttribute(attr, sources[i][attr]);
    }
    video.appendChild(bgvidSource);
    //bgvidSource.setAttribute(, 'img/polina.ogg');
    //bgvidSource.setAttribute('type', 'video/ogg');
    //document.querySelector('#bgvid').appendChild(bgvidSource);
  }
}
function lazyLoadAndReplaceHiBgImage () {
  let lazyImageBg = document.createElement('img');
  lazyImageBg.setAttribute('src', './img/img.JPG');
  lazyImageBg.classList.add("lazyImageBg");
  document.querySelector('.hi-background-image').appendChild(lazyImageBg);
  document.querySelector('.hi-background-image .lazyImageBg').onload = ()=>{
    document.querySelectorAll('.hi-background-image').forEach(function(el){
      window.requestAnimationFrame(function() {
        el.classList.add('lazy-hi-background-image');
      });
    });
    document.querySelector('.hi-background-image').removeChild(document.querySelector('.hi-background-image .lazyImageBg'));
  };
}
  
window.onload = Preloader.end;