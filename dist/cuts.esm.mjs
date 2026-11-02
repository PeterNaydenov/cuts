import { shortcuts as e } from "@peter.naydenov/shortcuts";
import t from "ask-for-promise";
import n from "@peter.naydenov/log";
// src/findInstructions.js
function* r(e, t, n, r) {
	let i = null;
	if (e === null) yield* r.map((e) => [e, "show"]), yield [n, "show"];
	else if (t && t.includes(n)) {
		yield [e, "hide"];
		let r = t.indexOf(n), i = t.filter((e, t) => t > r);
		i.reverse(), yield* i.map((e) => [e, "hide"]);
	} else if (r.length === 0) {
		yield [e, "hide"];
		let r = [...t];
		r.reverse(), yield* r.map((e) => [e, "hide"]), yield [n, "show"];
	} else if (r.includes(e)) {
		let t = r.indexOf(e);
		for (let e = t + 1; e < r.length; e++) yield [r[e], "show"];
		yield [n, "show"];
	} else if (!t) yield [e, "hide"], yield* r.map((e) => [e, "show"]);
	else if (r.every((e, n) => t[n] === r[n] && (i = n, !0)), i == null) yield [e, "hide"], t.reverse(), yield* t.map((e) => [e, "hide"]), yield* r.map((e) => [e, "show"]), yield [n, "show"];
	else {
		yield [e, "hide"];
		for (let e = t.length; e > i + 1; e--) yield [t[e - 1], "hide"];
		for (let e = i + 1; e < r.length; e++) yield [r[e], "show"];
		yield [n, "show"];
	}
}
// src/setInstruction.js
function i(e) {
	return function(t, ...n) {
		let { askForPromise: r, deps: i } = e;
		return function() {
			let e = r();
			return t({
				task: e,
				dependencies: i()
			}, ...n), e.promise.catch(() => {});
		};
	};
}
// src/methods/hide.js
function a(e, t) {
	return function(n = 1) {
		let { askForPromise: r, shortcutMngr: i, setInstruction: a } = e, { currentScene: o, scenes: s } = t, c = r(), l = r();
		if (o == null) return c.done(), c.promise;
		if (typeof s[o].beforeHide == "function") {
			let e = s[o].beforeHide;
			try {
				let t = e({
					done: l.done,
					dependencies: i.getDependencies()
				});
				t != null && typeof t.then == "function" && t.then(l.done).catch(() => l.done(!1));
			} catch {
				l.done(!1);
			}
		} else l.done(!0);
		return l.onComplete((e) => {
			if (!e) return c.done(), c.promise;
			let l = [], u = [...t.currentParents];
			i.pause(), l.push(a(s[o].hide));
			let d = n === "*" ? u.length : Math.min(n - 1, u.length);
			for (let e = 0; e < d; e++) {
				let e = u.pop();
				l.push(a(s[e].hide));
			}
			t.currentScene = u.length > 0 ? u.pop() : null, t.currentParents = u, r.sequence(l).onComplete(() => {
				i.changeContext(t.currentScene), c.done();
			});
		}), c.promise;
	};
}
// src/methods/listShortcuts.js
function o(e, t) {
	return function(e) {
		let { scenes: n, sceneNames: r } = t;
		if (!r.has(e)) return null;
		let { show: i, hide: a, parents: o, beforeHide: s, afterShow: c, ...l } = n[e];
		return Object.keys(l);
	};
}
// src/methods/setScenes.js
function s(e, t) {
	return function(n) {
		let { shortcutMngr: r, log: i } = e;
		n.forEach((e) => {
			if (e == null) return;
			let { name: n, scene: a } = e;
			if (!n) {
				i({
					message: "Scene name is not defined",
					level: 1,
					type: "error"
				});
				return;
			}
			if (a == null) {
				i({
					message: `Scene ${n} is not defined`,
					level: 1,
					type: "error"
				});
				return;
			}
			a.parents ||= [], t.scenes[n] = a, t.sceneNames.add(n);
			let { show: o, hide: s, parents: c, afterShow: l, beforeHide: u, ...d } = a, f = {};
			f[n] = d, r.load(f);
		});
	};
}
// src/methods/show.js
function c(e, t) {
	function n({ scene: n, options: r = { ssr: !1 } }, ...i) {
		let { shortcutMngr: a, askForPromise: o, log: s, findInstructions: c, setInstruction: l } = e, u = o(), d = o(), { opened: f, scenes: p, sceneNames: m, currentScene: h } = t, g = h && typeof p[h].beforeHide == "function";
		function _() {
			t.busy = null;
			let { afterShow: e } = p[n];
			typeof e == "function" && e({
				dependencies: a.getDependencies(),
				done: () => {}
			}), u.done();
		}
		if (g) {
			let e = p[h].beforeHide;
			try {
				let t = e({
					done: d.done,
					dependencies: a.getDependencies()
				});
				t != null && typeof t.then == "function" && t.then(d.done).catch(() => d.done(!1));
			} catch {
				d.done(!1);
			}
		} else d.done(!0);
		return d.onComplete((e) => {
			if (!e) return u.done(), u.promise;
			if (!m.has(n)) return s({
				message: `Scene "${n}" is not available.`,
				level: 1,
				type: "error"
			}), u.done(), u.promise;
			if (!f && r.ssr) return t.opened = !0, t.currentScene = n, t.currentParents = p[n].parents ? [...p[n].parents] : [], a.changeContext(n), _(), u.promise;
			let { show: d, parents: h = [] } = p[n];
			if (t.currentParents ||= [], h[0] === "*") return l(d, ...i)().then(_), t.currentScene && t.currentScene !== n && t.currentParents.push(t.currentScene), t.currentScene = n, a.changeContext(n), u.promise;
			if (!(h.length === 0 || h.every((e) => m.has(e)))) return s({
				message: `Some of '${n}' parent scenes are not set.`,
				level: 1,
				type: "error"
			}), u.done(), u.promise;
			function g([e, n]) {
				return n === "show" ? (t.currentScene && (t.currentParents = [...p[t.currentScene].parents]), t.currentScene = e) : t.currentScene = p[e].parents[0] === "*" ? t.currentParents.pop() : p[e].parents.at(-1), p[e][n];
			}
			let v = c(t.currentScene, [...t.currentParents], n, h), y = [];
			for (let e of v) {
				let t = g(e);
				y.push(l(t, ...i));
			}
			o.sequence(y).onComplete(() => {
				t.opened = !0, t.currentScene = n, t.currentParents = p[n].parents ? [...p[n].parents] : null, a.changeContext(n), _();
			});
		}), u.promise;
	}
	return n;
}
// src/methods/jump.js
function l(e, t) {
	function n({ scene: n }, ...r) {
		let i = e.currentScene;
		return t({ scene: n }, ...r).then(() => {
			e.currentScene === n && e.jumpStack.push(i);
		}).catch(() => {});
	}
	return n;
}
// src/methods/jumpBack.js
function u(e, t) {
	function n({ hops: n = 1 } = {}, ...r) {
		if (e.busy) return Promise.resolve();
		let i = e.jumpStack.length - Math.max(1, n);
		if (i < 0) return;
		let a = e.jumpStack[i];
		return t({ scene: a }, ...r).then(() => {
			e.currentScene === a && (e.jumpStack.length = i);
		}).catch(() => {});
	}
	return n;
}
// src/methods/jumpsReset.js
function d(e) {
	return function() {
		e.jumpStack = [];
	};
}
// src/main.js
function f(f = {}) {
	let p = e({ errorEventName: "@app-error" }), m = f.logLevel ?? 1, h = n({ level: m }, (e) => {
		let { type: t, logLevel: n } = e;
		n !== 0 && t === "error" && p.getDependencies().emit("@app-error", e);
	}), g = {
		currentScene: null,
		currentParents: null,
		sceneNames: /* @__PURE__ */ new Set(),
		scenes: {},
		opened: !1,
		jumpStack: [],
		busy: null
	}, _ = {}, v = {
		shortcutMngr: p,
		API: _,
		inAPI: {},
		findInstructions: r,
		askForPromise: t,
		setInstruction: i({
			askForPromise: t,
			deps: p.getDependencies
		}),
		log: h
	};
	function y(e) {
		return function(...t) {
			if (g.busy) return Promise.resolve();
			let n = g.busy = {}, r;
			try {
				r = e(...t);
			} catch (e) {
				throw g.busy = null, e;
			}
			return r.finally(() => {
				g.busy === n && (g.busy = null);
			});
		};
	}
	return _.hide = y(a(v, g)), _.listShortcuts = o(v, g), _.setScenes = s(v, g), _.show = y(c(v, g)), _.jump = l(g, _.show), _.jumpBack = u(g, _.show), _.jumpsReset = d(g), _.loadPlugins = async function(e) {
		let t = e.map((e) => `plugin${e}`), n = await import("@peter.naydenov/shortcuts");
		return t.map((e) => n[e]);
	}, _.setDependencies = (e) => p.setDependencies(e), _.getDependencies = () => p.getDependencies(), _.setNote = (e) => p.setNote(e), _.listScenes = () => [...g.sceneNames], _.enablePlugin = (e, t) => p.enablePlugin(e, t), _.disablePlugin = (e) => p.disablePlugin(typeof e == "string" ? e.toLowerCase() : e), _.getState = () => ({
		scene: g.currentScene,
		parents: g.currentParents ? [...g.currentParents] : g.currentParents,
		opened: g.opened
	}), _.emit = (e, ...t) => p.getDependencies().emit(e, ...t), _;
}
export { f as default };
