'use strict';
console.log('%c Хотите чтобы я стал частью вашей команды? Пожалуйста, напишите – @.ru \n Обнаружили ошибку? \n English MotherFucker! ', 'background-color: #65ff2d; color: #2f2f2f; font-family: arial; font-weight: 900; font-size: 3vmin; padding: 1px 0px;');
import { State as StateModule } from "./state.js";
import { Errors as ErrorsModule } from "./errors.js";
import { ClientDevice as ClientDeviceModule } from "./clientDevice.js";
import { ReleaseTheKraken } from "../test/ReleaseTheKraken.js";
import { Preloader as PreloaderModule } from "./preloader.js";
import { LazyLoader as LazyLoaderModule } from "./lazyLoader.js";
import { HiBgImageTransform as HiBgImageTransformModule } from "./hiBgImageTransform.js";
import { FullscreenSlider as FullscreenSliderModule } from "./fullscreenSlider.js";
import { Menu as MenuModule } from "./menu.js";
import { ParallaxScroll as ParallaxScrollModule } from "./parallaxScroll.js";
import { Cube3d as Cube3dModule } from "./cube3d.js";
import { Certification as CertificationModule } from "./certification.js";
import { Portfolio as PortfolioModule } from "./portfolio.js";
import { Form as FormModule } from "./form.js";
import { Bubbles as BubblesModule } from "./bubbles.js";

const State = new StateModule();
State.init();
const Errors = new ErrorsModule(State);
Errors.init();
const ClientDevice = new ClientDeviceModule(State);
ClientDevice.init();
let Kraken = new ReleaseTheKraken(),
    HiBgImageTransform = new HiBgImageTransformModule(State),
    FullscreenSlider = new FullscreenSliderModule(State),
    Menu = new MenuModule(State),
    ParallaxScroll = new ParallaxScrollModule(State, ClientDevice),
    Cube3d = new Cube3dModule(State, ClientDevice),
    Certification = new CertificationModule(State, ClientDevice),
    Portfolio = new PortfolioModule(State),
    Form = new FormModule(State),
    Bubbles = new BubblesModule(State, ClientDevice);
  







const DOMContentLoaded = function (state) {
  document.removeEventListener('DOMContentLoaded', DOMContentLoaded);
  
  let Preloader = new PreloaderModule(State);
  Preloader.run();
  Preloader = null;


};
const WindowLoaded = function () {
  window.removeEventListener('load', WindowLoaded);

  let LazyLoader = new LazyLoaderModule(State);
  LazyLoader.init();

  
  HiBgImageTransform.init();
  FullscreenSlider.init();
  Menu.init();
  ParallaxScroll.init();
  Cube3d.init();
  Certification.init();
  Portfolio.init();
  Form.init();
  Bubbles.init();
};


(function () {
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
})();
(function DOMready(fn) {
  if (document.readyState != 'loading'){
    DOMContentLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', DOMContentLoaded);
  }
})();
(function WindowReady(fn) {
  window.addEventListener('load', WindowLoaded);
})();
(function(){
  window.addEventListener('unload', ()=>{
    document.getElementById('parallax__scrollable-container').scrollTop = 0;
  });
})();