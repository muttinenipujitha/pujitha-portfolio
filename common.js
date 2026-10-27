// Shared behaviour for every page: theme, mobile menu, scroll reveal, footer year.
(function () {
  const root = document.documentElement;
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function current() {
    return root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  }
  function paint() {
    const btn = document.getElementById("theme");
    if (btn) btn.innerHTML = current() === "dark" ? sun : moon;
  }

  document.addEventListener("DOMContentLoaded", () => {
    paint();
    const themeBtn = document.getElementById("theme");
    themeBtn &&
      themeBtn.addEventListener("click", () => {
        const next = current() === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch (e) {}
        paint();
      });

    const menuBtn = document.getElementById("menu");
    const links = document.querySelector(".nav-links");
    menuBtn &&
      menuBtn.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
    links && links.addEventListener("click", (e) => e.target.closest("a") && links.classList.remove("open"));

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });

  window.observeReveal = function () {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
  };

  window.esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Escape, then render `inline code`.
  window.rich = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
})();
