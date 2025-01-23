"use strict";var e=require("@peter.naydenov/shortcuts"),n=require("ask-for-promise"),r=require("@peter.naydenov/log");function*t(e,n,r,t){let s=null;if(null===e)return yield*t.map((e=>[e,"show"])),void(yield[r,"show"]);if(!t||0===t.length)return n?(yield[e,"hide"],n.reverse(),yield*n.map((e=>[e,"hide"])),void(yield[r,"show"])):(yield[e,"hide"],void(yield[r,"show"]));if(t.includes(e)){for(let n=t.indexOf(e)+1;n<t.length;n++)yield[t[n],"show"];yield[r,"show"]}else{if(!n)return yield[e,"hide"],void(yield*t.map((e=>[e,"show"])));if(t.every(((e,r)=>n[r]===t[r]&&(s=r,!0))),null==s)return yield[e,"hide"],n.reverse(),yield*n.map((e=>[e,"hide"])),yield*t.map((e=>[e,"show"])),void(yield[r,"show"]);yield[e,"hide"];for(let e=n.length;e>s+1;e--)yield[n[e-1],"hide"];for(let e=s+1;e<t.length;e++)yield[t[e],"show"];yield[r,"show"]}}function s(e){return function(n,...r){const{askForPromise:t,deps:s}=e;return function(){const e=t();return n({task:e,dependencies:s()},...r),e.promise}}}function o(e,n){return function(e){const{scenes:r,sceneNames:t}=n;if(!t.has(e))return null;const{show:s,hide:o,parents:i,beforeUnload:c,afterLoad:u,...d}=r[e];return Object.keys(d)}}module.exports=function(i={logLevel:0}){const c=e.shortcuts(),u=i.logLevel||0,d=r({level:u}),l={currentScene:null,currentParents:null,sceneNames:new Set,scenes:{},opened:!1},a={},p={shortcutMngr:c,API:a,inAPI:{},findInstructions:t,askForPromise:n,setInstruction:s({askForPromise:n,deps:c.getDependencies}),log:d};return a.hide=function(e,n){return function(r=1){const{askForPromise:t,shortcutMngr:s,setInstruction:o}=e,{currentScene:i,currentParents:c,scenes:u}=n,d=t(),l=[],a=c.length>0;let p;return s.pause(),l.push(o(u[i].hide)),a||(n.currentScene=null),a&&"*"===r&&[...c].reverse().forEach((e=>{p=n.currentParents.pop(),n.currentScene=p,l.push(o(u[e].hide))})),a&&!["*",1].includes(r)&&c.slice("-"+(r-1)).reverse().map((e=>{p=n.currentParents.pop(),n.currentScene=p,l.push(o(u[e].hide))})),(r=t.sequence(l)).onComplete((()=>{s.changeContext(n.currentScene),d.done()})),d.promise}}(p,l),a.listShortcuts=o(0,l),a.listShortcuts=o(0,l),a.setScenes=function(e,n){return function(r){const{shortcutMngr:t}=e;r.forEach((({name:e,scene:r})=>{if(null==r)return void console.warn(`Scene ${e} is not defined`);r.parents||(r.parents=[]),n.scenes[e]=r,n.sceneNames.add(e);const{show:s,hide:o,parents:i,...c}=r,u={};u[e]=c,t.load(u)}))}}(p,l),a.show=function(e,n){return function({scene:r,options:t={ssr:!1}},...s){const{shortcutMngr:o,askForPromise:i,log:c,findInstructions:u,setInstruction:d}=e,l=i(),a=i(),{opened:p,scenes:h,sceneNames:f,currentPage:m}=n;if(m){const e=h[m].beforeHide;"function"==typeof e&&e({done:a.done,dependencies:o.getDependencies()})}else a.done(!0);return a.onComplete((e=>{if(!e)return l.done(),l.promise;if(!f.has(r)&&c)return c({message:`Scene ${r} is not available.`,level:1,type:"error"}),l.done(),l.promise;if(!p&&t.ssr)return n.opened=!0,n.currentPage=r,o.changeContext(r),l.done(),l.promise;const{show:a,parents:m=[]}=h[r];if("*"===m[0])return a().then((()=>l.done())),n.currentParents.push(n.currentPage),n.currentPage=r,l.promise;function g([e,r]){if("show"===r)n.currentScene&&n.currentParents.push(n.currentScene),n.currentScene=e;else{let e=n.currentParents.pop();n.currentScene=e}return h[e][r]}m.forEach((e=>f.has(e))),n.currentParents||(n.currentParents=[]);const y=u(n.currentScene,n.currentParents,r,m),P=[];for(let e of y)[e].map(g).map((e=>P.push(d(e),...s)));i.sequence(P).onComplete((()=>{n.opened=!0,o.changeContext(r),"function"==typeof h[r].afterShow&&h[r].afterShow({dependencies:o.getDependencies(),done:()=>{}}),l.done()}))})),l.promise}}(p,l),a.loadPlugins=async function(e){const n=e.map((e=>`plugin${e}`)),r=await import("@peter.naydenov/shortcuts");return n.map((e=>r[e]))},a.setDependencies=e=>c.setDependencies(e),a.getDependencies=()=>c.getDependencies(),a.setNote=n=>e.shortcuts.setNote(n),a.listScenes=()=>[...l.sceneNames],a.enablePlugin=(e,n)=>c.enablePlugin(e,n),a.disablePlugin=e=>c.disablePlugin(e),a.emit=(e,...n)=>c.emit(e,...n),a};
