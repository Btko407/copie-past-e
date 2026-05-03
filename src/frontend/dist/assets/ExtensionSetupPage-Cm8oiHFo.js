import { c as createLucideIcon, u as useActor, k as useQuery, r as reactExports, j as jsxRuntimeExports, w as Link, B as Button, A as ArrowLeft, Z as Zap, m as motion, ae as Puzzle, T as TriangleAlert, C as CircleCheck, e as createActor } from "./index-CDYDluDX.js";
import { B as Badge } from "./badge-tMJODRQh.js";
import { a as isMobile } from "./useExtension-DUZbB0Nc.js";
import { D as Download } from "./download-DEXd4YsB.js";
import { E as ExternalLink } from "./external-link-Bt1eODa_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["line", { x1: "21.17", x2: "12", y1: "8", y2: "8", key: "a0cw5f" }],
  ["line", { x1: "3.95", x2: "8.54", y1: "6.06", y2: "14", key: "1kftof" }],
  ["line", { x1: "10.88", x2: "15.46", y1: "21.94", y2: "14", key: "1ymyh8" }]
];
const Chrome = createLucideIcon("chrome", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5.5 20H8", key: "1k40s5" }],
  ["path", { d: "M17 9h.01", key: "1j24nn" }],
  ["rect", { width: "10", height: "16", x: "12", y: "4", rx: "2", key: "ixliua" }],
  ["path", { d: "M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4", key: "1mp6e1" }],
  ["circle", { cx: "17", cy: "15", r: "1", key: "tqvash" }]
];
const MonitorSpeaker = createLucideIcon("monitor-speaker", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "15", cy: "12", r: "3", key: "1afu0r" }],
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
];
const ToggleRight = createLucideIcon("toggle-right", __iconNode);
let z = {}, J;
function F(e = {}) {
  z = {
    animate: true,
    allowClose: true,
    overlayClickBehavior: "close",
    overlayOpacity: 0.7,
    smoothScroll: false,
    disableActiveInteraction: false,
    showProgress: false,
    stagePadding: 10,
    stageRadius: 5,
    popoverOffset: 10,
    showButtons: ["next", "previous", "close"],
    disableButtons: [],
    overlayColor: "#000",
    ...e
  };
}
function s(e) {
  return e ? z[e] : z;
}
function le(e) {
  J = e;
}
function _() {
  return J;
}
let I = {};
function N(e, o) {
  I[e] = o;
}
function L(e) {
  var o;
  (o = I[e]) == null || o.call(I);
}
function de() {
  I = {};
}
function O(e, o, t, i) {
  return (e /= i / 2) < 1 ? t / 2 * e * e + o : -t / 2 * (--e * (e - 2) - 1) + o;
}
function U(e) {
  const o = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
  return e.flatMap((t) => {
    const i = t.matches(o), d = Array.from(t.querySelectorAll(o));
    return [...i ? [t] : [], ...d];
  }).filter((t) => getComputedStyle(t).pointerEvents !== "none" && ve(t));
}
function ee(e) {
  if (!e || ue(e))
    return;
  const o = s("smoothScroll"), t = e.offsetHeight > window.innerHeight;
  e.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !o || pe(e) ? "auto" : "smooth",
    inline: "center",
    block: t ? "start" : "center"
  });
}
function pe(e) {
  if (!e || !e.parentElement)
    return;
  const o = e.parentElement;
  return o.scrollHeight > o.clientHeight;
}
function ue(e) {
  const o = e.getBoundingClientRect();
  return o.top >= 0 && o.left >= 0 && o.bottom <= (window.innerHeight || document.documentElement.clientHeight) && o.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function ve(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
let D = {};
function k(e, o) {
  D[e] = o;
}
function l(e) {
  return e ? D[e] : D;
}
function X() {
  D = {};
}
function fe(e, o, t, i) {
  let d = l("__activeStagePosition");
  const n = d || t.getBoundingClientRect(), f = i.getBoundingClientRect(), w = O(e, n.x, f.x - n.x, o), r = O(e, n.y, f.y - n.y, o), v = O(e, n.width, f.width - n.width, o), g = O(e, n.height, f.height - n.height, o);
  d = {
    x: w,
    y: r,
    width: v,
    height: g
  }, oe(d), k("__activeStagePosition", d);
}
function te(e) {
  if (!e)
    return;
  const o = e.getBoundingClientRect(), t = {
    x: o.x,
    y: o.y,
    width: o.width,
    height: o.height
  };
  k("__activeStagePosition", t), oe(t);
}
function he() {
  const e = l("__activeStagePosition"), o = l("__overlaySvg");
  if (!e)
    return;
  if (!o) {
    console.warn("No stage svg found.");
    return;
  }
  const t = window.innerWidth, i = window.innerHeight;
  o.setAttribute("viewBox", `0 0 ${t} ${i}`);
}
function ge(e) {
  const o = we(e);
  document.body.appendChild(o), re(o, (t) => {
    t.target.tagName === "path" && L("overlayClick");
  }), k("__overlaySvg", o);
}
function oe(e) {
  const o = l("__overlaySvg");
  if (!o) {
    ge(e);
    return;
  }
  const t = o.firstElementChild;
  if ((t == null ? void 0 : t.tagName) !== "path")
    throw new Error("no path element found in stage svg");
  t.setAttribute("d", ie(e));
}
function we(e) {
  const o = window.innerWidth, t = window.innerHeight, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.classList.add("driver-overlay", "driver-overlay-animated"), i.setAttribute("viewBox", `0 0 ${o} ${t}`), i.setAttribute("xmlSpace", "preserve"), i.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink"), i.setAttribute("version", "1.1"), i.setAttribute("preserveAspectRatio", "xMinYMin slice"), i.style.fillRule = "evenodd", i.style.clipRule = "evenodd", i.style.strokeLinejoin = "round", i.style.strokeMiterlimit = "2", i.style.zIndex = "10000", i.style.position = "fixed", i.style.top = "0", i.style.left = "0", i.style.width = "100%", i.style.height = "100%";
  const d = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", ie(e)), d.style.fill = s("overlayColor") || "rgb(0,0,0)", d.style.opacity = `${s("overlayOpacity")}`, d.style.pointerEvents = "auto", d.style.cursor = "auto", i.appendChild(d), i;
}
function ie(e) {
  const o = window.innerWidth, t = window.innerHeight, i = s("stagePadding") || 0, d = s("stageRadius") || 0, n = e.width + i * 2, f = e.height + i * 2, w = Math.min(d, n / 2, f / 2), r = Math.floor(Math.max(w, 0)), v = e.x - i + r, g = e.y - i, y = n - r * 2, a = f - r * 2;
  return `M${o},0L0,0L0,${t}L${o},${t}L${o},0Z
    M${v},${g} h${y} a${r},${r} 0 0 1 ${r},${r} v${a} a${r},${r} 0 0 1 -${r},${r} h-${y} a${r},${r} 0 0 1 -${r},-${r} v-${a} a${r},${r} 0 0 1 ${r},-${r} z`;
}
function me() {
  const e = l("__overlaySvg");
  e && e.remove();
}
function ye() {
  const e = document.getElementById("driver-dummy-element");
  if (e)
    return e;
  let o = document.createElement("div");
  return o.id = "driver-dummy-element", o.style.width = "0", o.style.height = "0", o.style.pointerEvents = "none", o.style.opacity = "0", o.style.position = "fixed", o.style.top = "50%", o.style.left = "50%", document.body.appendChild(o), o;
}
function j(e) {
  const { element: o } = e;
  let t = typeof o == "function" ? o() : typeof o == "string" ? document.querySelector(o) : o;
  t || (t = ye()), be(t, e);
}
function xe() {
  const e = l("__activeElement"), o = l("__activeStep");
  e && (te(e), he(), ae(e, o));
}
function be(e, o) {
  var C;
  const i = Date.now(), d = l("__activeStep"), n = l("__activeElement") || e, f = !n || n === e, w = e.id === "driver-dummy-element", r = n.id === "driver-dummy-element", v = s("animate"), g = o.onHighlightStarted || s("onHighlightStarted"), y = (o == null ? void 0 : o.onHighlighted) || s("onHighlighted"), a = (d == null ? void 0 : d.onDeselected) || s("onDeselected"), p = s(), c = l();
  !f && a && a(r ? void 0 : n, d, {
    config: p,
    state: c,
    driver: _()
  }), g && g(w ? void 0 : e, o, {
    config: p,
    state: c,
    driver: _()
  });
  const u = !f && v;
  let h = false;
  Se(), k("previousStep", d), k("previousElement", n), k("activeStep", o), k("activeElement", e);
  const m = () => {
    if (l("__transitionCallback") !== m)
      return;
    const b = Date.now() - i, E = 400 - b <= 400 / 2;
    o.popover && E && !h && u && (Q(e, o), h = true), s("animate") && b < 400 ? fe(b, 400, n, e) : (te(e), y && y(w ? void 0 : e, o, {
      config: s(),
      state: l(),
      driver: _()
    }), k("__transitionCallback", void 0), k("__previousStep", d), k("__previousElement", n), k("__activeStep", o), k("__activeElement", e)), window.requestAnimationFrame(m);
  };
  k("__transitionCallback", m), window.requestAnimationFrame(m), ee(e), !u && o.popover && Q(e, o), n.classList.remove("driver-active-element", "driver-no-interaction"), n.removeAttribute("aria-haspopup"), n.removeAttribute("aria-expanded"), n.removeAttribute("aria-controls"), ((C = o.disableActiveInteraction) != null ? C : s("disableActiveInteraction")) && e.classList.add("driver-no-interaction"), e.classList.add("driver-active-element"), e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "true"), e.setAttribute("aria-controls", "driver-popover-content");
}
function Ce() {
  var e;
  (e = document.getElementById("driver-dummy-element")) == null || e.remove(), document.querySelectorAll(".driver-active-element").forEach((o) => {
    o.classList.remove("driver-active-element", "driver-no-interaction"), o.removeAttribute("aria-haspopup"), o.removeAttribute("aria-expanded"), o.removeAttribute("aria-controls");
  });
}
function M() {
  const e = l("__resizeTimeout");
  e && window.cancelAnimationFrame(e), k("__resizeTimeout", window.requestAnimationFrame(xe));
}
function Pe(e) {
  var r;
  if (!l("isInitialized") || !(e.key === "Tab" || e.keyCode === 9))
    return;
  const i = l("__activeElement"), d = (r = l("popover")) == null ? void 0 : r.wrapper, n = U([
    ...d ? [d] : [],
    ...i ? [i] : []
  ]), f = n[0], w = n[n.length - 1];
  if (e.preventDefault(), e.shiftKey) {
    const v = n[n.indexOf(document.activeElement) - 1] || w;
    v == null || v.focus();
  } else {
    const v = n[n.indexOf(document.activeElement) + 1] || f;
    v == null || v.focus();
  }
}
function ne(e) {
  var t;
  ((t = s("allowKeyboardControl")) == null || t) && (e.key === "Escape" ? L("escapePress") : e.key === "ArrowRight" ? L("arrowRightPress") : e.key === "ArrowLeft" && L("arrowLeftPress"));
}
function re(e, o, t) {
  const i = (n, f) => {
    const w = n.target;
    e.contains(w) && ((!t || t(w)) && (n.preventDefault(), n.stopPropagation(), n.stopImmediatePropagation()), f == null || f(n));
  };
  document.addEventListener("pointerdown", i, true), document.addEventListener("mousedown", i, true), document.addEventListener("pointerup", i, true), document.addEventListener("mouseup", i, true), document.addEventListener(
    "click",
    (n) => {
      i(n, o);
    },
    true
  );
}
function ke() {
  window.addEventListener("keyup", ne, false), window.addEventListener("keydown", Pe, false), window.addEventListener("resize", M), window.addEventListener("scroll", M);
}
function _e() {
  window.removeEventListener("keyup", ne), window.removeEventListener("resize", M), window.removeEventListener("scroll", M);
}
function Se() {
  const e = l("popover");
  e && (e.wrapper.style.display = "none");
}
function Q(e, o) {
  var b, P;
  let t = l("popover");
  t && document.body.removeChild(t.wrapper), t = Le(), document.body.appendChild(t.wrapper);
  const {
    title: i,
    description: d,
    showButtons: n,
    disableButtons: f,
    showProgress: w,
    nextBtnText: r = s("nextBtnText") || "Next &rarr;",
    prevBtnText: v = s("prevBtnText") || "&larr; Previous",
    progressText: g = s("progressText") || "{current} of {total}"
  } = o.popover || {};
  t.nextButton.innerHTML = r, t.previousButton.innerHTML = v, t.progress.innerHTML = g, i ? (t.title.innerHTML = i, t.title.style.display = "block") : t.title.style.display = "none", d ? (t.description.innerHTML = d, t.description.style.display = "block") : t.description.style.display = "none";
  const y = n || s("showButtons"), a = w || s("showProgress") || false, p = (y == null ? void 0 : y.includes("next")) || (y == null ? void 0 : y.includes("previous")) || a;
  t.closeButton.style.display = y.includes("close") ? "block" : "none", p ? (t.footer.style.display = "flex", t.progress.style.display = a ? "block" : "none", t.nextButton.style.display = y.includes("next") ? "block" : "none", t.previousButton.style.display = y.includes("previous") ? "block" : "none") : t.footer.style.display = "none";
  const c = f || s("disableButtons") || [];
  c != null && c.includes("next") && (t.nextButton.disabled = true, t.nextButton.classList.add("driver-popover-btn-disabled")), c != null && c.includes("previous") && (t.previousButton.disabled = true, t.previousButton.classList.add("driver-popover-btn-disabled")), c != null && c.includes("close") && (t.closeButton.disabled = true, t.closeButton.classList.add("driver-popover-btn-disabled"));
  const u = t.wrapper;
  u.style.display = "block", u.style.left = "", u.style.top = "", u.style.bottom = "", u.style.right = "", u.id = "driver-popover-content", u.setAttribute("role", "dialog"), u.setAttribute("aria-labelledby", "driver-popover-title"), u.setAttribute("aria-describedby", "driver-popover-description");
  const h = t.arrow;
  h.className = "driver-popover-arrow";
  const m = ((b = o.popover) == null ? void 0 : b.popoverClass) || s("popoverClass") || "";
  u.className = `driver-popover ${m}`.trim(), re(
    t.wrapper,
    (E) => {
      var B, R, W;
      const T = E.target, A = ((B = o.popover) == null ? void 0 : B.onNextClick) || s("onNextClick"), H = ((R = o.popover) == null ? void 0 : R.onPrevClick) || s("onPrevClick"), $ = ((W = o.popover) == null ? void 0 : W.onCloseClick) || s("onCloseClick");
      if (T.closest(".driver-popover-next-btn"))
        return A ? A(e, o, {
          config: s(),
          state: l(),
          driver: _()
        }) : L("nextClick");
      if (T.closest(".driver-popover-prev-btn"))
        return H ? H(e, o, {
          config: s(),
          state: l(),
          driver: _()
        }) : L("prevClick");
      if (T.closest(".driver-popover-close-btn"))
        return $ ? $(e, o, {
          config: s(),
          state: l(),
          driver: _()
        }) : L("closeClick");
    },
    (E) => !(t != null && t.description.contains(E)) && !(t != null && t.title.contains(E)) && typeof E.className == "string" && E.className.includes("driver-popover")
  ), k("popover", t);
  const x = ((P = o.popover) == null ? void 0 : P.onPopoverRender) || s("onPopoverRender");
  x && x(t, {
    config: s(),
    state: l(),
    driver: _()
  }), ae(e, o), ee(u);
  const C = e.classList.contains("driver-dummy-element"), S = U([u, ...C ? [] : [e]]);
  S.length > 0 && S[0].focus();
}
function se() {
  const e = l("popover");
  if (!(e != null && e.wrapper))
    return;
  const o = e.wrapper.getBoundingClientRect(), t = s("stagePadding") || 0, i = s("popoverOffset") || 0;
  return {
    width: o.width + t + i,
    height: o.height + t + i,
    realWidth: o.width,
    realHeight: o.height
  };
}
function Z(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: d, popoverArrowDimensions: n } = o;
  return e === "start" ? Math.max(
    Math.min(
      t.top - d,
      window.innerHeight - i.realHeight - n.width
    ),
    n.width
  ) : e === "end" ? Math.max(
    Math.min(
      t.top - (i == null ? void 0 : i.realHeight) + t.height + d,
      window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
    ),
    n.width
  ) : e === "center" ? Math.max(
    Math.min(
      t.top + t.height / 2 - (i == null ? void 0 : i.realHeight) / 2,
      window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
    ),
    n.width
  ) : 0;
}
function G(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: d, popoverArrowDimensions: n } = o;
  return e === "start" ? Math.max(
    Math.min(
      t.left - d,
      window.innerWidth - i.realWidth - n.width
    ),
    n.width
  ) : e === "end" ? Math.max(
    Math.min(
      t.left - (i == null ? void 0 : i.realWidth) + t.width + d,
      window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
    ),
    n.width
  ) : e === "center" ? Math.max(
    Math.min(
      t.left + t.width / 2 - (i == null ? void 0 : i.realWidth) / 2,
      window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
    ),
    n.width
  ) : 0;
}
function ae(e, o) {
  const t = l("popover");
  if (!t)
    return;
  const { align: i = "start", side: d = "left" } = (o == null ? void 0 : o.popover) || {}, n = i, f = e.id === "driver-dummy-element" ? "over" : d, w = s("stagePadding") || 0, r = se(), v = t.arrow.getBoundingClientRect(), g = e.getBoundingClientRect(), y = g.top - r.height;
  let a = y >= 0;
  const p = window.innerHeight - (g.bottom + r.height);
  let c = p >= 0;
  const u = g.left - r.width;
  let h = u >= 0;
  const m = window.innerWidth - (g.right + r.width);
  let x = m >= 0;
  const C = !a && !c && !h && !x;
  let S = f;
  if (f === "top" && a ? x = h = c = false : f === "bottom" && c ? x = h = a = false : f === "left" && h ? x = a = c = false : f === "right" && x && (h = a = c = false), f === "over") {
    const b = window.innerWidth / 2 - r.realWidth / 2, P = window.innerHeight / 2 - r.realHeight / 2;
    t.wrapper.style.left = `${b}px`, t.wrapper.style.right = "auto", t.wrapper.style.top = `${P}px`, t.wrapper.style.bottom = "auto";
  } else if (C) {
    const b = window.innerWidth / 2 - (r == null ? void 0 : r.realWidth) / 2, P = 10;
    t.wrapper.style.left = `${b}px`, t.wrapper.style.right = "auto", t.wrapper.style.bottom = `${P}px`, t.wrapper.style.top = "auto";
  } else if (h) {
    const b = Math.min(
      u,
      window.innerWidth - (r == null ? void 0 : r.realWidth) - v.width
    ), P = Z(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: w,
      popoverArrowDimensions: v
    });
    t.wrapper.style.left = `${b}px`, t.wrapper.style.top = `${P}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.right = "auto", S = "left";
  } else if (x) {
    const b = Math.min(
      m,
      window.innerWidth - (r == null ? void 0 : r.realWidth) - v.width
    ), P = Z(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: w,
      popoverArrowDimensions: v
    });
    t.wrapper.style.right = `${b}px`, t.wrapper.style.top = `${P}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.left = "auto", S = "right";
  } else if (a) {
    const b = Math.min(
      y,
      window.innerHeight - r.realHeight - v.width
    );
    let P = G(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: w,
      popoverArrowDimensions: v
    });
    t.wrapper.style.top = `${b}px`, t.wrapper.style.left = `${P}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.right = "auto", S = "top";
  } else if (c) {
    const b = Math.min(
      p,
      window.innerHeight - (r == null ? void 0 : r.realHeight) - v.width
    );
    let P = G(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: w,
      popoverArrowDimensions: v
    });
    t.wrapper.style.left = `${P}px`, t.wrapper.style.bottom = `${b}px`, t.wrapper.style.top = "auto", t.wrapper.style.right = "auto", S = "bottom";
  }
  C ? t.arrow.classList.add("driver-popover-arrow-none") : Ee(n, S, e);
}
function Ee(e, o, t) {
  const i = l("popover");
  if (!i)
    return;
  const d = t.getBoundingClientRect(), n = se(), f = i.arrow, w = n.width, r = window.innerWidth, v = d.width, g = d.left, y = n.height, a = window.innerHeight, p = d.top, c = d.height;
  f.className = "driver-popover-arrow";
  let u = o, h = e;
  if (o === "top" ? (g + v <= 0 ? (u = "right", h = "end") : g + v - w <= 0 && (u = "top", h = "start"), g >= r ? (u = "left", h = "end") : g + w >= r && (u = "top", h = "end")) : o === "bottom" ? (g + v <= 0 ? (u = "right", h = "start") : g + v - w <= 0 && (u = "bottom", h = "start"), g >= r ? (u = "left", h = "start") : g + w >= r && (u = "bottom", h = "end")) : o === "left" ? (p + c <= 0 ? (u = "bottom", h = "end") : p + c - y <= 0 && (u = "left", h = "start"), p >= a ? (u = "top", h = "end") : p + y >= a && (u = "left", h = "end")) : o === "right" && (p + c <= 0 ? (u = "bottom", h = "start") : p + c - y <= 0 && (u = "right", h = "start"), p >= a ? (u = "top", h = "start") : p + y >= a && (u = "right", h = "end")), !u)
    f.classList.add("driver-popover-arrow-none");
  else {
    f.classList.add(`driver-popover-arrow-side-${u}`), f.classList.add(`driver-popover-arrow-align-${h}`);
    const m = t.getBoundingClientRect(), x = f.getBoundingClientRect(), C = s("stagePadding") || 0, S = m.left - C < window.innerWidth && m.right + C > 0 && m.top - C < window.innerHeight && m.bottom + C > 0;
    o === "bottom" && S && (x.x > m.x && x.x + x.width < m.x + m.width ? i.wrapper.style.transform = "translateY(0)" : (f.classList.remove(`driver-popover-arrow-align-${h}`), f.classList.add("driver-popover-arrow-none"), i.wrapper.style.transform = `translateY(-${C / 2}px)`));
  }
}
function Le() {
  const e = document.createElement("div");
  e.classList.add("driver-popover");
  const o = document.createElement("div");
  o.classList.add("driver-popover-arrow");
  const t = document.createElement("header");
  t.id = "driver-popover-title", t.classList.add("driver-popover-title"), t.style.display = "none", t.innerText = "Popover Title";
  const i = document.createElement("div");
  i.id = "driver-popover-description", i.classList.add("driver-popover-description"), i.style.display = "none", i.innerText = "Popover description is here";
  const d = document.createElement("button");
  d.type = "button", d.classList.add("driver-popover-close-btn"), d.setAttribute("aria-label", "Close"), d.innerHTML = "&times;";
  const n = document.createElement("footer");
  n.classList.add("driver-popover-footer");
  const f = document.createElement("span");
  f.classList.add("driver-popover-progress-text"), f.innerText = "";
  const w = document.createElement("span");
  w.classList.add("driver-popover-navigation-btns");
  const r = document.createElement("button");
  r.type = "button", r.classList.add("driver-popover-prev-btn"), r.innerHTML = "&larr; Previous";
  const v = document.createElement("button");
  return v.type = "button", v.classList.add("driver-popover-next-btn"), v.innerHTML = "Next &rarr;", w.appendChild(r), w.appendChild(v), n.appendChild(f), n.appendChild(w), e.appendChild(d), e.appendChild(o), e.appendChild(t), e.appendChild(i), e.appendChild(n), {
    wrapper: e,
    arrow: o,
    title: t,
    description: i,
    footer: n,
    previousButton: r,
    nextButton: v,
    closeButton: d,
    footerButtons: w,
    progress: f
  };
}
function Te() {
  var o;
  const e = l("popover");
  e && ((o = e.wrapper.parentElement) == null || o.removeChild(e.wrapper));
}
function Ae(e = {}) {
  F(e);
  function o() {
    s("allowClose") && g();
  }
  function t() {
    const a = s("overlayClickBehavior");
    if (s("allowClose") && a === "close") {
      g();
      return;
    }
    if (typeof a == "function") {
      const p = l("__activeStep"), c = l("__activeElement");
      a(c, p, {
        config: s(),
        state: l(),
        driver: _()
      });
      return;
    }
    a === "nextStep" && i();
  }
  function i() {
    const a = l("activeIndex"), p = s("steps") || [];
    if (typeof a == "undefined")
      return;
    const c = a + 1;
    p[c] ? v(c) : g();
  }
  function d() {
    const a = l("activeIndex"), p = s("steps") || [];
    if (typeof a == "undefined")
      return;
    const c = a - 1;
    p[c] ? v(c) : g();
  }
  function n(a) {
    (s("steps") || [])[a] ? v(a) : g();
  }
  function f() {
    var x;
    if (l("__transitionCallback"))
      return;
    const p = l("activeIndex"), c = l("__activeStep"), u = l("__activeElement");
    if (typeof p == "undefined" || typeof c == "undefined" || typeof l("activeIndex") == "undefined")
      return;
    const m = ((x = c.popover) == null ? void 0 : x.onPrevClick) || s("onPrevClick");
    if (m)
      return m(u, c, {
        config: s(),
        state: l(),
        driver: _()
      });
    d();
  }
  function w() {
    var m;
    if (l("__transitionCallback"))
      return;
    const p = l("activeIndex"), c = l("__activeStep"), u = l("__activeElement");
    if (typeof p == "undefined" || typeof c == "undefined")
      return;
    const h = ((m = c.popover) == null ? void 0 : m.onNextClick) || s("onNextClick");
    if (h)
      return h(u, c, {
        config: s(),
        state: l(),
        driver: _()
      });
    i();
  }
  function r() {
    l("isInitialized") || (k("isInitialized", true), document.body.classList.add("driver-active", s("animate") ? "driver-fade" : "driver-simple"), ke(), N("overlayClick", t), N("escapePress", o), N("arrowLeftPress", f), N("arrowRightPress", w));
  }
  function v(a = 0) {
    var $, B, R, W, V, q, K, Y;
    const p = s("steps");
    if (!p) {
      console.error("No steps to drive through"), g();
      return;
    }
    if (!p[a]) {
      g();
      return;
    }
    k("__activeOnDestroyed", document.activeElement), k("activeIndex", a);
    const c = p[a], u = p[a + 1], h = p[a - 1], m = (($ = c.popover) == null ? void 0 : $.doneBtnText) || s("doneBtnText") || "Done", x = s("allowClose"), C = typeof ((B = c.popover) == null ? void 0 : B.showProgress) != "undefined" ? (R = c.popover) == null ? void 0 : R.showProgress : s("showProgress"), b = (((W = c.popover) == null ? void 0 : W.progressText) || s("progressText") || "{{current}} of {{total}}").replace("{{current}}", `${a + 1}`).replace("{{total}}", `${p.length}`), P = ((V = c.popover) == null ? void 0 : V.showButtons) || s("showButtons"), E = [
      "next",
      "previous",
      ...x ? ["close"] : []
    ].filter((ce) => !(P != null && P.length) || P.includes(ce)), T = ((q = c.popover) == null ? void 0 : q.onNextClick) || s("onNextClick"), A = ((K = c.popover) == null ? void 0 : K.onPrevClick) || s("onPrevClick"), H = ((Y = c.popover) == null ? void 0 : Y.onCloseClick) || s("onCloseClick");
    j({
      ...c,
      popover: {
        showButtons: E,
        nextBtnText: u ? void 0 : m,
        disableButtons: [...h ? [] : ["previous"]],
        showProgress: C,
        progressText: b,
        onNextClick: T || (() => {
          u ? v(a + 1) : g();
        }),
        onPrevClick: A || (() => {
          v(a - 1);
        }),
        onCloseClick: H || (() => {
          g();
        }),
        ...(c == null ? void 0 : c.popover) || {}
      }
    });
  }
  function g(a = true) {
    const p = l("__activeElement"), c = l("__activeStep"), u = l("__activeOnDestroyed"), h = s("onDestroyStarted");
    if (a && h) {
      const C = !p || (p == null ? void 0 : p.id) === "driver-dummy-element";
      h(C ? void 0 : p, c, {
        config: s(),
        state: l(),
        driver: _()
      });
      return;
    }
    const m = (c == null ? void 0 : c.onDeselected) || s("onDeselected"), x = s("onDestroyed");
    if (document.body.classList.remove("driver-active", "driver-fade", "driver-simple"), _e(), Te(), Ce(), me(), de(), X(), p && c) {
      const C = p.id === "driver-dummy-element";
      m && m(C ? void 0 : p, c, {
        config: s(),
        state: l(),
        driver: _()
      }), x && x(C ? void 0 : p, c, {
        config: s(),
        state: l(),
        driver: _()
      });
    }
    u && u.focus();
  }
  const y = {
    isActive: () => l("isInitialized") || false,
    refresh: M,
    drive: (a = 0) => {
      r(), v(a);
    },
    setConfig: F,
    setSteps: (a) => {
      X(), F({
        ...s(),
        steps: a
      });
    },
    getConfig: s,
    getState: l,
    getActiveIndex: () => l("activeIndex"),
    isFirstStep: () => l("activeIndex") === 0,
    isLastStep: () => {
      const a = s("steps") || [], p = l("activeIndex");
      return p !== void 0 && p === a.length - 1;
    },
    getActiveStep: () => l("activeStep"),
    getActiveElement: () => l("activeElement"),
    getPreviousElement: () => l("previousElement"),
    getPreviousStep: () => l("previousStep"),
    moveNext: i,
    movePrevious: d,
    moveTo: n,
    hasNextStep: () => {
      const a = s("steps") || [], p = l("activeIndex");
      return p !== void 0 && !!a[p + 1];
    },
    hasPreviousStep: () => {
      const a = s("steps") || [], p = l("activeIndex");
      return p !== void 0 && !!a[p - 1];
    },
    highlight: (a) => {
      r(), j({
        ...a,
        popover: a.popover ? {
          showButtons: [],
          showProgress: false,
          progressText: "",
          ...a.popover
        } : void 0
      });
    },
    destroy: () => {
      g(false);
    }
  };
  return le(y), y;
}
const PLATFORM_DEMOS = [
  {
    name: "Facebook",
    color: "border-blue-500/40 bg-blue-950/30",
    fields: [
      "Title (200 chars)",
      "Condition",
      "Location",
      "Category",
      "Price",
      "Local Pickup"
    ]
  },
  {
    name: "Mercari",
    color: "border-pink-500/40 bg-pink-950/30",
    fields: [
      "Title (80 chars)",
      "Brand",
      "Condition (1–5)",
      "Shipping Type",
      "Delivery Days",
      "Category"
    ]
  },
  {
    name: "eBay",
    color: "border-red-500/40 bg-red-950/30",
    fields: [
      "Title (80 chars)",
      "Condition ID",
      "Price",
      "Quantity",
      "Listing Type",
      "Shipping Service"
    ]
  },
  {
    name: "Poshmark",
    color: "border-rose-500/40 bg-rose-950/30",
    fields: [
      "Title (141 chars)",
      "Brand",
      "Size",
      "Department",
      "Color",
      "Original Price"
    ]
  },
  {
    name: "Depop",
    color: "border-orange-500/40 bg-orange-950/30",
    fields: [
      "Title (70 chars)",
      "Condition",
      "Color",
      "Brand",
      "Size",
      "Gender"
    ]
  },
  {
    name: "Etsy",
    color: "border-amber-500/40 bg-amber-950/30",
    fields: [
      "Title (140 chars)",
      "Tags (×13)",
      "Materials",
      "Who Made",
      "When Made",
      "Is Supply"
    ]
  }
];
const STEPS = [
  {
    number: "01",
    icon: Download,
    id: "download-zip-button",
    title: "Download the Extension",
    description: 'Click "DOWNLOAD EXTENSION (.ZIP)" to save the archive to your computer.',
    color: "text-primary",
    glowClass: "glow-blue-sm neon-border-blue",
    tourTitle: "Step 1 — Download",
    tourDesc: "Click here to download the Copie Past-e extension as a .zip file."
  },
  {
    number: "02",
    icon: Chrome,
    id: "chrome-extensions-link",
    title: "Open Chrome Extensions",
    description: "Navigate to chrome://extensions in your Chrome browser.",
    color: "text-accent",
    glowClass: "glow-yellow-sm neon-border-yellow",
    tourTitle: "Step 2 — Chrome Extensions",
    tourDesc: "Open chrome://extensions (or click the puzzle icon → Manage Extensions)."
  },
  {
    number: "03",
    icon: ToggleRight,
    id: "developer-mode-step",
    title: "Enable Developer Mode",
    description: 'Toggle "Developer mode" ON in the top-right corner of the Extensions page.',
    color: "text-primary",
    glowClass: "glow-blue-sm neon-border-blue",
    tourTitle: "Step 3 — Developer Mode",
    tourDesc: 'Toggle "Developer mode" in the top-right corner. The switch turns blue when active.'
  },
  {
    number: "04",
    icon: MonitorSpeaker,
    id: "load-unpacked-step",
    title: "Load Unpacked Folder",
    description: 'Click "Load unpacked", select the unzipped folder. The icon appears in your toolbar.',
    color: "text-accent",
    glowClass: "glow-yellow-sm neon-border-yellow",
    tourTitle: "Step 4 — Load Unpacked",
    tourDesc: 'Click "Load unpacked" and select the unzipped extension folder. Done!'
  }
];
function ExtensionSetupPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const { data: extConfig } = useQuery({
    queryKey: ["extensionConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.getExtensionConfig();
    },
    enabled
  });
  const cfg = extConfig;
  const version = (cfg == null ? void 0 : cfg.latestVersion) ?? "1.3.1";
  const localDownloadUrl = (cfg == null ? void 0 : cfg.localDownloadUrl) ?? `/copie-paste-extension-v${version}.zip`;
  const mobile = isMobile();
  const [activeStep, setActiveStep] = reactExports.useState(0);
  const [downloaded, setDownloaded] = reactExports.useState(false);
  const [tourCompleted, setTourCompleted] = reactExports.useState(() => {
    try {
      return localStorage.getItem("extension_tour_completed") === "true";
    } catch {
      return false;
    }
  });
  reactExports.useEffect(() => {
    if (downloaded && activeStep === 0) setActiveStep(1);
  }, [downloaded, activeStep]);
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = localDownloadUrl;
    link.download = `copie-paste-extension-v${version}.zip`;
    link.click();
    setDownloaded(true);
    setActiveStep(1);
  };
  const startTour = reactExports.useCallback(() => {
    const driverInstance = Ae({
      animate: true,
      showProgress: true,
      steps: STEPS.map((step) => ({
        element: `#${step.id}`,
        popover: {
          title: step.tourTitle,
          description: step.tourDesc,
          side: "bottom"
        }
      })),
      onDestroyStarted: () => {
        driverInstance.destroy();
        try {
          localStorage.setItem("extension_tour_completed", "true");
        } catch {
        }
        setTourCompleted(true);
      }
    });
    driverInstance.drive();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "extension-setup.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 retro-grid opacity-30 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 scanlines opacity-20 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 w-full bg-card border-b border-primary/20 py-4 px-6 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", "data-ocid": "extension-setup.back_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "gap-2 text-muted-foreground hover:text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Back"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary", strokeWidth: 2.5 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary text-glow-blue tracking-wide", children: "COPIE PAST-E" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-accent/20 text-accent border-accent/40 font-mono text-xs", children: "EXPANSION MODULE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 },
              className: "text-center space-y-4",
              "data-ocid": "extension-setup.hero_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Puzzle, { className: "w-4 h-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary tracking-widest uppercase", children: "Chrome Extension Setup" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-glow-blue", children: "INSTALL THE AUTOFILL MODULE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body max-w-xl mx-auto leading-relaxed", children: "The Copie Past-e extension injects your saved listings directly into marketplace forms across all 6 platforms — zero copy-paste required." }),
                mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded px-4 py-2 mt-2",
                    "data-ocid": "extension-setup.mobile_warning",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-destructive", children: "Mobile detected — extension requires Chrome desktop" })
                    ]
                  }
                )
              ]
            }
          ),
          !mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, scale: 0.97 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.2, duration: 0.5 },
              className: "flex flex-col sm:flex-row items-center justify-center gap-4",
              "data-ocid": "extension-setup.download_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    id: "download-zip-button",
                    onClick: handleDownload,
                    size: "lg",
                    className: "gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-widest text-sm uppercase glow-blue neon-border-blue h-14 px-8 transition-smooth",
                    "data-ocid": "extension-setup.download_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5" }),
                      "Download Extension (.zip)"
                    ]
                  }
                ),
                (cfg == null ? void 0 : cfg.chromeWebStoreUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "lg",
                    asChild: true,
                    className: "gap-3 border-border/50 text-muted-foreground hover:text-foreground h-14 px-8",
                    "data-ocid": "extension-setup.webstore_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        id: "chrome-extensions-link",
                        href: cfg.chromeWebStoreUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
                          "Chrome Web Store"
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "lg",
                    onClick: startTour,
                    className: "gap-3 border-accent/40 text-accent hover:bg-accent/10 h-14 px-6 font-mono text-xs tracking-widest uppercase",
                    "data-ocid": "extension-setup.start_tour_button",
                    children: tourCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                      "Replay Tour"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
                      "Start Tour"
                    ] })
                  }
                ),
                downloaded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 text-green-400 font-mono text-sm",
                    "data-ocid": "extension-setup.download_success",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                      "Downloaded!"
                    ]
                  }
                )
              ]
            }
          ),
          !mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3 },
              "data-ocid": "extension-setup.steps_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground tracking-wide", children: "SIDELOADING GUIDE" }),
                  tourCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-400/20 text-green-400 border-green-400/40 font-mono text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                    "Tour Complete"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === activeStep;
                  const isDone = i < activeStep;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      id: step.id,
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: 0.1 * i },
                      onClick: () => setActiveStep(i),
                      className: `cursor-pointer rounded-lg p-5 flex items-start gap-5 transition-smooth border ${isActive ? `bg-card ${step.glowClass}` : isDone ? "bg-card/40 border-green-400/20" : "bg-card/20 border-border/30 hover:border-border/60"}`,
                      "data-ocid": `extension-setup.step.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: `w-10 h-10 rounded-full border flex items-center justify-center shrink-0 font-mono text-sm font-bold ${isDone ? "border-green-400/50 bg-green-400/10 text-green-400" : isActive ? `border-current ${step.color} bg-current/10` : "border-border/40 text-muted-foreground"}`,
                            children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : step.number
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Icon,
                              {
                                className: `w-4 h-4 ${isActive ? step.color : "text-muted-foreground"}`
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "h3",
                              {
                                className: `font-display text-sm font-bold tracking-wide ${isActive ? "text-foreground" : "text-muted-foreground"}`,
                                children: step.title
                              }
                            ),
                            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/20 text-accent border-accent/40 text-xs font-mono", children: "CURRENT" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: `font-body text-sm leading-relaxed ${isActive ? "text-foreground/80" : "text-muted-foreground/60"}`,
                              children: step.description
                            }
                          ),
                          i === 0 && isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Button,
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                handleDownload();
                              },
                              size: "sm",
                              className: "mt-3 gap-2 bg-primary text-primary-foreground text-xs font-mono",
                              "data-ocid": "extension-setup.step_download_button",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                                "Download Now"
                              ]
                            }
                          )
                        ] })
                      ]
                    },
                    step.number
                  );
                }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sr-only", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: "developer-mode-step", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: "load-unpacked-step", "aria-hidden": "true" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.4 },
              "data-ocid": "extension-setup.platforms_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2 tracking-wide", children: "SUPPORTED PLATFORMS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mb-8", children: "Full field mapping for all 6 marketplaces — every required field autofilled." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: PLATFORM_DEMOS.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 15 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { delay: i * 0.08 },
                    className: `rounded-lg p-4 space-y-3 border ${p.color}`,
                    "data-ocid": `extension-setup.platform.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-foreground tracking-wide", children: p.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: p.fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-primary/60 shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: f })
                      ] }, f)) })
                    ]
                  },
                  p.name
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.6 },
              className: "text-center pb-8",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", "data-ocid": "extension-setup.dashboard_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "lg",
                  className: "gap-2 border-primary/30 text-primary hover:bg-primary/10 font-mono tracking-widest uppercase text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
                    "Proceed to Dashboard"
                  ]
                }
              ) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative z-10 bg-card border-t border-border/40 py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-muted-foreground text-xs font-body", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ". Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : ""
              )}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-primary hover:text-accent transition-smooth hover:underline underline-offset-2",
              children: "caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  ExtensionSetupPage
};
