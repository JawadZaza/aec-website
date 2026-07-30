/* Applied Engineering Club — site renderer
   Fetches /data/*.json and builds the page. Edit content via the CMS
   at /admin, not by editing this file. */

const DATA_PATHS = {
  settings: "data/site-settings.json",
  sections: "data/sections-config.json",
  events: "data/events.json",
  officers: "data/officers.json",
  competitions: "data/competitions.json",
  gallery: "data/gallery.json"
};

const ICONS = {
  instagram:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.59 1.8c.46-.16 1.26-.35 2.43-.4C9.29 1.34 9.67 1.33 12.87 1.33H12Zm0 1.98c-3.15 0-3.5.01-4.73.07-1.05.05-1.62.22-2 .37-.5.19-.86.42-1.24.8-.38.38-.6.74-.8 1.24-.15.38-.32.95-.37 2-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.05 1.05.22 1.62.37 2 .19.5.42.86.8 1.24.38.38.74.6 1.24.8.38.15.95.32 2 .37 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c1.05-.05 1.62-.22 2-.37.5-.19.86-.42 1.24-.8.38-.38.6-.74.8-1.24.15-.38.32-.95.37-2 .06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.05-1.05-.22-1.62-.37-2a3.2 3.2 0 0 0-.8-1.24 3.2 3.2 0 0 0-1.24-.8c-.38-.15-.95-.32-2-.37-1.23-.06-1.58-.07-4.73-.07ZM12 6.87A5.13 5.13 0 1 1 6.87 12 5.13 5.13 0 0 1 12 6.87Zm0 1.98A3.15 3.15 0 1 0 15.15 12 3.15 3.15 0 0 0 12 8.85Zm5.34-2.03a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2Z"/></svg>',
  discord:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.32 4.79A18.5 18.5 0 0 0 15.7 3.3a.07.07 0 0 0-.08.04c-.2.36-.43.83-.58 1.2a17.1 17.1 0 0 0-5.08 0 8.4 8.4 0 0 0-.6-1.2.07.07 0 0 0-.07-.04 18.4 18.4 0 0 0-4.62 1.49.07.07 0 0 0-.03.03C1.5 9.1.8 13.28 1.14 17.4a.08.08 0 0 0 .03.05 18.6 18.6 0 0 0 5.6 2.87.07.07 0 0 0 .08-.03c.43-.6.82-1.24 1.15-1.9a.07.07 0 0 0-.04-.1 12.2 12.2 0 0 1-1.75-.85.07.07 0 0 1-.01-.12c.12-.09.23-.18.35-.27a.07.07 0 0 1 .07-.01c3.67 1.7 7.65 1.7 11.28 0a.07.07 0 0 1 .07.01c.12.1.23.18.35.27a.07.07 0 0 1-.01.12c-.56.33-1.14.6-1.75.85a.07.07 0 0 0-.04.1c.34.66.73 1.3 1.15 1.9a.07.07 0 0 0 .08.03 18.5 18.5 0 0 0 5.61-2.87.07.07 0 0 0 .03-.05c.4-4.76-.67-8.9-2.83-12.58a.06.06 0 0 0-.03-.03ZM8.68 14.8c-1.1 0-2-1.03-2-2.29s.88-2.28 2-2.28 2.02 1.03 2 2.28c0 1.26-.89 2.29-2 2.29Zm6.65 0c-1.1 0-2-1.03-2-2.29s.88-2.28 2-2.28 2.02 1.03 2 2.28c0 1.26-.88 2.29-2 2.29Z"/></svg>'
};

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusClass(status) {
  return "status-" + String(status).toLowerCase().trim().replace(/\s+/g, "-");
}

/* ---------- Header ---------- */
function renderHeader(settings) {
  document.getElementById("header-club-name").textContent = settings.clubName;
  document.getElementById("header-logo").src = settings.logo;
  document.getElementById("header-logo").alt = settings.clubName + " logo";
  document.title = settings.clubName + " — Fullerton College";
}

function renderNav(visibleSectionIds) {
  const navLabels = {
    hero: "Home",
    gallery: "Gallery",
    events: "Events",
    officers: "Officers",
    competitions: "Competitions",
    join: "Join",
    "meeting-info": "Meetings",
    socials: "Socials"
  };
  const anchorable = new Set(["hero", "gallery", "events", "officers", "competitions", "meeting-info", "socials"]);

  const list = document.getElementById("main-nav-list");
  const mobile = document.getElementById("mobile-nav");
  list.innerHTML = "";
  mobile.innerHTML = "";

  visibleSectionIds
    .filter((id) => anchorable.has(id))
    .forEach((id) => {
      const href = id === "hero" ? "#top" : "#section-" + id;
      const label = navLabels[id] || id;

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      li.appendChild(a);
      list.appendChild(li);

      const mobileLink = document.createElement("a");
      mobileLink.href = href;
      mobileLink.textContent = label;
      mobileLink.addEventListener("click", () => mobile.classList.remove("open"));
      mobile.appendChild(mobileLink);
    });
}

function setupMobileNavToggle() {
  const btn = document.getElementById("nav-toggle");
  const mobile = document.getElementById("mobile-nav");
  btn.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* ---------- Announcement banner ---------- */
function renderBanner(settings) {
  const bar = document.getElementById("announcement-banner");
  const banner = settings.banner || {};
  const dismissed = sessionStorage.getItem("aec-banner-dismissed") === (banner.text || "");

  if (!banner.enabled || !banner.text || dismissed) {
    bar.classList.add("hidden");
    return;
  }

  const inner = document.createElement("div");
  inner.className = "banner-inner";

  const textWrap = document.createElement("span");
  if (banner.link) {
    const link = document.createElement("a");
    link.className = "banner-link";
    link.href = banner.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = banner.text;
    textWrap.appendChild(link);
  } else {
    textWrap.textContent = banner.text;
  }
  inner.appendChild(textWrap);

  const closeBtn = document.createElement("button");
  closeBtn.className = "banner-close";
  closeBtn.setAttribute("aria-label", "Dismiss announcement");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    sessionStorage.setItem("aec-banner-dismissed", banner.text);
    bar.classList.add("hidden");
  });
  inner.appendChild(closeBtn);

  bar.innerHTML = "";
  bar.appendChild(inner);
  bar.classList.remove("hidden");
}

/* ---------- Section renderers ---------- */
function renderHero(settings) {
  const node = document.getElementById("tpl-hero").content.cloneNode(true);
  node.getElementById("hero-club-name").textContent = settings.clubName;
  node.getElementById("hero-tagline").textContent = settings.tagline || "";
  node.getElementById("hero-join-btn").href = settings.joinFormUrl || "#";

  const socials = node.getElementById("hero-socials");
  const s = settings.socials || {};
  if (s.instagram) socials.appendChild(makeIconLink(s.instagram, "Instagram", ICONS.instagram));
  if (s.discord) socials.appendChild(makeIconLink(s.discord, "Discord", ICONS.discord));

  return node;
}

function makeIconLink(href, label, iconSvg) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.className = "social-icon";
  a.setAttribute("aria-label", label);
  a.innerHTML = iconSvg;
  return a;
}

function renderGallery(items) {
  const node = document.getElementById("tpl-gallery").content.cloneNode(true);
  const grid = node.getElementById("gallery-grid");

  if (!items.length) {
    grid.appendChild(el(`<p class="empty-state">Photos coming soon — check back after our next event.</p>`));
    return node;
  }

  items.forEach((item) => {
    const card = el(`
      <figure class="card gallery-card">
        <img src="${item.photo}" alt="${escapeHtml(item.caption || "")}" loading="lazy">
        <figcaption class="gallery-caption">${escapeHtml(item.caption || "")}</figcaption>
      </figure>
    `);
    grid.appendChild(card);
  });
  return node;
}

function renderEvents(items) {
  const node = document.getElementById("tpl-events").content.cloneNode(true);
  const grid = node.getElementById("events-grid");
  const sorted = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!sorted.length) {
    grid.appendChild(el(`<p class="empty-state">No events scheduled right now — check back soon!</p>`));
    return node;
  }

  sorted.forEach((ev) => {
    const card = el(`
      <article class="card event-card">
        <div class="card-body">
          <span class="event-date">${formatDate(ev.date)}</span>
          <h3>${escapeHtml(ev.title)}</h3>
          <div class="event-meta">
            <span>&#128337; ${escapeHtml(ev.time || "")}</span>
            <span>&#128205; ${escapeHtml(ev.location || "")}</span>
          </div>
          <p>${escapeHtml(ev.description || "")}</p>
        </div>
      </article>
    `);
    grid.appendChild(card);
  });
  return node;
}

function renderOfficers(items) {
  const node = document.getElementById("tpl-officers").content.cloneNode(true);
  const grid = node.getElementById("officers-grid");

  if (!items.length) {
    grid.appendChild(el(`<p class="empty-state">Officer info coming soon.</p>`));
    return node;
  }

  items.forEach((o) => {
    const card = el(`
      <article class="card officer-card">
        <img src="${o.photo}" alt="${escapeHtml(o.name)}" loading="lazy">
        <div class="card-body">
          <h3>${escapeHtml(o.name)}</h3>
          <div class="officer-role">${escapeHtml(o.role)}</div>
          <p>${escapeHtml(o.bio || "")}</p>
        </div>
      </article>
    `);
    grid.appendChild(card);
  });
  return node;
}

function renderCompetitions(items) {
  const node = document.getElementById("tpl-competitions").content.cloneNode(true);
  const grid = node.getElementById("competitions-grid");

  if (!items.length) {
    grid.appendChild(el(`<p class="empty-state">No competitions listed right now.</p>`));
    return node;
  }

  items.forEach((c) => {
    const card = el(`
      <article class="card competition-card">
        <div class="card-body">
          <span class="status-badge ${statusClass(c.status)}">${escapeHtml(c.status)}</span>
          <h3>${escapeHtml(c.name)}</h3>
          <p>${escapeHtml(c.description || "")}</p>
          <div class="competition-date">${c.date ? formatDate(c.date) : ""}</div>
        </div>
      </article>
    `);
    grid.appendChild(card);
  });
  return node;
}

function renderJoin(settings) {
  const node = document.getElementById("tpl-join").content.cloneNode(true);
  node.getElementById("join-form-btn").href = settings.joinFormUrl || "#";
  return node;
}

function renderMeetingInfo(settings) {
  const node = document.getElementById("tpl-meeting-info").content.cloneNode(true);
  const m = settings.meeting || {};
  node.getElementById("meeting-day").textContent = m.day || "TBD";
  node.getElementById("meeting-time").textContent = m.time || "TBD";
  node.getElementById("meeting-location").textContent = m.location || "TBD";
  const notesEl = node.getElementById("meeting-notes");
  if (m.notes) {
    notesEl.textContent = m.notes;
  } else {
    notesEl.remove();
  }
  return node;
}

function renderSocials(settings) {
  const node = document.getElementById("tpl-socials").content.cloneNode(true);
  const row = node.getElementById("socials-row");
  const s = settings.socials || {};

  if (s.instagram) {
    row.appendChild(el(`
      <a class="social-btn instagram" href="${s.instagram}" target="_blank" rel="noopener">
        ${ICONS.instagram} Instagram
      </a>
    `));
  }
  if (s.discord) {
    row.appendChild(el(`
      <a class="social-btn discord" href="${s.discord}" target="_blank" rel="noopener">
        ${ICONS.discord} Discord
      </a>
    `));
  }
  if (!s.instagram && !s.discord) {
    row.appendChild(el(`<p class="empty-state">Social links coming soon.</p>`));
  }
  return node;
}

/* ---------- Footer ---------- */
function renderFooter(settings) {
  const footer = document.getElementById("site-footer");
  const s = settings.socials || {};
  const m = settings.meeting || {};

  footer.innerHTML = "";
  footer.appendChild(el(`
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="${settings.logo}" alt="${escapeHtml(settings.clubName)} logo">
        <strong>${escapeHtml(settings.clubName)}</strong>
        <p>Fullerton College</p>
      </div>
      <div class="footer-col">
        <h4>Meetings</h4>
        <div>
          ${escapeHtml(m.day || "")}<br>
          ${escapeHtml(m.time || "")}<br>
          ${escapeHtml(m.location || "")}
        </div>
      </div>
      <div class="footer-col">
        <h4>Follow Us</h4>
        <div class="footer-socials">
          ${s.instagram ? `<a class="social-icon" href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>` : ""}
          ${s.discord ? `<a class="social-icon" href="${s.discord}" target="_blank" rel="noopener" aria-label="Discord">${ICONS.discord}</a>` : ""}
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      This is the Applied Engineering Club's own student-run page and is not an official Fullerton College website.
      &copy; ${new Date().getFullYear()} ${escapeHtml(settings.clubName)}.
    </div>
  `));
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

/* ---------- Boot ---------- */
const SECTION_RENDERERS = {
  hero: (data) => renderHero(data.settings),
  gallery: (data) => renderGallery(data.gallery),
  events: (data) => renderEvents(data.events),
  officers: (data) => renderOfficers(data.officers),
  competitions: (data) => renderCompetitions(data.competitions),
  join: (data) => renderJoin(data.settings),
  "meeting-info": (data) => renderMeetingInfo(data.settings),
  socials: (data) => renderSocials(data.settings)
};

async function boot() {
  const root = document.getElementById("sections-root");
  try {
    const [settings, sectionsFile, eventsFile, officersFile, competitionsFile, galleryFile] = await Promise.all([
      loadJSON(DATA_PATHS.settings),
      loadJSON(DATA_PATHS.sections),
      loadJSON(DATA_PATHS.events),
      loadJSON(DATA_PATHS.officers),
      loadJSON(DATA_PATHS.competitions),
      loadJSON(DATA_PATHS.gallery)
    ]);

    const data = {
      settings,
      events: eventsFile.events,
      officers: officersFile.officers,
      competitions: competitionsFile.competitions,
      gallery: galleryFile.gallery
    };

    renderBanner(settings);
    renderHeader(settings);
    setupMobileNavToggle();

    // Array order in sections.json IS the display order (drag to reorder in the CMS).
    const visible = sectionsFile.sections.filter((s) => s.visible);

    renderNav(visible.map((s) => s.id));

    root.innerHTML = "";
    visible.forEach((s) => {
      const renderer = SECTION_RENDERERS[s.id];
      if (renderer) root.appendChild(renderer(data));
    });

    renderFooter(settings);
  } catch (err) {
    console.error(err);
    root.innerHTML = `<p class="section-error">Something went wrong loading the page content. Please refresh, or check back later.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", boot);
