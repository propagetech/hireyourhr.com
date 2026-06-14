/* Hire Your HR - progressive enhancement only. The site is fully usable with JS off. */
(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".icon-open").style.display = open ? "none" : "block";
      toggle.querySelector(".icon-close").style.display = open ? "block" : "none";
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close when a nav link is chosen (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.matchMedia("(max-width: 900px)").matches) {
        setOpen(false);
      }
    });

    // Reset state when crossing the desktop breakpoint
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- FAQ: keep only one item open at a time (enhancement) ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Contact: compose a mailto from the visitor's own mail app ----- */
  /* No data is sent or stored anywhere; this only opens the user's email app. */
  var form = document.getElementById("contact-helper");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-to") || "info@hireyourhr.com";
      var name = (form.querySelector("#cf-name") || {}).value || "";
      var org = (form.querySelector("#cf-org") || {}).value || "";
      var topic = (form.querySelector("#cf-topic") || {}).value || "";
      var msg = (form.querySelector("#cf-message") || {}).value || "";

      var subject = "HR enquiry from " + (name || "website") + (org ? " (" + org + ")" : "");
      var bodyLines = [
        "Name: " + name,
        "Business: " + org,
        "I am interested in: " + topic,
        "",
        msg
      ];
      var href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));
      window.location.href = href;
    });
  }
})();
