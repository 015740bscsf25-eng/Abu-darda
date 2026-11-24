(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  /* ── Mobile navigation dropdown ── */
  var shell = document.querySelector(".nav-shell");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("primary-menu");

  function setMenu(open) {
    if (!shell || !toggle) return;
    shell.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }

  if (toggle && shell && menu) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!shell.classList.contains("menu-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (shell.classList.contains("menu-open") && !shell.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && shell.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* ── Navbar background on scroll ── */
  var navbar = document.querySelector(".navbar");
  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Project filters ── */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projects = document.querySelectorAll(".project-card");
  var empty = document.querySelector(".empty-state");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      var shown = 0;
      projects.forEach(function (card) {
        var match = f === "all" || card.getAttribute("data-category") === f;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.classList.toggle("show", shown === 0);
    });
  });

  /* ── Image fallback (missing project screenshots) ── */
  function showFallback(img) {
    var wrap = img.parentElement;
    if (!wrap || wrap.querySelector(".img-fallback")) return;
    img.style.display = "none";
    var box = document.createElement("div");
    box.className = "img-fallback";
    box.textContent = img.getAttribute("data-fallback") || img.alt || "Preview";
    wrap.appendChild(box);
  }
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) showFallback(img);
    img.addEventListener("error", function () { showFallback(img); });
  });

  /* ── Reveal on scroll ── */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add("in");
          io.unobserve(el);
          // after the entrance finishes, hand transitions back to normal hover styles
          setTimeout(function () {
            el.style.transitionDelay = "";
            el.classList.add("done");
          }, 1100);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min((i % 6) * 70, 350) + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Card spotlight follows cursor ── */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ── Current year in footer ── */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
