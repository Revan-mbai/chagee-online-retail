/* Deck engine: scaling, navigation, chapter rail, speaker notes, print.
   Each slide's own <script> runs its explainer. The engine tells a slide when it is shown or left
   ("slideenter" / "slideleave" events on the <section>) and before printing ("deckprint"), so the
   slide can settle into its default state, which must read correctly as a static page. */
(function () {
  "use strict";
  const $ = (r, s) => r.querySelector(s), $$ = (r, s) => [...r.querySelectorAll(s)];
  const Q = new URLSearchParams(location.search), PRINT = Q.has("print");
  const deck = $(document, "#deck"), slides = $$(document, ".slide");
  const chapters = [...new Set(slides.map(s => s.dataset.chapter).filter(Boolean))];
  let cur = -1;

  slides.forEach((s, i) => {
    const pg = $(s, ".pg"); if (pg) pg.textContent = i + 1;
    const rail = $(s, ".rail");
    if (rail) {
      const at = chapters.indexOf(s.dataset.chapter);
      rail.innerHTML = chapters.map((c, k) => `<span class="${k === at ? "cur" : k < at ? "past" : ""}">${c}</span>`).join("");
    }
  });

  function fit() {
    if (PRINT) return;
    const nw = document.body.classList.contains("shownotes") ? 380 : 0;
    const W = innerWidth - nw, H = innerHeight, s = Math.min(W / 1280, H / 720);
    deck.style.left = `${W / 2}px`;
    deck.style.transform = `translate(${-640 * s}px,${-360 * s}px) scale(${s})`;
  }
  function show(i) {
    const n = Math.max(0, Math.min(slides.length - 1, i));
    if (n === cur) return;
    if (cur >= 0) slides[cur].dispatchEvent(new CustomEvent("slideleave"));
    cur = n;
    slides.forEach((s, k) => s.classList.toggle("active", k === cur));
    const gt = $(document, "#goto"); if (document.activeElement !== gt) gt.value = cur + 1;
    $(document, "#count .tot").textContent = `/ ${slides.length}`;
    const notes = $(slides[cur], "aside.notes");
    $(document, "#notes .nb").innerHTML = notes ? notes.innerHTML : "";
    history.replaceState(null, "", `${location.search}#${cur + 1}`);
    slides[cur].dispatchEvent(new CustomEvent("slideenter"));
  }
  const next = () => show(cur + 1), prev = () => show(cur - 1);

  const toast = m => { const t = $(document, "#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("on"), 2000); };
  const toggleNotes = () => { document.body.classList.toggle("shownotes"); $(document, "#notesb").classList.toggle("on", document.body.classList.contains("shownotes")); fit(); };
  const toggleFull = () => { try { const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); p && p.catch && p.catch(() => {}); } catch (e) {} };
  const preparePrint = () => slides.forEach(s => s.dispatchEvent(new CustomEvent("deckprint")));

  $(document, "#prev").onclick = prev;
  $(document, "#next").onclick = next;
  $(document, "#notesb").onclick = toggleNotes;
  $(document, "#printb").onclick = () => { preparePrint(); window.print(); };
  $(document, "#fs").onclick = toggleFull;
  if (!document.fullscreenEnabled) $(document, "#fs").style.display = "none";
  document.addEventListener("fullscreenchange", () => setTimeout(fit, 50));
  addEventListener("beforeprint", preparePrint);
  addEventListener("resize", fit);

  (function gotoBox() {
    const gt = $(document, "#goto"), reset = () => { gt.value = cur + 1; gt.classList.remove("bad"); };
    gt.addEventListener("focus", () => gt.select());
    gt.addEventListener("input", () => { gt.value = gt.value.replace(/\D/g, "").slice(0, 2); gt.classList.remove("bad"); });
    gt.addEventListener("keydown", e => {
      e.stopPropagation();
      if (e.key === "Enter") { const n = parseInt(gt.value, 10);
        if (n >= 1 && n <= slides.length) { show(n - 1); gt.blur(); } else { gt.classList.add("bad"); gt.select(); } }
      else if (e.key === "Escape") { reset(); gt.blur(); }
    });
    gt.addEventListener("blur", reset);
  })();

  addEventListener("keydown", e => {
    if (e.target.isContentEditable || e.target.closest?.("input,select,textarea")) return;
    if (["ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && e.target.tagName !== "BUTTON")) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === "Home") show(0);
    else if (e.key === "End") show(slides.length - 1);
    else if (e.key === "n" || e.key === "N") toggleNotes();
    else if (e.key === "f" || e.key === "F") toggleFull();
    else if (e.key === "p" || e.key === "P") { preparePrint(); window.print(); }
    else if (e.key === "g" || e.key === "G") { e.preventDefault(); $(document, "#goto").focus(); }
  });
  let idle; const wake = () => { document.body.classList.remove("idle"); clearTimeout(idle); idle = setTimeout(() => document.body.classList.add("idle"), 2500); };
  addEventListener("mousemove", wake); addEventListener("keydown", wake); wake();
  addEventListener("hashchange", () => show((parseInt(location.hash.slice(1), 10) || 1) - 1));

  if (PRINT) { document.body.classList.add("print"); preparePrint(); }
  else { fit(); show((parseInt(location.hash.slice(1), 10) || 1) - 1); }
  window.Deck = { show, next, prev, toast, get current() { return cur; } };
})();
