'use strict';
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
let Kraken = new ReleaseTheKraken;

export { Certification };

class Certification {
	constructor (State, ClientDevice) {
		this.state = State;
		this.state.certificatesResize = this.resize.bind(this);
		this.state.displayCurrentCertInFlipper = this.displayCurrentCertInFlipper.bind(this);

		this.clientDevice = ClientDevice;
		this.clientDevice.windowResizeHandlersQueue.resizeCertificates = this.resize.bind(this);

		this.certificationCarousel = null;
		this.certificates = null;

		this.certsLength = 0;
		this.certificatesScrollMax = 0;
		this.certificatesScrollWidth = 0;
		this.scrollStepValue = 0;
		this.certificatesRECT = null;

		this.md = false;
		this.ticking = false;
		this.mouseMoveValue = 0;
		this.startMousePosition = 0;
		this.oldScrollLeft = 0;
		this.lastScrollStep = 0;
		this.currentCert = 0;
		this.rAFid = null;
		this.scrollValue = 0;


		this.setScrollValueBind = this.setScrollValue.bind(this);

		this.certificatesOnMouseDownBind = this.certificatesOnMouseDown.bind(this);
		this.certificatesOnMouseMoveBind = this.certificatesOnMouseMove.bind(this);
		this.certificatesOnMouseUpBind = this.certificatesOnMouseUp.bind(this);
		this.certificatesOnMouseOutBind = this.certificatesOnMouseOut.bind(this);
		this.certificatesOnTouchstartBind = this.certificatesOnTouchstart.bind(this);
		this.certificatesOnTouchEndBind = this.certificatesOnTouchEnd.bind(this);
		this.certificatesOnScrollBind = this.certificatesOnScroll.bind(this);
		this.photoswipeHandlerBind = this.photoswipeHandler.bind(this);
	}

	rAF (f) {
		let nextRenderFunc = f;
		let nextRAF = function(func) {
			window.requestAnimationFrame(func.bind(this));
		};
		this.rAFid = window.requestAnimationFrame(nextRAF.bind(this, nextRenderFunc));
		nextRenderFunc = null;
		nextRAF = null;
	}
	
	init() {
		this.certificationCarousel = document.querySelector('.certification__framed-certificate .certification__carousel');//УТОЧНИТЬ
		this.certificates = this.certificationCarousel.querySelector('.certification__certificates');
		this.certsLength = this.certificates.children.length;	

		if (this.state.deviceIsTouchscreen) {
			this.certificates.classList.add('certification__certificates_mobile-view');
			this.addCertificatesMouseDownListener();
		} else {
			this.certificates.classList.add('certification__certificates_desktop-view');
			this.addCertificatesMouseDownListener();
		}
		this.initPhotoSwipeFromDOM('.certification__certificates');
	}

	addCertificatesMouseDownListener () {
		if (this.state.deviceIsTouchscreen) {
			this.certificationCarousel.addEventListener('touchstart', this.certificatesOnTouchstartBind, this.passiveListener);
		} else {
			this.certificationCarousel.addEventListener('mousedown', this.certificatesOnMouseDownBind, false);
		}
	}
	addCertificatesScrollListener () {
		this.certificates.addEventListener('scroll', this.certificatesOnScrollBind, this.passiveListener);
	}
	removeCertificatesScrollListener () {
		this.certificates.removeEventListener('scroll', this.certificatesOnScrollBind, this.passiveListener);
	}
	addCertificatesSwipeListeners () {
		this.certificationCarousel.addEventListener('mousemove', this.certificatesOnMouseMoveBind, false);
		this.certificationCarousel.addEventListener('mouseout', this.certificatesOnMouseOutBind, false);
		document.addEventListener('mouseup', this.certificatesOnMouseUpBind, false);
	}
	removeCertificatesSwipeListeners () {
		this.certificationCarousel.removeEventListener('mousemove', this.certificatesOnMouseMoveBind, false);
		this.certificationCarousel.removeEventListener('mouseout', this.certificatesOnMouseOutBind, false);
		document.removeEventListener('mouseup', this.certificatesOnMouseUpBind, false);
	}
	addCertificatesTouchEndListener () {
		document.addEventListener('touchend', this.certificatesOnTouchEndBind, this.passiveListener);
	}
	removeCertificatesTouchEndListener () {
		document.removeEventListener('touchend', this.certificatesOnTouchEndBind, this.passiveListener);
	}

	certificatesOnMouseDown (e) {
		e.preventDefault();
		this.addCertificatesSwipeListeners();
		
		this.md = true;
		this.mm = false;
		
		this.oldMousePosition = this.getMousePositionInFrame(e);
		this.startMousePosition = this.oldMousePosition;
		this.oldScrollLeft = this.lastScrollStep;
		this.certificates.classList.remove('certification__certificates_ease');
	}
	certificatesOnMouseMove (e) {
		if(this.md) {
			if (!this.ticking) {
				this.ticking = true;

				let newMousePosition = this.getMousePositionInFrame(e);

				this.mouseMoveValue = this.oldMousePosition - newMousePosition;
				this.oldMousePosition = newMousePosition;
				let newScrollLeft = this.oldScrollLeft - this.mouseMoveValue;
				if (newScrollLeft <= 0+this.certificationCarouselRECT.width && newScrollLeft >= this.certificatesScrollMax-this.certificationCarouselRECT.width) {
					this.oldScrollLeft = newScrollLeft;
					this.setCertScrollLeftInNextRaf(this.oldScrollLeft);
				} else {
					this.ticking = false;
				}
			}
			this.mm = true;
		}
	}
	certificatesOnMouseUp (e) {
		this.removeCertificatesSwipeListeners();
		if (this.md) {
			this.scrollSnap(e);
		}
	}
	certificatesOnMouseOut (e) {
		this.removeCertificatesSwipeListeners();
		this.scrollSnap(e);
	}

	certificatesOnTouchstart (e) {
		this.mm = false;
		this.addCertificatesScrollListener();
		this.addCertificatesTouchEndListener();
	}
	certificatesOnTouchEnd (e) {
		this.removeCertificatesTouchEndListener();
		this.removeCertificatesScrollListener();
	}


	scrollSnap (e) {
		window.cancelAnimationFrame(this.rAFid);
		let scrollValue = this.startMousePosition - (this.getMousePositionInFrame(e));
		if (Math.abs(scrollValue) > this.certificationCarouselRECT.width * 0.505) {
			if (scrollValue < 0) {
				if (this.currentCert - 1 >= 0) {
					this.currentCert--;
					this.lastScrollStep = this.getCurrentScrollStepPX();
				}
			} else {
				if (this.currentCert + 1 < this.certsLength) {
					this.currentCert++;
					this.lastScrollStep = this.getCurrentScrollStepPX();
				}
			}

			this.oldScrollLeft = this.lastScrollStep;
			this.rAF(this.scrollToCurrentCert);
		} else {
			this.rAF(this.scrollToCurrentCert);
		}

		this.certificates.classList.add('certification__certificates_ease');
		this.md = false;
	}

	getMousePositionInFrame (e) {
		let mousePosition = e.clientX - this.certificationCarouselRECT.left;
		if (mousePosition < 0) {
			return 0;
		} else {
			if (mousePosition - this.certificationCarouselRECT.width > 0) {
				return this.certificationCarouselRECT.width;
			} else {
				return mousePosition;
			}
		}
		return e.clientX - this.certificationCarouselRECT.left;
	}

	setCertScrollLeftInNextRaf (scrollValue) {
		this.scrollValue = scrollValue;
		/*this.rAF(this.setScrollValue);*/
		window.requestAnimationFrame(this.setScrollValueBind);
	}

	setScrollValue () {
		this.certificates.style.transform = 'translateX(' + this.scrollValue + 'px) translateZ(0)';
		this.ticking = false;
	}
	scrollToCurrentCert () {
		this.certificates.style.transform = 'translateX(-' + (100 / this.certsLength) * this.currentCert + '%) translateZ(0)';
		this.ticking = false;
	}

	getCurrentScrollStepPX () {
		return (-this.certificatesRECT.width / this.certsLength) * this.currentCert;
	}

	certificatesOnScroll () {
		this.mm = true;
		let newScrollLeft = this.certificates.scrollLeft;
		console.log('this.scrollValue--', this.scrollValue, '--newScrollLeft--', newScrollLeft);
		if (this.scrollValue == newScrollLeft) {
			this.currentCert = Math.round(this.scrollValue / this.scrollStepValue);
			console.log('CURRCERT---', this.currentCert);
			document.getElementById('log').innerHTML = document.getElementById('log').innerHTML+'<br>'+'CURRCERT---' + this.currentCert;
		} else {
			this.scrollValue = this.certificates.scrollLeft;
			this.rAF(this.certificatesOnScroll);
		}
	}

	displayCurrentCert (index) {
		if (this.state.deviceIsTouchscreen) {
			// this.scrollStepValue = (this.certificatesScrollWidth - this.certificatesRECT.width) / (this.certsLength - 1);
			this.certificates.scrollLeft = this.scrollStepValue * index;
			console.log('displayCurrentCert', this.scrollStepValue * index);
		} else {
			this.currentCert = index;
			this.lastScrollStep = this.getCurrentScrollStepPX();
			this.certificates.style.transform = 'translateX(-' + (100 / this.certsLength) * this.currentCert + '%) translateZ(0)';
		}
	}

	resize () {
		if (this.state.deviceIsTouchscreen) {
			this.certificatesScrollWidth = this.certificates.scrollWidth;
			this.certificatesRECT = this.certificates.getBoundingClientRect();
			this.scrollStepValue = (this.certificatesScrollWidth - this.certificatesRECT.width) / (this.certsLength - 1);

			this.certificates.classList.add('hidden');
			this.certificates.style['scroll-behavior'] = 'unset';
			window.requestAnimationFrame(()=>{
				this.certificates.classList.remove('hidden');
				this.certificates.scrollLeft = Math.round(this.scrollStepValue * this.currentCert);
				this.rAF(this.setScrollBehaviorSmooth);
				/*this.rAF(this.waitScrollCurCert);*/
			});
			document.getElementById('log').innerHTML = document.getElementById('log').innerHTML+'<br>'+'resize---WIDTH--' + this.certificatesScrollWidth+' scrollStepValue--'+this.scrollStepValue;
		} else {
			this.certificationCarouselRECT = this.certificationCarousel.getBoundingClientRect();
			this.certificatesRECT = this.certificates.getBoundingClientRect();
			this.scrollStepValue = this.certificatesRECT.width / this.certsLength;
			this.certificatesScrollMax = -(this.certificatesRECT.width - this.scrollStepValue);
			this.lastScrollStep = (-this.certificatesRECT.width / this.certsLength) * this.currentCert;
		}
	}

	waitScrollCurCert () {
		document.getElementById('log').innerHTML = document.getElementById('log').innerHTML+'<br>'+ 'WAIT---'+Math.round(this.scrollStepValue * this.currentCert)+ ' CURRCERT---'+ this.currentCert+ ' SCROLL---'+ this.certificates.scrollLeft;
		if (this.certificates.scrollLeft > (this.scrollStepValue * this.currentCert)-5 && this.certificates.scrollLeft < (this.scrollStepValue * this.currentCert)+5) {

		} else {
			this.certificates.scrollLeft = this.scrollStepValue * this.currentCert;
			this.rAF(this.waitScrollCurCert);
		}
	}

	displayCurrentCertInFlipper (el) {
		if (this.state.deviceIsTouchscreen) {
			el.scrollLeft = this.scrollStepValue * this.currentCert;
			console.log('displayCurrentCert', this.scrollStepValue * this.currentCert);
		} else {
			this.certificates.style.transform = 'translateX(-' + (100 / this.certsLength) * this.currentCert + '%) translateZ(0)';
		}
	}

	setScrollBehaviorSmooth () {
		this.certificates.style['scroll-behavior'] = 'smooth';
	}


 	///SERTIFICATION GALLERY///
	initPhotoSwipeFromDOM (gallerySelector) {
			let thisObj = this;
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
      	if (!thisObj.mm) {
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
              thisObj.certificates.classList.add('opacity0');
              openPhotoSwipe(index, clickedGallery, false, false, thisObj);
          }
          return false;
      	}
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
      let thisObjRef = this;
      var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL, thisObjRef) {
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
                  let rect = thisObjRef.certificationCarousel.getBoundingClientRect();
                  return {x:rect.left, y:rect.top, w:rect.width};
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
            thisObjRef.displayCurrentCert(gallery.getCurrentIndex());
          });
          gallery.listen('close', function() {
          	thisObjRef.certificates.classList.remove('opacity0');
          	thisObjRef.certificates.classList.add('certification__certificates_opacity-delay');
          });
          gallery.listen('destroy', function() {
          	thisObjRef.certificates.classList.remove('certification__certificates_opacity-delay');
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
          openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true, thisObjRef);
      }
  };
  // execute above function
  addCertificatesClickListener () {
  	let anchors = this.certificates.querySelectorAll('a');
		for (let i = 0; i < anchors.length; i++) {
			anchors[i].addEventListener('click', this.photoswipeHandlerBind);
		}
  }
  photoswipeHandler (e) {console.log("CLICK");
  	e.preventDefault();
  	this.initPhotoSwipeFromDOM(this.certificates, this);
  }
  ///SERTIFICATION GALLERY///////////
}