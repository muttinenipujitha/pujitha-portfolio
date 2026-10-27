// Renders one case study. URL shape: /projects/<slug> (rewritten to project.html by vercel.json),
// with ?p=<slug> as a fallback for local file previews.
(function () {
  const P = window.PORTFOLIO;
  const fromPath = location.pathname.match(/\/projects\/([^/?#]+)/);
  const slug = (fromPath && decodeURIComponent(fromPath[1])) || new URLSearchParams(location.search).get("p");
  const i = P.projects.findIndex((p) => p.slug === slug);
  const root = document.getElementById("cs");

  if (i < 0) {
    root.innerHTML = `<section class="cs-hero"><a class="back" href="/#work">← All work</a>
      <h1>Case study not found.</h1><p class="lead">That project doesn't exist, or it moved.</p></section>`;
    return;
  }

  const p = P.projects[i];
  const prev = P.projects[(i - 1 + P.projects.length) % P.projects.length];
  const next = P.projects[(i + 1) % P.projects.length];
  document.title = `${p.title} | Case study · Pujitha.dev`;
  document.querySelector('meta[name="description"]').content = p.tagline;

  const link = p.repo
    ? `<a href="${p.repo}" target="_blank" rel="noopener">View repository ↗</a>`
    : `<a href="${P.github}" target="_blank" rel="noopener">GitHub profile ↗</a>`;

  const sections = [
    ["problem", "The problem", `<p>${rich(p.problem)}</p>`],
    ["approach", "Approach", `<ol class="steps">${p.approach.map((a) => `<li>${rich(a)}</li>`).join("")}</ol>`],
    ["architecture", "Architecture", `<div class="flow">${p.architecture.map((n) => `<div class="node">${esc(n)}</div>`).join('<div class="arrow"></div>')}</div>`],
    ["decisions", "Key decisions", `<div class="decisions">${p.decisions.map((d) => `<div class="card"><h4>${esc(d.title)}</h4><p>${rich(d.body)}</p></div>`).join("")}</div>`],
    ["outcomes", "Outcomes", `<ul class="outcomes">${p.outcomes.map((o) => `<li>${rich(o)}</li>`).join("")}</ul>`],
    ["stack", "Tech stack", `<div style="display:flex;flex-wrap:wrap;gap:8px">${p.stack.map((s) => `<span class="chip" style="color:var(--text);font-size:13px">${esc(s)}</span>`).join("")}</div>`],
  ];

  root.innerHTML = `
    <section class="cs-hero">
      <a class="back" href="/#work">← All work</a>
      <div class="eyebrow">Case study · ${esc(p.category)}</div>
      <h1>${esc(p.title)}</h1>
      <p class="lead">${esc(p.tagline)}</p>
      <dl class="cs-facts">
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
        <div><dt>Stack</dt><dd>${esc(p.stack.slice(0, 3).join(", "))}${p.stack.length > 3 ? "…" : ""}</dd></div>
        <div><dt>Code</dt><dd>${link}</dd></div>
      </dl>
      <div class="cs-metrics">${p.metrics.map((m) => `<div class="card"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join("")}</div>
    </section>
    <div class="cs-body">
      <nav class="toc" aria-label="On this page">${sections.map(([id, t]) => `<a href="#${id}">${t}</a>`).join("")}</nav>
      <article>
        ${sections.map(([id, t, body], k) => `<section class="cs-section reveal" id="${id}"><h2><small>0${k + 1}</small>${t}</h2>${body}</section>`).join("")}
      </article>
    </div>
    <div class="next-prev">
      <a class="card" href="/projects/${prev.slug}"><small>← Previous</small><div>${esc(prev.title)}</div></a>
      <a class="card r" href="/projects/${next.slug}"><small>Next →</small><div>${esc(next.title)}</div></a>
    </div>`;

  // Highlight the current TOC entry.
  const tocLinks = [...document.querySelectorAll(".toc a")];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll(".cs-section").forEach((s) => io.observe(s));
  }
  observeReveal();
})();
