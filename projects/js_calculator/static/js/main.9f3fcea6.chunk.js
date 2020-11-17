(this["webpackJsonpjs-calculator"]=this["webpackJsonpjs-calculator"]||[]).push([[0],{14:function(e,r,t){},15:function(e,r,t){},16:function(e,r,t){"use strict";t.r(r);var a=t(0),s=t(2),i=t.n(s),c=t(4),n=t.n(c),l=(t(14),t(5)),o=t(6),d=t(1),u=t(8),j=t(7);t(15);var b=function(e){Object(u.a)(t,e);var r=Object(j.a)(t);function t(e){var a;return Object(l.a)(this,t),(a=r.call(this,e)).state={sum:0,input:"",output:0,operator:"",error:!1},a.digitsHeadler=a.digitsHeadler.bind(Object(d.a)(a)),a.serviceHeadler=a.serviceHeadler.bind(Object(d.a)(a)),a.operatorsHeadler=a.operatorsHeadler.bind(Object(d.a)(a)),a.errorHandler=a.errorHandler.bind(Object(d.a)(a)),a}return Object(o.a)(t,[{key:"serviceHeadler",value:function(e){var r=e.currentTarget.id,t=this.state.input,a=this.state.sum;switch(r){case"AC":""===t||"0"===t?a=0:t=0;break;case"+/-":""===t?a*=-1:t*=-1;break;case"%":""===t||"+"!==this.state.operator&&"-"!==this.state.operator?t/=100:t*=a/100;break;default:return this.errorHandler()}this.setState({sum:a,input:t,error:!1})}},{key:"operatorsHeadler",value:function(e){var r=this.state.operator,t=""===this.state.input?r="":+this.state.input,a=this.state.sum;switch(r){case"\xf7":a=10*a/(10*t);break;case"\xd7":a=10*a*(10*t)/100;break;case"-":a=(10*a-10*t)/10;break;case"+":a=(10*a+10*t)/10;break;case"=":a=t;break;default:a=""===t?a:t}if(Number.isNaN(a)||!isFinite(a))return this.errorHandler();this.setState({operator:e.currentTarget.id,sum:a,input:"",error:!1})}},{key:"errorHandler",value:function(){this.setState({sum:0,input:"",output:0,operator:"",error:!0})}},{key:"digitsHeadler",value:function(e){var r=this.state.input.toString(),t=e.currentTarget.id.toString(),a=-1!==r.indexOf(".");"."===t&&""===r&&(r="0"),"."===t&&a&&(t=""),"0"===r&&"."!==t&&(r=""),(9===r.length&&!a||r.length>9)&&(t=""),this.setState({input:(r+t).toString(),error:!1})}},{key:"render",value:function(){return Object(a.jsxs)("section",{className:"calculator",children:[Object(a.jsx)(h,{sum:this.state.sum,input:this.state.input,error:this.state.error}),Object(a.jsx)(v,{serviceHeadler:this.serviceHeadler,operatorsHeadler:this.operatorsHeadler,digitsHeadler:this.digitsHeadler})]})}}]),t}(i.a.Component);function h(e){var r;if(!e.error){var t=(r=""===e.input?e.sum.toString():e.input.toString()).length,s=r.indexOf(".");if(t>9&&(-1===s||s>9||-1!==r.indexOf("e"))){r=function(e){var t=1;return e.length>10&&(e=function e(a){return a.length<=10?a:e((+r).toExponential(8-a.indexOf(".")-++t))}(e)),e}((+r).toExponential(6))}else t>10&&(r=(+r).toFixed(9-s));r=function(e){if(-1!==e.indexOf("e"))return e;for(var r=e.indexOf("."),t=e.split(""),a=-1===r?[]:t.splice(r),s=[],i=t.reverse().length-1;i>=0;i--)s.push(t[i]),i>0&&i%3===0&&s.push(" ");return s.concat(a).join("")}(r)}return Object(a.jsx)("div",{className:"display",children:void 0!==r?r:"Error"})}function v(e){return Object(a.jsxs)("div",{className:"keyboard",children:[Object(a.jsx)(p,{serviceHeadler:e.serviceHeadler}),Object(a.jsx)(O,{operatorsHeadler:e.operatorsHeadler}),Object(a.jsx)(k,{digitsHeadler:e.digitsHeadler})]})}function p(e){var r="keyboard__key_service";return Object(a.jsxs)("div",{className:"keyboard_section keyboard__service",children:[Object(a.jsx)(x,{id:"AC",value:"AC",class:r,clickHandler:e.serviceHeadler}),Object(a.jsx)(x,{id:"+/-",value:"+/-",class:r,clickHandler:e.serviceHeadler}),Object(a.jsx)(x,{id:"%",value:"%",class:r,clickHandler:e.serviceHeadler})]})}function O(e){var r="keyboard__key_operator";return Object(a.jsxs)("div",{className:"keyboard_section keyboard__operators",children:[Object(a.jsx)(x,{id:"\xf7",value:"\xf7",class:r,clickHandler:e.operatorsHeadler}),Object(a.jsx)(x,{id:"\xd7",value:"\xd7",class:r,clickHandler:e.operatorsHeadler}),Object(a.jsx)(x,{id:"-",value:"-",class:r,clickHandler:e.operatorsHeadler}),Object(a.jsx)(x,{id:"+",value:"+",class:r,clickHandler:e.operatorsHeadler}),Object(a.jsx)(x,{id:"=",value:"=",class:r,clickHandler:e.operatorsHeadler})]})}function k(e){for(var r=[7,8,9,4,5,6,1,2,3,0,"."],t=[],s=0;s<=10;s++)t.push(Object(a.jsx)(x,{id:r[s],value:r[s],class:0===r[s]?"keyboard__key_double":"",clickHandler:e.digitsHeadler},s));return Object(a.jsx)("div",{className:"keyboard_section keyboard__digits",children:t})}function x(e){return Object(a.jsxs)("button",{id:e.id,className:e.class?"keyboard__key "+e.class:"keyboard__key",onClick:e.clickHandler,children:[Object(a.jsx)("div",{className:0!==e.value?"keyboard__highlight":" keyboard__doubleHighlight"}),Object(a.jsx)("span",{className:"keyboard__value",children:e.value})]})}function H(){return Object(a.jsx)("footer",{children:Object(a.jsxs)("a",{className:"footer__link",href:"https://www.instagram.com/miroslavpetrov_/",target:"_blank",rel:"noopener noreferrer",children:[Object(a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512",style:{verticalAlign:"middle",width:16},children:[Object(a.jsx)("path",{d:"M256 49c67 0 75 1 102 2 24 1 38 5 47 9a78 78 0 0129 18 78 78 0 0118 29c4 9 8 23 9 47 1 27 2 35 2 102l-2 102c-1 24-5 38-9 47a83 83 0 01-47 47c-9 4-23 8-47 9-27 1-35 2-102 2l-102-2c-24-1-38-5-47-9a78 78 0 01-29-18 78 78 0 01-18-29c-4-9-8-23-9-47-1-27-2-35-2-102l2-102c1-24 5-38 9-47a78 78 0 0118-29 78 78 0 0129-18c9-4 23-8 47-9 27-1 35-2 102-2m0-45c-68 0-77 0-104 2-27 1-45 5-61 11a123 123 0 00-45 29 123 123 0 00-29 45c-6 16-10 34-11 61-2 27-2 36-2 104l2 104c1 27 5 45 11 61a123 123 0 0029 45 123 123 0 0045 29c16 6 34 10 61 11a1796 1796 0 00208 0c27-1 45-5 61-11a129 129 0 0074-74c6-16 10-34 11-61 2-27 2-36 2-104l-2-104c-1-27-5-45-11-61a123 123 0 00-29-45 123 123 0 00-45-29c-16-6-34-10-61-11-27-2-36-2-104-2z"}),Object(a.jsx)("path",{d:"M256 127a129 129 0 10129 129 129 129 0 00-129-129zm0 213a84 84 0 1184-84 84 84 0 01-84 84z"}),Object(a.jsx)("circle",{cx:"390.5",cy:"121.5",r:"30.2"})]})," Miroslav Petrov"]})})}var f=function(){return Object(a.jsxs)("div",{className:"App",children:[Object(a.jsx)("main",{children:Object(a.jsx)(b,{})}),Object(a.jsx)(H,{})]})},g=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,17)).then((function(r){var t=r.getCLS,a=r.getFID,s=r.getFCP,i=r.getLCP,c=r.getTTFB;t(e),a(e),s(e),i(e),c(e)}))};n.a.render(Object(a.jsx)(i.a.StrictMode,{children:Object(a.jsx)(f,{})}),document.getElementById("root")),g()}},[[16,1,2]]]);
//# sourceMappingURL=main.9f3fcea6.chunk.js.map