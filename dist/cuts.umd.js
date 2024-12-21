!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).cuts=t()}(this,(function(){"use strict";var e={_normalizeWithPlugins:function(e,t){return function(e){const n=t.shortcuts;Object.keys(n).forEach((t=>{Object.entries(n[t]).forEach((([o,r])=>{const s=e(o);s!==o&&(delete n[t][o],n[t][s]=r)}))}))}},_readShortcutWithPlugins:function(e,t){return function(n){const{inAPI:o}=e,r=n.split(":")[0],s=o._systemAction(r,"none");let i=n;return-1!==s&&(i=t.plugins[s].shortcutName(n)),i}},_systemAction:function(e,t){return function(e,n,o=null){return t.plugins.findIndex((t=>t.getPrefix()===e&&(t[n]&&t[n](o),!0)))}},changeContext:function(e,t){const{shortcuts:n,currentContext:o}=t,{ev:r}=e;return function(e=!1){const s=o.name;if(!e)return r.reset(),void(o.name=null);s!==e&&(n[e]?(n[s]&&r.reset(),o.name=e,t.plugins.forEach((t=>t.contextChange(e))),Object.entries(n[e]).forEach((([e,t])=>{t.forEach((t=>r.on(e,t)))})),r.on("*",((...e)=>{t.exposeShortcut&&t.exposeShortcut(...e)}))):r.emit("@shortcuts-error",`Context '${e}' does not exist`))}},listShortcuts:function(e,t){const n=t.shortcuts;return function(e=null){if(null!=e){let t=n[e];return null==t?null:Object.entries(t).map((([e,t])=>e))}return Object.keys(n).map((e=>{let t={};return t.context=e,t.shortcuts=Object.entries(n[e]).map((([e,t])=>e)),t}))}},load:function(e,t){const{shortcuts:n,plugins:o}=t,{API:{changeContext:r,getContext:s}}=e;return function(e){const t=s(),i=o.map((e=>e.getPrefix().toUpperCase()));let c=!1;Object.entries(e).forEach((([e,r])=>{e===t&&(c=!0),n[e]={},Object.entries(r).forEach((([t,r])=>{let s=t,c=t.toUpperCase().trim(),u=i.map(((e,t)=>c.startsWith(e)?t:null)).filter((e=>null!==e));if(u.length){let e=u[0];s=o[e].shortcutName(t)}r instanceof Function&&(r=[r]),n[e][s]=r}))})),c&&(r(),r(t))}},unload:function(e,t){const{currentContext:n,shortcuts:o}=t,{ev:r}=e;return function(e){n.name!==e?o[e]?delete o[e]:r.emit("shortcuts-error",`Context '${e}' does not exist`):r.emit("shortcuts-error",`Context '${e}' can't be removed during is current active context. Change the context first`)}}};function t(e){const t=e.toUpperCase(),n=/KEY\s*\:/i.test(t),o=t.indexOf(":");return n?`KEY:${t.slice(o+1).split(",").map((e=>e.trim())).map((e=>e.split("+").map((e=>e.trim())).sort().join("+"))).join(",")}`:e}function n(e,t){let{shiftKey:n,altKey:o,ctrlKey:r}=e,s=e.code.replace("Key","").replace("Digit",""),i=[];return r&&i.push("CTRL"),n&&i.push("SHIFT"),o&&i.push("ALT"),t.hasOwnProperty(s)?i.push(t[s].toUpperCase()):["ControlLeft","ControlRight","ShiftLeft","ShiftRight","AltLeft","AltRight","Meta"].includes(s)||i.push(s.toUpperCase()),i.sort()}function o(e,t){let n=0;const{regex:o}=e,{listenOptions:r,currentContext:{name:s},shortcuts:i}=t;return null==s?0:(Object.entries(i[s]).forEach((([e,t])=>{if(!o.test(e))return;n++;let s=e.slice(4).split(",").length;r.maxSequence<s&&(r.maxSequence=s)})),n)}function r(){return{ArrowLeft:"LEFT",ArrowUp:"UP",ArrowRight:"RIGHT",ArrowDown:"DOWN",Enter:"ENTER",NumpadEnter:"ENTER",Escape:"ESC",Backspace:"BACKSPACE",Space:"SPACE",Tab:"TAB",Backquote:"`",BracketLeft:"[",BracketRight:"]",Equal:"=",Slash:"/",Backslash:"\\",IntlBackslash:"`",F1:"F1",F2:"F2",F3:"F3",F4:"F4",F5:"F5",F6:"F6",F7:"F7",F8:"F8",F9:"F9",F10:"F10",F11:"F11",F12:"F12"}}function s(e,t,n){const{listenOptions:{clickTarget:o}}=t;let r=n;return r===document||r===document.body?null:r.dataset[o]||"A"===r.nodeName?r:s(e,t,r.parentNode)}function i(e){const t=e.toUpperCase(),n=/CLICK\s*\:/i.test(t),o=["LEFT","MIDDLE","RIGHT"],r=["ALT","SHIFT","CTRL"];let s=null,i=[],c=0,u=t.indexOf(":");return n?(t.slice(u+1).trim().split("-").map((e=>e.trim())).forEach((e=>{o.includes(e)?s=e:r.includes(e)?i.push(e):isNaN(e)||(c=e)})),`CLICK:${s}-${c}${i.length>0?"-":""}${i.sort().join("-")}`):e}function c(e,t){let{shiftKey:n,altKey:o,ctrlKey:r,key:s,button:i}=e,c=`CLICK:${["LEFT","MIDDLE","RIGHT"][i]}-${t}`,u=[];return r&&u.push("CTRL"),n&&u.push("SHIFT"),o&&u.push("ALT"),u.length>0?`${c}${u.length>0?"-":""}${u.sort().join("-")}`:`${c}`}function u(e,t){let n=0;const{regex:o}=e,{listenOptions:r,currentContext:{name:s},shortcuts:i}=t;return null==s?0:(Object.entries(i[s]).forEach((([e,t])=>{if(!o.test(e))return;n++;let[,s]=e.slice(6).split("-");r.maxClicks<s&&(r.maxClicks=s)})),n)}function l(t={}){const n=new function(){let e={"*":[]},t={},n=[],o=!1,r="";return{on:function(t,n){e[t]||(e[t]=[]),e[t].push(n)},once:function(e,n){"*"!==e&&(t[e]||(t[e]=[]),t[e].push(n))},off:function(n,o){if(o)return e[n]&&(e[n]=e[n].filter((e=>e!==o))),t[n]&&(t[n]=t[n].filter((e=>e!==o))),e[n]&&0===e[n].length&&delete e[n],void(t[n]&&0===t[n].length&&delete e[n]);t[n]&&delete t[n],e[n]&&delete e[n]},reset:function(){e={"*":[]},t={},n=[]},emit:function(){const[s,...i]=arguments;function c(t){let o=!1;"*"!==t&&(n.includes(t)||(e[t].every((e=>{const t=e(...i);return"string"!=typeof t||"STOP"!==t.toUpperCase()||(o=!0,!1)})),o||e["*"].forEach((e=>e(s,...i)))))}if(o&&(console.log(`${r} Event "${s}" was triggered.`),i.length>0&&(console.log("Arguments:"),console.log(...i),console.log("^----"))),"*"!==s){if(t[s]){if(n.includes(s))return;t[s].forEach((e=>e(...i))),delete t[s]}e[s]&&c(s)}else Object.keys(e).forEach((e=>c(e)))},stop:function(o){if("*"!==o)n.push(o);else{const o=Object.keys(e),r=Object.keys(t);n=[...r,...o]}},start:function(e){n="*"!==e?n.filter((t=>e!=t)):[]},debug:function(e,t){o=!!e,t&&"string"==typeof t&&(r=t)}}},o={},r={},s={currentContext:{name:null,note:null},shortcuts:{},plugins:[],exposeShortcut:!(!t.onShortcut||"function"!=typeof t.onShortcut)&&t.onShortcut},i={ev:n,inAPI:o,API:r,extra:{}};return r.enablePlugin=(e,t={})=>{const n=e.name;if(-1===o._systemAction(n,"none")){let n;n=e(i,s,t),s.plugins.push(n)}},r.disablePlugin=e=>{const t=o._systemAction(e,"destroy");-1!==t&&(s.plugins=s.plugins.filter(((e,n)=>n!==t)))},r.mutePlugin=e=>o._systemAction(e,"mute"),r.unmutePlugin=e=>o._systemAction(e,"unmute"),r.getContext=()=>s.currentContext.name,r.getNote=()=>s.currentContext.note,r.setNote=(e=null)=>{"string"!=typeof e&&null!=e||(s.currentContext.note=e)},r.pause=(e="*")=>{let t=o._readShortcutWithPlugins(e);n.stop(t)},r.resume=(e="*")=>{const t=o._readShortcutWithPlugins(e);n.start(t)},r.emit=(e,...t)=>n.emit(o._readShortcutWithPlugins(e),...t),r.listContexts=()=>Object.keys(s.shortcuts),r.setDependencies=e=>i.extra={...i.extra,...e},r.getDependencies=()=>i.extra,Object.entries(e).forEach((([e,t])=>{e.startsWith("_")?o[e]=t(i,s):r[e]=t(i,s)})),r}var a=Object.freeze({__proto__:null,pluginClick:function(e,t,n){let{currentContext:o,shortcuts:r}=t,{inAPI:l}=e,a={ev:e.ev,_findTarget:s,_readClickEvent:c,mainDependencies:e,regex:/CLICK\s*\:/i},f={currentContext:o,shortcuts:r,listenOptions:{mouseWait:n.mouseWait?n.mouseWait:320,maxClicks:1,clickTarget:n.clickTarget?n.clickTarget:"click"}};l._normalizeWithPlugins(i);let d=function(e,t){const{ev:n,_findTarget:o,_readClickEvent:r,mainDependencies:s}=e,{listenOptions:i,currentContext:c}=t,{mouseWait:u}=i;let l=null,a=null,f=null,d=null,p=0;function m(){const e=r(a,p),t={target:l,targetProps:l?l.getBoundingClientRect():null,x:a.clientX,y:a.clientY,context:c.name,note:c.note,event:a,dependencies:s.extra,type:"click"};n.emit(e,t),f=null,d=null,l=null,a=null,p=0}function h(n){let r=i.maxClicks;return clearTimeout(f),d?(clearTimeout(d),void(d=setTimeout((()=>d=null),u))):(l=o(e,t,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(r=1),l&&"A"===l.tagName&&(r=1),a=n,p++,p>=r?(m(),void(r>1&&(d=setTimeout((()=>d=null),u)))):void(f=setTimeout(m,u)))}function g(n){let r=i.maxClicks;return clearTimeout(f),d?(clearTimeout(d),void(d=setTimeout((()=>d=null),u))):(l=o(e,t,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(r=1),l&&"A"===l.tagName&&(r=1),a=n,p++,p>=r?(m(),void(r>1&&(d=setTimeout((()=>d=null),u)))):void(f=setTimeout(m,u)))}return{start:function(){t.active||(window.addEventListener("contextmenu",g),document.addEventListener("click",h),t.active=!0)},stop:function(){t.active&&(window.removeEventListener("contextmenu",g),document.removeEventListener("click",h),t.active=!1)}}}(a,f),p=u(a,f);p>0&&d.start();let m={getPrefix:()=>"click",shortcutName:e=>i(e),contextChange:()=>{p=u(a,f),p<1&&d.stop(),p>0&&d.start()},mute:()=>d.stop(),unmute:()=>d.start(),destroy:()=>{d.stop(),f=null,m=null}};return Object.freeze(m),m},pluginKey:function(e,s,i={}){let{currentContext:c,shortcuts:u,exposeShortcut:l}=s,{inAPI:a}=e,f={ev:e.ev,_specialChars:r,_readKeyEvent:n,mainDependencies:e,regex:/KEY\s*\:/i},d={currentContext:c,shortcuts:u,active:!1,listenOptions:{keyWait:i.keyWait?i.keyWait:480,maxSequence:1,keyIgnore:null},streamKeys:!(!i.streamKeys||"function"!=typeof i.streamKeys)&&i.streamKeys,exposeShortcut:l};a._normalizeWithPlugins(t);let p=function(e,t){const{ev:n,_specialChars:o,_readKeyEvent:r,mainDependencies:s}=e,{currentContext:i,streamKeys:c,listenOptions:u}=t,{keyWait:l}=u;let a=[],f=null,d=!0,p=!1;const m=()=>d=!1,h=()=>d=!0,g=()=>p=!0,y=()=>!1===d;function v(){let e=a.map((e=>[e.join("+")]));const t={wait:m,end:h,ignore:g,isWaiting:y,note:i.note,context:i.name,dependencies:s.extra,type:"key"};if(!d){let o=e.at(-1);n.emit(o,t),p&&(e=e.slice(0,-1),p=!1)}if(d){const o=`KEY:${e.join(",")}`;n.emit(o,t),a=[],f=null}}function x(t){if(clearTimeout(f),o.hasOwnProperty(t.code))return a.push(r(t,o)),c&&c({key:t.key,context:i.name,note:i.note,dependencies:e.extra}),u.keyIgnore?(clearTimeout(u.keyIgnore),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l))):d&&a.length===u.maxSequence?(v(),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l))):void(d?f=setTimeout(v,l):v())}function C(t){if(!o.hasOwnProperty(t.code)){if(clearTimeout(f),c&&c({key:t.key,context:i.name,note:i.note,dependencies:e.extra}),u.keyIgnore)return clearTimeout(u.keyIgnore),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l));if(a.push(r(t,o)),d&&a.length===u.maxSequence)return v(),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l));d?f=setTimeout(v,l):v()}}return{start:function(){t.active||(document.addEventListener("keydown",x),document.addEventListener("keypress",C),t.active=!0)},stop:function(){t.active&&(document.removeEventListener("keydown",x),document.removeEventListener("keypress",C),t.active=!1)}}}(f,d),m=o(f,d);m>0&&p.start();let h={getPrefix:()=>"key",shortcutName:e=>t(e),contextChange:e=>{m=o(f,d),m<1&&p.stop(),m>0&&p.start()},mute:()=>p.stop(),unmute:()=>p.start(),destroy:()=>{p.stop(),d=null,h=null}};return Object.freeze(h),h},shortcuts:l});function f(e){return e?function(e){let t=e.map((e=>d())),n=t.map((e=>e.promise));t.promises=t;let o=p(Promise.all(n));function r(e){let t="pending";return e.then((()=>t="fulfilled")).catch((()=>t="rejected")),t}function s(n,...o){t.forEach(((t,s)=>n({value:e[s],done:t.done,cancel:t.cancel,timeout:t.timeout,state:r(t.promise)},...o)))}const i={promise:Promise.all(n),promises:t,done:e=>{t.forEach((t=>t.done(e)))},cancel:e=>{t.forEach((t=>t.cancel(e)))},each:s,onComplete:o,timeout:()=>{}};return i.timeout=m(!0,i),i}(e):d()}function d(){let e,t;const n=new Promise(((n,o)=>{e=n,t=o})),o={promise:n,promises:null,done:e,cancel:t,each:()=>{},onComplete:p(n),timeout:()=>{}};return o.timeout=m(!1,o),o.each=(n,...r)=>{n({value:null,done:e,cancel:t,timeout:o.timeout},...r)},o}function p(e){return function(t,n=null){null===n?e.then((e=>t(e))):e.then((e=>t(e)),(e=>n(e)))}}function m(e,t){let n;return n=e?Promise.all(t.promises.map((e=>e.promise))):t.promise,function(e,o){let r,s=new Promise(((t,s)=>{r=setTimeout((()=>{t(o),Promise.resolve(n)}),e)}));return n.then((()=>clearTimeout(r))),t.onComplete=p(Promise.race([n,s])),t}}function h({message:e,level:t,type:n,logLevel:o}){if(0===o)return null;if(o<t)return null;const r=`[Debug]: ${e}`;switch(n){case"warn":console.warn(r);break;case"error":console.error(r);break;default:console.log(r)}return r}function g(e={},t=h){return function({message:n,type:o,level:r,...s}){const{level:i,type:c,defaultMessageLevel:u}=Object.assign({},{level:1e3,type:"log",defaultMessageLevel:1},e);return o||(o=c),r||(r=u),t({message:n,type:o,level:r,logLevel:i,...s})}}function*y(e,t,n,o){let r=null;if(null===e)return yield*o.map((e=>[e,"show"])),void(yield[n,"show"]);if(!o||0===o.length)return t?(yield[e,"hide"],t.reverse(),yield*t.map((e=>[e,"hide"])),void(yield[n,"show"])):(yield[e,"hide"],void(yield[n,"show"]));if(o.includes(e)){for(let t=o.indexOf(e)+1;t<o.length;t++)yield[o[t],"show"];yield[n,"show"]}else{if(!t)return yield[e,"hide"],void(yield*o.map((e=>[e,"show"])));if(o.every(((e,n)=>t[n]===o[n]&&(r=n,!0))),null==r)return yield[e,"hide"],t.reverse(),yield*t.map((e=>[e,"hide"])),yield*o.map((e=>[e,"show"])),void(yield[n,"show"]);yield[e,"hide"];for(let e=t.length;e>r+1;e--)yield[t[e-1],"hide"];for(let e=r+1;e<o.length;e++)yield[o[e],"show"];yield[n,"show"]}}function v(e){return function(t,...n){const{askForPromise:o,deps:r}=e;return function(){const e=o();return t({task:e,dependencies:r()},...n),e.promise}}}function x(e,t){return function(e){const{scenes:n,sceneNames:o}=t;if(!o.has(e))return null;const{show:r,hide:s,parents:i,beforeUnload:c,afterLoad:u,...l}=n[e];return Object.keys(l)}}return f.sequence=function(e,...t){const n=f(),o=[];const r=function*(e){for(const t of e)yield t}(e);return function e(t,...s){t.done?n.done(o):t.value(...s).then((t=>{o.push(t),e(r.next(),...s,t)}))}(r.next(),...t),n},f.all=function(e,...t){const n=f(),o=[],r=e.map(((e,n)=>"function"==typeof e?e(...t).then((e=>o[n]=e)):e.then((e=>o[n]=e))));return Promise.all(r).then((()=>n.done(o))),n},function(e={logLevel:0}){const t=l(),n=g({level:e.logLevel||0}),o={currentScene:null,currentParents:null,sceneNames:new Set,scenes:{},opened:!1},r={},s={shortcutMngr:t,API:r,inAPI:{},findInstructions:y,askForPromise:f,setInstruction:v({askForPromise:f,deps:t.getDependencies}),log:n};return r.hide=function(e,t){return function(n=1){const{askForPromise:o,shortcutMngr:r,setInstruction:s}=e,{currentScene:i,currentParents:c,scenes:u}=t,l=o(),a=[],f=c.length>0;let d;return r.pause(),a.push(s(u[i].hide)),f||(t.currentScene=null),f&&"*"===n&&[...c].reverse().forEach((e=>{d=t.currentParents.pop(),t.currentScene=d,a.push(s(u[e].hide))})),f&&!["*",1].includes(n)&&c.slice("-"+(n-1)).reverse().map((e=>{d=t.currentParents.pop(),t.currentScene=d,a.push(s(u[e].hide))})),(n=o.sequence(a)).onComplete((()=>{r.changeContext(t.currentScene),l.done()})),l.promise}}(s,o),r.listShortcuts=x(0,o),r.listShortcuts=x(0,o),r.setScenes=function(e,t){return function(n){const{shortcutMngr:o}=e;n.forEach((({name:e,scene:n})=>{n.parents||(n.parents=[]),t.scenes[e]=n,t.sceneNames.add(e);const{show:r,hide:s,parents:i,...c}=n,u={};u[e]=c,o.load(u)}))}}(s,o),r.show=function(e,t){return function({scene:n,options:o={ssr:!1}},...r){const{shortcutMngr:s,askForPromise:i,log:c,findInstructions:u,setInstruction:l}=e,a=i(),f=i(),{opened:d,scenes:p,sceneNames:m,currentPage:h}=t;if(h){const t=p[h].beforeHide;"function"==typeof t&&t({done:f.done,dependencies:e})}else f.done();return f.onComplete((f=>{if(!f)return a.done(),a.promise;if(!m.has(n)&&c)return c({message:`Scene ${n} is not available.`,level:1,type:"error"}),a.done(),a.promise;if(!d&&o.ssr)return t.opened=!0,t.currentPage=n,s.changeContext(n),a.done(),a.promise;const{show:h,parents:g=[]}=p[n];if("*"===g[0])return h().then((()=>a.done())),t.currentParents.push(t.currentPage),t.currentPage=n,a.promise;function y([e,n]){if("show"===n)t.currentScene&&t.currentParents.push(t.currentScene),t.currentScene=e;else{let e=t.currentParents.pop();t.currentScene=e}return p[e][n]}g.forEach((e=>m.has(e))),t.currentParents||(t.currentParents=[]);const v=u(t.currentScene,t.currentParents,n,g),x=[];for(let e of v)[e].map(y).map((e=>x.push(l(e),...r)));i.sequence(x).onComplete((()=>{t.opened=!0,s.changeContext(n),"function"==typeof p[n].afterShow&&p[n].afterShow({dependencies:e,done:()=>{}}),a.done()}))})),a.promise}}(s,o),r.loadPlugins=async function(e){const t=e.map((e=>`plugin${e}`)),n=await Promise.resolve().then((function(){return a}));return t.map((e=>n[e]))},r.setDependencies=e=>t.setDependencies(e),r.getDependencies=()=>t.getDependencies(),r.setNote=e=>l.setNote(e),r.listScenes=()=>[...o.sceneNames],r.enablePlugin=(e,n)=>t.enablePlugin(e,n),r.disablePlugin=e=>t.disablePlugin(e),r.emit=(e,...n)=>t.emit(e,...n),r}}));
