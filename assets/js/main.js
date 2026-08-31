/* Applied Engineering Club — site renderer
   Fetches /data/*.json and builds the page. Edit content via the CMS
   at /admin, not by editing this file. */

const DATA_PATHS = {
  settings: "data/site-settings.json",
  sections: "data/sections-config.json",
  events: "data/events.json",
  officers: "data/officers.json",
  advisors: "data/advisors.json",
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
  document.getElementById("header-logo").src = imgPath(settings.logo);
  document.getElementById("header-logo").alt = settings.clubName + " logo";
  document.title = settings.clubName + " — Fullerton College";

  const favicon = document.getElementById("favicon");
  if (favicon) favicon.href = imgPath(settings.logo);
}

function renderNav(visibleSectionIds) {
  const navLabels = {
    hero: "Home",
    gallery: "Gallery",
    events: "Events",
    officers: "Board",
    advisors: "Advisors",
    competitions: "Competitions",
    join: "Join",
    "meeting-info": "Meetings",
    socials: "Socials"
  };
  const anchorable = new Set(["hero", "gallery", "events", "officers", "advisors", "competitions", "meeting-info", "socials"]);

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
  node.getElementById("hero-logo").src = imgPath(settings.logo);
  node.getElementById("hero-logo").alt = settings.clubName + " logo";
  node.getElementById("hero-club-name").textContent = settings.clubName;
  node.getElementById("hero-tagline").textContent = settings.tagline || "";
  node.getElementById("hero-join-btn").href = settings.joinFormUrl || "#";

  const bannerImage = settings.hero && settings.hero.backgroundImage;
  if (bannerImage) {
    const heroSection = node.getElementById("section-hero");
    heroSection.style.backgroundImage =
      `linear-gradient(rgba(15, 64, 107, 0.75), rgba(15, 64, 107, 0.75)), url("${imgPath(bannerImage)}")`;
  }

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

  items.forEach((item, index) => {
    const card = el(`
      <figure class="card gallery-card" tabindex="0" role="button" aria-haspopup="dialog">
        <img src="${imgPath(item.photo)}" alt="${escapeHtml(item.caption || "")}" loading="lazy">
        <figcaption class="gallery-caption">${escapeHtml(item.caption || "")}</figcaption>
      </figure>
    `);
    card.addEventListener("click", () => openGalleryLightbox(items, index, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openGalleryLightbox(items, index, card);
      }
    });
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

function renderPersonGrid(items, templateId, gridId, emptyMessage) {
  const node = document.getElementById(templateId).content.cloneNode(true);
  const grid = node.getElementById(gridId);

  if (!items.length) {
    grid.appendChild(el(`<p class="empty-state">${emptyMessage}</p>`));
    return node;
  }

  grid.style.setProperty("--officer-count", items.length);

  items.forEach((o) => {
    const card = el(`
      <article class="card officer-card" tabindex="0" role="button" aria-haspopup="dialog">
        <img src="${imgPath(o.photo)}" alt="${escapeHtml(o.name)}" loading="lazy">
        <div class="card-body">
          <h3>${escapeHtml(o.name)}</h3>
          <div class="officer-role">${escapeHtml(o.role)}</div>
          <p>${escapeHtml(o.bio || "")}</p>
          <span class="officer-more">View Profile</span>
        </div>
      </article>
    `);
    card.addEventListener("click", () => openOfficerModal(o, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openOfficerModal(o, card);
      }
    });
    grid.appendChild(card);
  });
  return node;
}

function renderOfficers(items) {
  return renderPersonGrid(items, "tpl-officers", "officers-grid", "Board info coming soon.");
}

function renderAdvisors(items) {
  return renderPersonGrid(items, "tpl-advisors", "advisors-grid", "Advisor info coming soon.");
}

/* Animates a modal's content growing from the card that opened it (and
   shrinking back into it on close), instead of just appearing centered. */
function presentModal(overlay, originEl) {
  document.body.appendChild(overlay);
  document.body.classList.add("modal-open");
  overlay._originEl = originEl || null;

  const content = overlay.querySelector(".modal-content");
  if (!originEl || !content) return;

  const first = originEl.getBoundingClientRect();
  overlay.style.opacity = "0";
  content.style.transition = "none";
  content.style.opacity = "0.6";

  const last = content.getBoundingClientRect();
  const dx = first.left + first.width / 2 - (last.left + last.width / 2);
  const dy = first.top + first.height / 2 - (last.top + last.height / 2);
  const scaleX = first.width / last.width;
  const scaleY = first.height / last.height;
  content.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;

  content.offsetHeight; // force reflow so the starting position registers

  // Double rAF: guarantees the browser has painted the starting position
  // before the transition kicks in, so the grow-to-center effect isn't
  // skipped on the first frame.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = "opacity 0.2s ease";
      content.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease";
      overlay.style.opacity = "1";
      content.style.transform = "none";
      content.style.opacity = "1";
    });
  });
}

function dismissModal(overlay) {
  if (!overlay) return;
  const content = overlay.querySelector(".modal-content");
  const originEl = overlay._originEl;

  const cleanup = () => {
    overlay.remove();
    document.body.classList.remove("modal-open");
  };

  if (!originEl || !content) {
    cleanup();
    return;
  }

  const first = originEl.getBoundingClientRect();
  const last = content.getBoundingClientRect();
  const dx = first.left + first.width / 2 - (last.left + last.width / 2);
  const dy = first.top + first.height / 2 - (last.top + last.height / 2);
  const scaleX = first.width / last.width;
  const scaleY = first.height / last.height;

  content.style.transition = "transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease";
  overlay.style.transition = "opacity 0.2s ease";
  content.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  content.style.opacity = "0";
  overlay.style.opacity = "0";

  setTimeout(cleanup, 250);
}

let officerModalLastFocused = null;

function openOfficerModal(o, originEl) {
  closeOfficerModal();
  officerModalLastFocused = document.activeElement;

  const overlay = el(`
    <div class="modal-overlay" id="officer-modal" role="dialog" aria-modal="true">
      <div class="modal-content officer-modal-content">
        <button class="modal-close" aria-label="Close">&times;</button>
        <img src="${imgPath(o.photo)}" alt="${escapeHtml(o.name)}">
        <div class="modal-body">
          <h3>${escapeHtml(o.name)}</h3>
          <div class="officer-role">${escapeHtml(o.role)}</div>
          <p>${escapeHtml(o.bio || "")}</p>
        </div>
      </div>
    </div>
  `);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOfficerModal();
  });
  overlay.querySelector(".modal-close").addEventListener("click", closeOfficerModal);
  document.addEventListener("keydown", handleOfficerModalKeydown);

  presentModal(overlay, originEl);
  overlay.querySelector(".modal-close").focus();
}

function handleOfficerModalKeydown(e) {
  if (e.key === "Escape") closeOfficerModal();
}

function closeOfficerModal() {
  const overlay = document.getElementById("officer-modal");
  if (!overlay) return;
  dismissModal(overlay);
  document.removeEventListener("keydown", handleOfficerModalKeydown);
  if (officerModalLastFocused) officerModalLastFocused.focus();
}

/* ---------- Gallery lightbox ---------- */
let lightboxItems = [];
let lightboxIndex = 0;
let lightboxLastFocused = null;

function openGalleryLightbox(items, index, originEl) {
  closeGalleryLightbox();
  lightboxItems = items;
  lightboxIndex = index;
  lightboxLastFocused = document.activeElement;

  const overlay = el(`
    <div class="modal-overlay" id="gallery-lightbox" role="dialog" aria-modal="true">
      <div class="modal-content lightbox-content">
        <button class="modal-close" aria-label="Close">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#10094;</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next photo">&#10095;</button>
        <img id="lightbox-img" src="" alt="">
        <div class="modal-body lightbox-body">
          <p id="lightbox-caption"></p>
          <span id="lightbox-counter" class="lightbox-counter"></span>
        </div>
      </div>
    </div>
  `);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeGalleryLightbox();
  });
  overlay.querySelector(".modal-close").addEventListener("click", closeGalleryLightbox);
  overlay.querySelector(".lightbox-prev").addEventListener("click", () => showLightboxPhoto(lightboxIndex - 1));
  overlay.querySelector(".lightbox-next").addEventListener("click", () => showLightboxPhoto(lightboxIndex + 1));
  document.addEventListener("keydown", handleLightboxKeydown);

  presentModal(overlay, originEl);
  showLightboxPhoto(index);
  overlay.querySelector(".modal-close").focus();
}

function showLightboxPhoto(index) {
  const count = lightboxItems.length;
  lightboxIndex = (index + count) % count;
  const item = lightboxItems[lightboxIndex];
  document.getElementById("lightbox-img").src = imgPath(item.photo);
  document.getElementById("lightbox-img").alt = item.caption || "";
  document.getElementById("lightbox-caption").textContent = item.caption || "";
  document.getElementById("lightbox-counter").textContent = `${lightboxIndex + 1} / ${count}`;

  const overlay = document.getElementById("gallery-lightbox");
  const showNav = count > 1;
  overlay.querySelector(".lightbox-prev").classList.toggle("hidden", !showNav);
  overlay.querySelector(".lightbox-next").classList.toggle("hidden", !showNav);
}

function handleLightboxKeydown(e) {
  if (e.key === "Escape") closeGalleryLightbox();
  if (e.key === "ArrowLeft") showLightboxPhoto(lightboxIndex - 1);
  if (e.key === "ArrowRight") showLightboxPhoto(lightboxIndex + 1);
}

function closeGalleryLightbox() {
  const overlay = document.getElementById("gallery-lightbox");
  if (!overlay) return;
  dismissModal(overlay);
  document.removeEventListener("keydown", handleLightboxKeydown);
  if (lightboxLastFocused) lightboxLastFocused.focus();
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
      <article class="card competition-card" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="card-body">
          <span class="status-badge ${statusClass(c.status)}">${escapeHtml(c.status)}</span>
          <h3>${escapeHtml(c.name)}</h3>
          <p>${escapeHtml(c.description || "")}</p>
          <div class="competition-date">${c.date ? formatDate(c.date) : ""}</div>
          <span class="officer-more">View Details</span>
        </div>
      </article>
    `);
    card.addEventListener("click", () => openCompetitionModal(c, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCompetitionModal(c, card);
      }
    });
    grid.appendChild(card);
  });
  return node;
}

let competitionModalLastFocused = null;

function openCompetitionModal(c, originEl) {
  closeCompetitionModal();
  competitionModalLastFocused = document.activeElement;

  const overlay = el(`
    <div class="modal-overlay" id="competition-modal" role="dialog" aria-modal="true">
      <div class="modal-content officer-modal-content">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="modal-body">
          <span class="status-badge ${statusClass(c.status)}">${escapeHtml(c.status)}</span>
          <h3>${escapeHtml(c.name)}</h3>
          <p>${escapeHtml(c.description || "")}</p>
          <div class="competition-date">${c.date ? formatDate(c.date) : ""}</div>
        </div>
      </div>
    </div>
  `);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeCompetitionModal();
  });
  overlay.querySelector(".modal-close").addEventListener("click", closeCompetitionModal);
  document.addEventListener("keydown", handleCompetitionModalKeydown);

  presentModal(overlay, originEl);
  overlay.querySelector(".modal-close").focus();
}

function handleCompetitionModalKeydown(e) {
  if (e.key === "Escape") closeCompetitionModal();
}

function closeCompetitionModal() {
  const overlay = document.getElementById("competition-modal");
  if (!overlay) return;
  dismissModal(overlay);
  document.removeEventListener("keydown", handleCompetitionModalKeydown);
  if (competitionModalLastFocused) competitionModalLastFocused.focus();
}

function renderJoin(settings) {
  const node = document.getElementById("tpl-join").content.cloneNode(true);
  node.getElementById("join-form-btn").href = settings.joinFormUrl || "#";

  const bannerImage = settings.join && settings.join.backgroundImage;
  if (bannerImage) {
    const joinSection = node.getElementById("section-join");
    const bg = node.getElementById("join-parallax-bg");
    bg.style.backgroundImage =
      `linear-gradient(rgba(15, 64, 107, 0.78), rgba(15, 64, 107, 0.78)), url("${imgPath(bannerImage)}")`;
    joinSection.classList.add("has-banner");
  }

  return node;
}

/* Moves the join section's background image at a slower rate than the
   page scrolls, so it drifts up behind the text instead of scrolling
   in lockstep — the section itself keeps its normal (thin) height. */
function initJoinParallax() {
  const bg = document.getElementById("join-parallax-bg");
  const section = document.getElementById("section-join");
  if (!bg || !section) return;

  let ticking = false;
  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return; // offscreen, skip
    const progress = (vh - rect.top) / (vh + rect.height); // ~0 entering, ~1 leaving
    const shift = (progress - 0.5) * 40; // px of drift, tune for subtlety
    bg.style.transform = `translateY(${shift}px)`;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
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
        <img src="${imgPath(settings.logo)}" alt="${escapeHtml(settings.clubName)} logo">
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

function imgPath(path) {
  // The CMS occasionally saves uploaded image paths with a leading "/",
  // which resolves from the domain root instead of this site's own folder
  // (a problem since this site lives at a subpath like /aec-website/, not
  // the root). Stripping it makes every image path resolve relative to
  // this page instead, so this class of bug can't break images again.
  if (!path) return path;
  return path.replace(/^\/+/, "");
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
  advisors: (data) => renderAdvisors(data.advisors),
  competitions: (data) => renderCompetitions(data.competitions),
  join: (data) => renderJoin(data.settings),
  "meeting-info": (data) => renderMeetingInfo(data.settings),
  socials: (data) => renderSocials(data.settings)
};

async function boot() {
  const root = document.getElementById("sections-root");
  try {
    const [settings, sectionsFile, eventsFile, officersFile, advisorsFile, competitionsFile, galleryFile] = await Promise.all([
      loadJSON(DATA_PATHS.settings),
      loadJSON(DATA_PATHS.sections),
      loadJSON(DATA_PATHS.events),
      loadJSON(DATA_PATHS.officers),
      loadJSON(DATA_PATHS.advisors),
      loadJSON(DATA_PATHS.competitions),
      loadJSON(DATA_PATHS.gallery)
    ]);

    const data = {
      settings,
      events: eventsFile.events,
      officers: officersFile.officers,
      advisors: advisorsFile.advisors,
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
    initJoinParallax();
  } catch (err) {
    console.error(err);
    root.innerHTML = `<p class="section-error">Something went wrong loading the page content. Please refresh, or check back later.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", boot);
