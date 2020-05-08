'use strict';
//ЕСЛИ В ПЕРЕМЕННАЯ = ДОМэлемент - то при удалении из ДОМ удалить и ПЕРЕМЕННУЮ!!!
// В конце тела функции удалять ссылки на объекты
// Все ссылки и ФУНКЦИИ внутри Timeout должны завершаться!
// Все ссылки на объекты снаружи, из функций внутри Timeout в конце УДАЛИТЬ
// Module pattern with cached functions:
                            /*
                            document.addEventListener('click', f1);
                            function f1() {
                              f2();
                            }
                            function f2() {
                              function f3(index) {
                                var f4 = f3.bind(this, arg);
                                window.requestAnimationFrame(f4);
                              }
                              var f4 = f3.bind(this, arg);
                              window.requestAnimationFrame(f4);
                            }*/

                            /////////////////////////////
                            /////////////////////////////
                            /////////////////////////////
                            /*var FooFunction = function () {

                              }
                              var BarFunction = function () {

                              }
                              const Klass3 = function () {
                                return {
                                  foo: FooFunction,
                                  bar: BarFunction
                                }
                              }*/
                              ///aaaa: new Array(10000000).join('X');
export { ReleaseTheKraken };

class ReleaseTheKraken {
  constructor () {
    this._TESTtotalTime = null;
    this._TESTstart = null;
  }

  timerStart () {
    this._TESTstart = new Date;
    return;
  }

  timerStop () {
    this._TESTtotalTime = new Date - this._TESTstart;
    console.log('Kraken TIMER: ', this._TESTtotalTime);
  }

  str () {
    return new Array(20000000).join('X');
  }

  count (label) {
    let i = 0,
        start = Date.now();
    if (!label) {
      label = ' ';
    }

    console.log("Kraken count Start", '--', label);
    for (let j = 0; j < 400000000; j++) {
      i++;
    }
    console.log("Kraken count DONE " + (Date.now() - start) + ' ms', '---------------------', label);
  }

  fass (target) {
    /*let test = document.querySelector('.test');
    let fr = document.createDocumentFragment();
    function* gen (N) {
      for (let i = 0; i < N; i+=1) {
        yield document.createElement('div');
      }
    }
    for (let el of gen (100000)) {
      fr.appendChild(el);
    }
    test.appendChild(fr);
    fr = null;
    let f = function() {
      document.querySelector('.test').remove();

      test = null;
      console.log('Kraken FASS');
    };
    window.setTimeout(f, 1000);*/
    let fragment;
    for (let i = 0, fr = document.createDocumentFragment(); i < 200000; i++) {
      let div = document.createElement('div');
      fr.appendChild(div);
      div = null;
      if (i+1 === 200000) {
        fragment = fr;
        fr = null;
      }
    }
    target.appendChild(fragment);
    fragment = null;
    target = null;
  } 
}

//export default ReleaseTheKraken;
