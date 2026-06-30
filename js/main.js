/* =============================================================
   main.js  •  Portfolio interactivity
   - Mobile nav toggle
   - Navbar scroll state + active link highlight
   - Smooth scrolling for in-page anchors
   - Scroll reveal animations (IntersectionObserver)
   - Animated skill progress bars
   - Typing animation (hero)
   - Back-to-top button
   - Contact form validation
   - Project filtering
   - Footer year
   ============================================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    initMobileMenu();
    initActiveLink();
    initSmoothScroll();
    initScrollReveal();
    initSkillBars();
    initTyping();
    initBackToTop();
    initContactForm();
    initProjectFilter();
    initFooterYear();
  });

  /* ---------------------------------------------------------
     Navbar: add .scrolled after threshold
     --------------------------------------------------------- */
  function initNavbar() {
    var nav = document.querySelector(".navbar");
    if (!nav) return;

    var onScroll = function () {
      if (window.scrollY > 24) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Mobile hamburger menu
     --------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Close menu when a link is clicked
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     Highlight nav link matching current page
     --------------------------------------------------------- */
  function initActiveLink() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var target = href.split("/").pop();
      if (target === current || (current === "" && target === "index.html")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------------------------------------------------------
     Smooth scroll for same-page hash links
     --------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal using IntersectionObserver
     --------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------
     Animate skill progress bars when in view
     --------------------------------------------------------- */
  function initSkillBars() {
    var bars = document.querySelectorAll(".progress-bar");
    if (!bars.length) return;

    var fill = function (bar) {
      var value = bar.getAttribute("data-value") || "0";
      bar.style.width = value + "%";
    };

    if (!("IntersectionObserver" in window)) {
      bars.forEach(fill);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  /* ---------------------------------------------------------
     Typing animation in hero role line
     --------------------------------------------------------- */
  function initTyping() {
    var el = document.querySelector(".typed-text");
    if (!el) return;

    var phrases;
    try {
      phrases = JSON.parse(el.getAttribute("data-words") || "[]");
    } catch (err) {
      phrases = [];
    }
    if (!phrases.length) return;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.textContent = phrases[0];
      return;
    }

    var pi = 0; // phrase index
    var ci = 0; // char index
    var deleting = false;

    function tick() {
      var word = phrases[pi];
      if (deleting) {
        ci--;
      } else {
        ci++;
      }
      el.textContent = word.substring(0, ci);

      var delay = deleting ? 55 : 110;
      if (!deleting && ci === word.length) {
        delay = 1600;            // pause at full word
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 320;
      }
      window.setTimeout(tick, delay);
    }
    tick();
  }

  /* ---------------------------------------------------------
     Back-to-top button
     --------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;

    var onScroll = function () {
      btn.classList.toggle("show", window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Contact form validation (frontend only)
     --------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = form.querySelector(".form-status");

    var fields = {
      name: {
        el: form.querySelector("#name"),
        validate: function (v) {
          if (!v.trim()) return "Please enter your name.";
          if (v.trim().length < 2) return "Name is too short.";
          return "";
        },
      },
      email: {
        el: form.querySelector("#email"),
        validate: function (v) {
          if (!v.trim()) return "Please enter your email.";
          var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(v.trim())) return "Enter a valid email address.";
          return "";
        },
      },
      subject: {
        el: form.querySelector("#subject"),
        validate: function (v) {
          if (!v.trim()) return "Please add a subject.";
          if (v.trim().length < 3) return "Subject is too short.";
          return "";
        },
      },
      message: {
        el: form.querySelector("#message"),
        validate: function (v) {
          if (!v.trim()) return "Please write a message.";
          if (v.trim().length < 10) return "Message should be at least 10 characters.";
          return "";
        },
      },
    };

    function showError(key, msg) {
      var field = fields[key];
      if (!field || !field.el) return;
      var errEl = form.querySelector('[data-error="' + key + '"]');
      if (msg) {
        field.el.classList.add("invalid");
        field.el.setAttribute("aria-invalid", "true");
        if (errEl) errEl.textContent = msg;
      } else {
        field.el.classList.remove("invalid");
        field.el.removeAttribute("aria-invalid");
        if (errEl) errEl.textContent = "";
      }
    }

    // Live validation on blur
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field.el) return;
      field.el.addEventListener("blur", function () {
        showError(key, field.validate(field.el.value));
      });
      field.el.addEventListener("input", function () {
        if (field.el.classList.contains("invalid")) {
          showError(key, field.validate(field.el.value));
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      Object.keys(fields).forEach(function (key) {
        var field = fields[key];
        var msg = field.validate(field.el ? field.el.value : "");
        showError(key, msg);
        if (msg) valid = false;
      });

      if (!status) return;
      status.classList.remove("success", "error");

      if (!valid) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.classList.add("error", "show");
        return;
      }

      // Simulated successful submission (frontend only)
      status.textContent =
        "Thanks! Your message has been validated and is ready to send. " +
        "(This demo form does not connect to a backend.)";
      status.classList.add("success", "show");
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     Project category filtering
     --------------------------------------------------------- */
  function initProjectFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".project-card");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var filter = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var cats = card.getAttribute("data-category") || "";
          var show = filter === "all" || cats.indexOf(filter) !== -1;
          card.classList.toggle("hide", !show);
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Auto-update footer year
     --------------------------------------------------------- */
  function initFooterYear() {
    var el = document.querySelector(".footer-year");
    if (el) el.textContent = String(new Date().getFullYear());
  }
})();
