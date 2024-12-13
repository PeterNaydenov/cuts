!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).cuts=t()}(this,(function(){"use strict";var e={_normalizeWithPlugins:function(e,t){return function(e){const n=t.shortcuts;Object.keys(n).forEach((t=>{Object.entries(n[t]).forEach((([r,o])=>{const s=e(r);s!==r&&(delete n[t][r],n[t][s]=o)}))}))}},_readShortcutWithPlugins:function(e,t){return function(n){const{inAPI:r}=e,o=n.split(":")[0],s=r._systemAction(o,"none");let i=n;return-1!==s&&(i=t.plugins[s].shortcutName(n)),i}},_systemAction:function(e,t){return function(e,n,r=null){return t.plugins.findIndex((t=>t.getPrefix()===e&&(t[n]&&t[n](r),!0)))}},changeContext:function(e,t){const{shortcuts:n,currentContext:r}=t,{ev:o}=e;return function(e=!1){const s=r.name;if(!e)return o.reset(),void(r.name=null);s!==e&&(n[e]?(n[s]&&o.reset(),r.name=e,t.plugins.forEach((t=>t.contextChange(e))),Object.entries(n[e]).forEach((([e,t])=>{t.forEach((t=>o.on(e,t)))})),o.on("*",((...e)=>{t.exposeShortcut&&t.exposeShortcut(...e)}))):o.emit("@shortcuts-error",`Context '${e}' does not exist`))}},listShortcuts:function(e,t){const n=t.shortcuts;return function(e=null){if(null!=e){let t=n[e];return null==t?null:Object.entries(t).map((([e,t])=>e))}return Object.keys(n).map((e=>{let t={};return t.context=e,t.shortcuts=Object.entries(n[e]).map((([e,t])=>e)),t}))}},load:function(e,t){const{shortcuts:n,plugins:r}=t,{API:{changeContext:o,getContext:s}}=e;return function(e){const t=s(),i=r.map((e=>e.getPrefix().toUpperCase()));let c=!1;Object.entries(e).forEach((([e,o])=>{e===t&&(c=!0),n[e]={},Object.entries(o).forEach((([t,o])=>{let s=t,c=t.toUpperCase().trim(),u=i.map(((e,t)=>c.startsWith(e)?t:null)).filter((e=>null!==e));if(u.length){let e=u[0];s=r[e].shortcutName(t)}o instanceof Function&&(o=[o]),n[e][s]=o}))})),c&&(o(),o(t))}},unload:function(e,t){const{currentContext:n,shortcuts:r}=t,{ev:o}=e;return function(e){n.name!==e?r[e]?delete r[e]:o.emit("shortcuts-error",`Context '${e}' does not exist`):o.emit("shortcuts-error",`Context '${e}' can't be removed during is current active context. Change the context first`)}}};function t(e){const t=e.toUpperCase(),n=/KEY\s*\:/i.test(t),r=t.indexOf(":");return n?`KEY:${t.slice(r+1).split(",").map((e=>e.trim())).map((e=>e.split("+").map((e=>e.trim())).sort().join("+"))).join(",")}`:e}function n(e,t){let{shiftKey:n,altKey:r,ctrlKey:o}=e,s=e.code.replace("Key","").replace("Digit",""),i=[];return o&&i.push("CTRL"),n&&i.push("SHIFT"),r&&i.push("ALT"),t.hasOwnProperty(s)?i.push(t[s].toUpperCase()):["ControlLeft","ControlRight","ShiftLeft","ShiftRight","AltLeft","AltRight","Meta"].includes(s)||i.push(s.toUpperCase()),i.sort()}function r(e,t){let n=0;const{regex:r}=e,{listenOptions:o,currentContext:{name:s},shortcuts:i}=t;return null==s?0:(Object.entries(i[s]).forEach((([e,t])=>{if(!r.test(e))return;n++;let s=e.slice(4).split(",").length;o.maxSequence<s&&(o.maxSequence=s)})),n)}function o(){return{ArrowLeft:"LEFT",ArrowUp:"UP",ArrowRight:"RIGHT",ArrowDown:"DOWN",Enter:"ENTER",NumpadEnter:"ENTER",Escape:"ESC",Backspace:"BACKSPACE",Space:"SPACE",Tab:"TAB",Backquote:"`",BracketLeft:"[",BracketRight:"]",Equal:"=",Slash:"/",Backslash:"\\",IntlBackslash:"`",F1:"F1",F2:"F2",F3:"F3",F4:"F4",F5:"F5",F6:"F6",F7:"F7",F8:"F8",F9:"F9",F10:"F10",F11:"F11",F12:"F12"}}function s(e,t,n){const{listenOptions:{clickTarget:r}}=t;let o=n;return o===document||o===document.body?null:o.dataset[r]||"A"===o.nodeName?o:s(e,t,o.parentNode)}function i(e){const t=e.toUpperCase(),n=/CLICK\s*\:/i.test(t),r=["LEFT","MIDDLE","RIGHT"],o=["ALT","SHIFT","CTRL"];let s=null,i=[],c=0,u=t.indexOf(":");return n?(t.slice(u+1).trim().split("-").map((e=>e.trim())).forEach((e=>{r.includes(e)?s=e:o.includes(e)?i.push(e):isNaN(e)||(c=e)})),`CLICK:${s}-${c}${i.length>0?"-":""}${i.sort().join("-")}`):e}function c(e,t){let{shiftKey:n,altKey:r,ctrlKey:o,key:s,button:i}=e,c=`CLICK:${["LEFT","MIDDLE","RIGHT"][i]}-${t}`,u=[];return o&&u.push("CTRL"),n&&u.push("SHIFT"),r&&u.push("ALT"),u.length>0?`${c}${u.length>0?"-":""}${u.sort().join("-")}`:`${c}`}function u(e,t){let n=0;const{regex:r}=e,{listenOptions:o,currentContext:{name:s},shortcuts:i}=t;return null==s?0:(Object.entries(i[s]).forEach((([e,t])=>{if(!r.test(e))return;n++;let[,s]=e.slice(6).split("-");o.maxClicks<s&&(o.maxClicks=s)})),n)}function l(t={}){const n=new function(){let e={"*":[]},t={},n=[],r=!1,o="";return{on:function(t,n){e[t]||(e[t]=[]),e[t].push(n)},once:function(e,n){"*"!==e&&(t[e]||(t[e]=[]),t[e].push(n))},off:function(n,r){if(r)return e[n]&&(e[n]=e[n].filter((e=>e!==r))),t[n]&&(t[n]=t[n].filter((e=>e!==r))),e[n]&&0===e[n].length&&delete e[n],void(t[n]&&0===t[n].length&&delete e[n]);t[n]&&delete t[n],e[n]&&delete e[n]},reset:function(){e={"*":[]},t={},n=[]},emit:function(){const[s,...i]=arguments;function c(t){let r=!1;"*"!==t&&(n.includes(t)||(e[t].every((e=>{const t=e(...i);return"string"!=typeof t||"STOP"!==t.toUpperCase()||(r=!0,!1)})),r||e["*"].forEach((e=>e(s,...i)))))}if(r&&(console.log(`${o} Event "${s}" was triggered.`),i.length>0&&(console.log("Arguments:"),console.log(...i),console.log("^----"))),"*"!==s){if(t[s]){if(n.includes(s))return;t[s].forEach((e=>e(...i))),delete t[s]}e[s]&&c(s)}else Object.keys(e).forEach((e=>c(e)))},stop:function(r){if("*"!==r)n.push(r);else{const r=Object.keys(e),o=Object.keys(t);n=[...o,...r]}},start:function(e){n="*"!==e?n.filter((t=>e!=t)):[]},debug:function(e,t){r=!!e,t&&"string"==typeof t&&(o=t)}}},r={},o={},s={currentContext:{name:null,note:null},shortcuts:{},plugins:[],exposeShortcut:!(!t.onShortcut||"function"!=typeof t.onShortcut)&&t.onShortcut},i={ev:n,inAPI:r,API:o,extra:{}};return o.enablePlugin=(e,t={})=>{const n=e.name;if(-1===r._systemAction(n,"none")){let n;n=e(i,s,t),s.plugins.push(n)}},o.disablePlugin=e=>{const t=r._systemAction(e,"destroy");-1!==t&&(s.plugins=s.plugins.filter(((e,n)=>n!==t)))},o.mutePlugin=e=>r._systemAction(e,"mute"),o.unmutePlugin=e=>r._systemAction(e,"unmute"),o.getContext=()=>s.currentContext.name,o.getNote=()=>s.currentContext.note,o.setNote=(e=null)=>{"string"!=typeof e&&null!=e||(s.currentContext.note=e)},o.pause=(e="*")=>{let t=r._readShortcutWithPlugins(e);n.stop(t)},o.resume=(e="*")=>{const t=r._readShortcutWithPlugins(e);n.start(t)},o.emit=(e,...t)=>n.emit(r._readShortcutWithPlugins(e),...t),o.listContexts=()=>Object.keys(s.shortcuts),o.setDependencies=e=>i.extra={...i.extra,...e},o.getDependencies=()=>i.extra,Object.entries(e).forEach((([e,t])=>{e.startsWith("_")?r[e]=t(i,s):o[e]=t(i,s)})),o}var a=Object.freeze({__proto__:null,pluginClick:function(e,t,n){let{currentContext:r,shortcuts:o}=t,{inAPI:l}=e,a={ev:e.ev,_findTarget:s,_readClickEvent:c,mainDependencies:e,regex:/CLICK\s*\:/i},p={currentContext:r,shortcuts:o,listenOptions:{mouseWait:n.mouseWait?n.mouseWait:320,maxClicks:1,clickTarget:n.clickTarget?n.clickTarget:"click"}};l._normalizeWithPlugins(i);let f=function(e,t){const{ev:n,_findTarget:r,_readClickEvent:o,mainDependencies:s}=e,{listenOptions:i,currentContext:c}=t,{mouseWait:u}=i;let l=null,a=null,p=null,f=null,d=0;function m(){const e=o(a,d),t={target:l,targetProps:l?l.getBoundingClientRect():null,x:a.clientX,y:a.clientY,context:c.name,note:c.note,event:a,dependencies:s.extra,type:"click"};n.emit(e,t),p=null,f=null,l=null,a=null,d=0}function h(n){let o=i.maxClicks;return clearTimeout(p),f?(clearTimeout(f),void(f=setTimeout((()=>f=null),u))):(l=r(e,t,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(o=1),l&&"A"===l.tagName&&(o=1),a=n,d++,d>=o?(m(),void(o>1&&(f=setTimeout((()=>f=null),u)))):void(p=setTimeout(m,u)))}function g(n){let o=i.maxClicks;return clearTimeout(p),f?(clearTimeout(f),void(f=setTimeout((()=>f=null),u))):(l=r(e,t,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(o=1),l&&"A"===l.tagName&&(o=1),a=n,d++,d>=o?(m(),void(o>1&&(f=setTimeout((()=>f=null),u)))):void(p=setTimeout(m,u)))}return{start:function(){t.active||(window.addEventListener("contextmenu",g),document.addEventListener("click",h),t.active=!0)},stop:function(){t.active&&(window.removeEventListener("contextmenu",g),document.removeEventListener("click",h),t.active=!1)}}}(a,p),d=u(a,p);d>0&&f.start();let m={getPrefix:()=>"click",shortcutName:e=>i(e),contextChange:()=>{d=u(a,p),d<1&&f.stop(),d>0&&f.start()},mute:()=>f.stop(),unmute:()=>f.start(),destroy:()=>{f.stop(),p=null,m=null}};return Object.freeze(m),m},pluginKey:function(e,s,i={}){let{currentContext:c,shortcuts:u,exposeShortcut:l}=s,{inAPI:a}=e,p={ev:e.ev,_specialChars:o,_readKeyEvent:n,mainDependencies:e,regex:/KEY\s*\:/i},f={currentContext:c,shortcuts:u,active:!1,listenOptions:{keyWait:i.keyWait?i.keyWait:480,maxSequence:1,keyIgnore:null},streamKeys:!(!i.streamKeys||"function"!=typeof i.streamKeys)&&i.streamKeys,exposeShortcut:l};a._normalizeWithPlugins(t);let d=function(e,t){const{ev:n,_specialChars:r,_readKeyEvent:o,mainDependencies:s}=e,{currentContext:i,streamKeys:c,listenOptions:u}=t,{keyWait:l}=u;let a=[],p=null,f=!0,d=!1;const m=()=>f=!1,h=()=>f=!0,g=()=>d=!0,y=()=>!1===f;function v(){let e=a.map((e=>[e.join("+")]));const t={wait:m,end:h,ignore:g,isWaiting:y,note:i.note,context:i.name,dependencies:s.extra,type:"key"};if(!f){let r=e.at(-1);n.emit(r,t),d&&(e=e.slice(0,-1),d=!1)}if(f){const r=`KEY:${e.join(",")}`;n.emit(r,t),a=[],p=null}}function x(t){if(clearTimeout(p),r.hasOwnProperty(t.code))return a.push(o(t,r)),c&&c({key:t.key,context:i.name,note:i.note,dependencies:e.extra}),u.keyIgnore?(clearTimeout(u.keyIgnore),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l))):f&&a.length===u.maxSequence?(v(),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l))):void(f?p=setTimeout(v,l):v())}function C(t){if(!r.hasOwnProperty(t.code)){if(clearTimeout(p),c&&c({key:t.key,context:i.name,note:i.note,dependencies:e.extra}),u.keyIgnore)return clearTimeout(u.keyIgnore),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l));if(a.push(o(t,r)),f&&a.length===u.maxSequence)return v(),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l));f?p=setTimeout(v,l):v()}}return{start:function(){t.active||(document.addEventListener("keydown",x),document.addEventListener("keypress",C),t.active=!0)},stop:function(){t.active&&(document.removeEventListener("keydown",x),document.removeEventListener("keypress",C),t.active=!1)}}}(p,f),m=r(p,f);m>0&&d.start();let h={getPrefix:()=>"key",shortcutName:e=>t(e),contextChange:e=>{m=r(p,f),m<1&&d.stop(),m>0&&d.start()},mute:()=>d.stop(),unmute:()=>d.start(),destroy:()=>{d.stop(),f=null,h=null}};return Object.freeze(h),h},shortcuts:l});function p(e){let t,n=!1;return e?(t=function(e){let t=e.map((e=>f())),n=t.map((e=>e.promise));return t.promises=n,t.onComplete=d(Promise.all(n)),t}(e),n=!0):t=f(),t.timeout=function(e,t){let n;n=e?Promise.all(t.promises):t.promise;return function(e,r){let o,s=new Promise(((t,s)=>{o=setTimeout((()=>{t(r),Promise.resolve(n)}),e)}));return n.then((()=>clearTimeout(o))),t.onComplete=d(Promise.race([n,s])),t}}(n,t),t}function f(){let e,t;const n=new Promise(((n,r)=>{e=n,t=r}));return{promise:n,done:e,cancel:t,onComplete:d(n)}}function d(e){return function(t){e.then((e=>t(e)))}}function m({message:e,level:t,type:n,logLevel:r}){if(0===r)return null;if(r<t)return null;const o=`[Debug]: ${e}`;switch(n){case"warn":console.warn(o);break;case"error":console.error(o);break;default:console.log(o)}return o}function h(e={},t=m){return function({message:n,type:r,level:o,...s}){const{level:i,type:c,defaultMessageLevel:u}=Object.assign({},{level:1e3,type:"log",defaultMessageLevel:1},e);return r||(r=c),o||(o=u),t({message:n,type:r,level:o,logLevel:i,...s})}}function*g(e,t,n,r){let o=null;if(null===e)return yield*r.map((e=>[e,"show"])),void(yield[n,"show"]);if(!r||0===r.length)return t?(yield[e,"hide"],t.reverse(),yield*t.map((e=>[e,"hide"])),void(yield[n,"show"])):(yield[e,"hide"],void(yield[n,"show"]));if(r.includes(e)){for(let t=r.indexOf(e)+1;t<r.length;t++)yield[r[t],"show"];yield[n,"show"]}else{if(!t)return yield[e,"hide"],void(yield*r.map((e=>[e,"show"])));if(r.every(((e,n)=>t[n]===r[n]&&(o=n,!0))),null==o)return yield[e,"hide"],t.reverse(),yield*t.map((e=>[e,"hide"])),yield*r.map((e=>[e,"show"])),void(yield[n,"show"]);yield[e,"hide"];for(let e=t.length;e>o+1;e--)yield[t[e-1],"hide"];for(let e=o+1;e<r.length;e++)yield[r[e],"show"];yield[n,"show"]}}function y(e){return function(t,...n){const{askForPromise:r,deps:o}=e;return function(){const e=r();return t({task:e,dependencies:o()},...n),e.promise}}}function v(e,t){return function(e){const{scenes:n,sceneNames:r}=t;if(!r.has(e))return null;const{show:o,hide:s,parents:i,...c}=n[e];return Object.keys(c)}}return p.sequence=function(e,...t){const n=p(),r=[];const o=function*(e){for(const t of e)yield t}(e);return function e(t,...s){t.done?n.done(r):t.value(...s).then((t=>{r.push(t),e(o.next(),...s,t)}))}(o.next(),...t),n},p.all=function(e,...t){const n=p(),r=[],o=e.map(((e,n)=>"function"==typeof e?e(...t).then((e=>r[n]=e)):e.then((e=>r[n]=e))));return Promise.all(o).then((()=>n.done(r))),n},function(e={logLevel:0}){const t=l(),n=h({level:e.logLevel||0}),r={currentScene:null,currentParents:null,sceneNames:new Set,scenes:{},opened:!1},o={},s={shortcutMngr:t,API:o,inAPI:{},findInstructions:g,askForPromise:p,setInstruction:y({askForPromise:p,deps:t.getDependencies}),log:n};return o.hide=function(e,t){return function(n=1){const{askForPromise:r,shortcutMngr:o,setInstruction:s}=e,{currentScene:i,currentParents:c,scenes:u}=t,l=r(),a=[],p=c.length>0;let f;return o.pause(),a.push(s(u[i].hide)),p||(t.currentScene=null),p&&"*"===n&&[...c].reverse().forEach((e=>{f=t.currentParents.pop(),t.currentScene=f,a.push(s(u[e].hide))})),p&&!["*",1].includes(n)&&c.slice("-"+(n-1)).reverse().map((e=>{f=t.currentParents.pop(),t.currentScene=f,a.push(s(u[e].hide))})),(n=r.sequence(a)).onComplete((()=>{o.changeContext(t.currentScene),l.done()})),l.promise}}(s,r),o.listShortcuts=v(0,r),o.listShortcuts=v(0,r),o.setScenes=function(e,t){return function(n){const{shortcutMngr:r}=e;n.forEach((({name:e,scene:n})=>{n.parents||(n.parents=[]),t.scenes[e]=n,t.sceneNames.add(e);const{show:o,hide:s,parents:i,...c}=n,u={};u[e]=c,r.load(u)}))}}(s,r),o.show=function(e,t){return function({scene:n,options:r={ssr:!1}},...o){const{shortcutMngr:s,askForPromise:i,log:c,findInstructions:u,setInstruction:l}=e,a=i(),{opened:p,scenes:f,sceneNames:d}=t;if(!d.has(n)&&c)return c({message:`Scene ${n} is not available.`,level:1,type:"error"}),a.done(),a.promise;if(!p&&r.ssr)return t.opened=!0,t.currentPage=n,s.changeContext(n),a.done(),a.promise;const{show:m,parents:h}=f[n];if("*"===h[0])return m().then((()=>a.done())),t.currentParents.push(t.currentPage),t.currentPage=n,a.promise;function g([e,n]){if("show"===n)t.currentScene&&t.currentParents.push(t.currentScene),t.currentScene=e;else{let e=t.currentParents.pop();t.currentScene=e}return f[e][n]}h.forEach((e=>d.has(e))),t.currentParents||(t.currentParents=[]);const y=u(t.currentScene,t.currentParents,n,h),v=[];for(let e of y)[e].map(g).map((e=>v.push(l(e),...o)));return i.sequence(v).onComplete((()=>{t.opened=!0,s.changeContext(n),a.done()})),a.promise}}(s,r),o.loadPlugins=async function(e){const t=e.map((e=>`plugin${e}`)),n=await Promise.resolve().then((function(){return a}));return t.map((e=>n[e]))},o.setDependencies=e=>t.setDependencies(e),o.getDependencies=()=>t.getDependencies(),o.setNote=e=>l.setNote(e),o.listScenes=()=>[...r.sceneNames],o.enablePlugin=(e,n)=>t.enablePlugin(e,n),o.disablePlugin=e=>t.disablePlugin(e),o.emit=(e,...n)=>t.emit(e,...n),o}}));
