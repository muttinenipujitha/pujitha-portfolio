// Renders the home page from window.PORTFOLIO.
(function () {
  const P = window.PORTFOLIO;
  const $ = (id) => document.getElementById(id);

  $("gh-link").href = P.github;
  $("summary").textContent = P.summary;

  $("stats").innerHTML = P.stats
    .map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`)
    .join("");

  $("facts").innerHTML = [
    ["based", P.location],
    ["focus", "Agentic AI · Full-stack"],
    ["email", `<a href="mailto:${P.email}">${P.email}</a>`],
    ["github", `<a href="${P.github}" target="_blank" rel="noopener">@muttinenipujitha</a>`],
    ["linkedin", `<a href="${P.linkedin}" target="_blank" rel="noopener">in/muttinenipujitha</a>`],
    ["study", `${esc(P.education.degree)} · ${esc(P.education.grade)}`],
  ]
    .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
    .join("");

  // Typed rotating phrase in the hero.
  const phrases = ["multi-agent systems", "agentic RAG pipelines", "LLM-powered products", "full-stack web apps", "serverless AWS backends"];
  const typed = $("typed");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let i = 0, n = phrases[0].length, del = true;
    (function tick() {
      const w = phrases[i];
      n += del ? -1 : 1;
      typed.textContent = w.slice(0, n);
      let wait = del ? 35 : 70;
      if (!del && n === w.length) { del = true; wait = 1800; }
      else if (del && n === 0) { del = false; i = (i + 1) % phrases.length; wait = 300; }
      setTimeout(tick, wait);
    })();
  }

  // Projects + filters.
  const cats = ["All", ...new Set(P.projects.map((p) => p.category))];
  let active = "All";
  function card(p) {
    return `<a class="project reveal" href="/projects/${p.slug}">
      <div class="meta"><span>${esc(p.category)}${p.featured ? " · Featured" : ""}</span><span>${esc(p.year)}</span></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.tagline)}</p>
      <div class="metrics">${p.metrics.map((m) => `<div><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join("")}</div>
      <div class="tags">${p.stack.slice(0, 5).map((s) => `<span class="chip">${esc(s)}</span>`).join("")}${p.stack.length > 5 ? `<span class="chip">+${p.stack.length - 5}</span>` : ""}</div>
      <span class="read">Read case study →</span>
    </a>`;
  }
  function renderProjects() {
    const list = P.projects
      .filter((p) => active === "All" || p.category === active)
      .sort((a, b) => (b.featured === true) - (a.featured === true));
    $("projects").innerHTML = list.map(card).join("");
    observeReveal();
  }
  $("filters").innerHTML = cats
    .map((c) => `<button class="filter" aria-pressed="${c === active}" data-c="${esc(c)}">${esc(c)} <span style="opacity:.6">${c === "All" ? P.projects.length : P.projects.filter((p) => p.category === c).length}</span></button>`)
    .join("");
  $("filters").addEventListener("click", (e) => {
    const b = e.target.closest(".filter");
    if (!b) return;
    active = b.dataset.c;
    document.querySelectorAll(".filter").forEach((f) => f.setAttribute("aria-pressed", String(f === b)));
    renderProjects();
  });
  renderProjects();

  $("jobs").innerHTML = P.experience
    .map(
      (j) => `<div class="job reveal">
      <div class="when">${esc(j.period)}</div>
      <div>
        <h3>${esc(j.role)} <span>@ ${esc(j.company)}</span></h3>
        <div class="place">${esc(j.place)}</div>
        <ul>${j.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
    </div>`
    )
    .join("");

  $("skill-list").innerHTML = P.skills
    .map(
      (g) => `<div class="card reveal"><h4>${esc(g.group)}</h4>
      <div class="tags">${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>`
    )
    .join("");

  const ed = P.education;
  $("ach").innerHTML =
    P.achievements.map((a) => `<div class="card reveal"><h4>${esc(a.title)}</h4><p>${esc(a.body)}</p></div>`).join("") +
    `<div class="card reveal" style="grid-column:1/-1"><h4>${esc(ed.degree)} · <span class="accent">${esc(ed.grade)}</span></h4>
      <p>${esc(ed.school)} · ${esc(ed.period)}</p></div>`;

  $("contact-cta").innerHTML = `
    <a class="btn primary" href="mailto:${P.email}">${P.email}</a>
    <a class="btn" href="${P.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
    <a class="btn" href="${P.github}" target="_blank" rel="noopener">GitHub</a>`;

  $("foot-links").innerHTML = `<a href="${P.github}" target="_blank" rel="noopener">GitHub</a> · <a href="${P.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="mailto:${P.email}">Email</a>`;

  observeReveal();
})();
