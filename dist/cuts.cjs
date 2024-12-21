"use strict";var e=require("@peter.naydenov/shortcuts"),n=require("ask-for-promise"),r=require("@peter.naydenov/log");function*t(e,n,r,t){let s=null;if(null===e)return yield*t.map((e=>[e,"show"])),void(yield[r,"show"]);if(!t||0===t.length)return n?(yield[e,"hide"],n.reverse(),yield*n.map((e=>[e,"hide"])),void(yield[r,"show"])):(yield[e,"hide"],void(yield[r,"show"]));if(t.includes(e)){for(let n=t.indexOf(e)+1;n<t.length;n++)yield[t[n],"show"];yield[r,"show"]}else{if(!n)return yield[e,"hide"],void(yield*t.map((e=>[e,"show"])));if(t.every(((e,r)=>n[r]===t[r]&&(s=r,!0))),null==s)return yield[e,"hide"],n.reverse(),yield*n.map((e=>[e,"hide"])),yield*t.map((e=>[e,"show"])),void(yield[r,"show"]);yield[e,"hide"];for(let e=n.length;e>s+1;e--)yield[n[e-1],"hide"];for(let e=s+1;e<t.length;e++)yield[t[e],"show"];yield[r,"show"]}}function s(e){return function(n,...r){const{askForPromise:t,deps:s}=e;return function(){const e=t();return n({task:e,dependencies:s()},...r),e.promise}}}function o(e,n){return function(e){const{scenes:r,sceneNames:t}=n;if(!t.has(e))return null;const{show:s,hide:o,parents:i,beforeUnload:c,afterLoad:u,...l}=r[e];return Object.keys(l)}}module.exports=function(i={logLevel:0}){const c=e.shortcuts(),u=i.logLevel||0,l=r({level:u}),d={currentScene:null,currentParents:null,sceneNames:new Set,scenes:{},opened:!1},a={},h={shortcutMngr:c,API:a,inAPI:{},findInstructions:t,askForPromise:n,setInstruction:s({askForPromise:n,deps:c.getDependencies}),log:l};return a.hide=function(e,n){return function(r=1){const{askForPromise:t,shortcutMngr:s,setInstruction:o}=e,{currentScene:i,currentParents:c,scenes:u}=n,l=t(),d=[],a=c.length>0;let h;return s.pause(),d.push(o(u[i].hide)),a||(n.currentScene=null),a&&"*"===r&&[...c].reverse().forEach((e=>{h=n.currentParents.pop(),n.currentScene=h,d.push(o(u[e].hide))})),a&&!["*",1].includes(r)&&c.slice("-"+(r-1)).reverse().map((e=>{h=n.currentParents.pop(),n.currentScene=h,d.push(o(u[e].hide))})),(r=t.sequence(d)).onComplete((()=>{s.changeContext(n.currentScene),l.done()})),l.promise}}(h,d),a.listShortcuts=o(0,d),a.listShortcuts=o(0,d),a.setScenes=function(e,n){return function(r){const{shortcutMngr:t}=e;r.forEach((({name:e,scene:r})=>{r.parents||(r.parents=[]),n.scenes[e]=r,n.sceneNames.add(e);const{show:s,hide:o,parents:i,...c}=r,u={};u[e]=c,t.load(u)}))}}(h,d),a.show=function(e,n){return function({scene:r,options:t={ssr:!1}},...s){const{shortcutMngr:o,askForPromise:i,log:c,findInstructions:u,setInstruction:l}=e,d=i(),a=i(),{opened:h,scenes:p,sceneNames:f,currentPage:m}=n;if(m){const n=p[m].beforeHide;"function"==typeof n&&n({done:a.done,dependencies:e})}else a.done();return a.onComplete((a=>{if(!a)return d.done(),d.promise;if(!f.has(r)&&c)return c({message:`Scene ${r} is not available.`,level:1,type:"error"}),d.done(),d.promise;if(!h&&t.ssr)return n.opened=!0,n.currentPage=r,o.changeContext(r),d.done(),d.promise;const{show:m,parents:g=[]}=p[r];if("*"===g[0])return m().then((()=>d.done())),n.currentParents.push(n.currentPage),n.currentPage=r,d.promise;function y([e,r]){if("show"===r)n.currentScene&&n.currentParents.push(n.currentScene),n.currentScene=e;else{let e=n.currentParents.pop();n.currentScene=e}return p[e][r]}g.forEach((e=>f.has(e))),n.currentParents||(n.currentParents=[]);const P=u(n.currentScene,n.currentParents,r,g),w=[];for(let e of P)[e].map(y).map((e=>w.push(l(e),...s)));i.sequence(w).onComplete((()=>{n.opened=!0,o.changeContext(r),"function"==typeof p[r].afterShow&&p[r].afterShow({dependencies:e,done:()=>{}}),d.done()}))})),d.promise}}(h,d),a.loadPlugins=async function(e){const n=e.map((e=>`plugin${e}`)),r=await import("@peter.naydenov/shortcuts");return n.map((e=>r[e]))},a.setDependencies=e=>c.setDependencies(e),a.getDependencies=()=>c.getDependencies(),a.setNote=n=>e.shortcuts.setNote(n),a.listScenes=()=>[...d.sceneNames],a.enablePlugin=(e,n)=>c.enablePlugin(e,n),a.disablePlugin=e=>c.disablePlugin(e),a.emit=(e,...n)=>c.emit(e,...n),a};
