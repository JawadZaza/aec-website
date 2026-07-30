# Applied Engineering Club Website — Setup Guide

This guide assumes zero coding experience. Follow the steps in order the first
time. After that, you'll mostly only need the "Editing Content" section.

---

## Part 1: Put the site on the internet

### Step 1 — Create a GitHub account (skip if you already have one)

1. Go to [github.com](https://github.com) and sign up for a free account.

### Step 2 — Create the repository (the project's home on GitHub)

1. Once logged in, click the **+** icon top-right → **New repository**.
2. Repository name: `aec-website` (or any name you like — just remember it).
3. Set it to **Public**. (It needs to be public for the free version of
   GitHub Pages to work. Nothing sensitive lives in this repo — just website
   text and photos you choose to publish anyway.)
4. Do **not** check "Add a README" — leave everything else default.
5. Click **Create repository**.

### Step 3 — Upload the website files

The easiest way with no coding tools:

1. On your new repo's page, click **uploading an existing file** (or
   **Add file → Upload files**).
2. Open the `aec-website` folder on your computer, select *everything inside
   it* (`index.html`, `admin`, `assets`, `data`, `SETUP.md` — the folder
   contents, not the folder itself), and drag them into the browser upload
   area.
3. Scroll down, click **Commit changes**.

   *(If you're comfortable with Git/GitHub Desktop, you can push the folder
   that way instead — same result.)*

### Step 4 — Point `/admin` at your new repo

1. In your repo on GitHub, open `admin/config.yml` and click the pencil
   (✏️) icon to edit it.
2. Find this line near the top:
   ```yaml
   repo: YOUR-GITHUB-USERNAME/aec-website
   ```
3. Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username, and
   `aec-website` with whatever you named the repo in Step 2. For example:
   ```yaml
   repo: jsmith/aec-website
   ```
4. Click **Commit changes**.

   This is the *only* line of code you should ever need to touch by hand.
   Everything else is edited through the `/admin` page (Part 3).

### Step 5 — Turn on GitHub Pages

1. In your repo, go to **Settings** → **Pages** (left sidebar).
2. Under "Build and deployment" → "Source", choose **Deploy from a branch**.
3. Under "Branch", choose **main** and folder **/ (root)**. Click **Save**.
4. GitHub will show you a URL like `https://jsmith.github.io/aec-website/`.
   It takes a minute or two to go live the first time.

That's it — **no build step, no GitHub Actions workflow needed.** Any time
you or an editor changes content (through `/admin` or by uploading files),
GitHub Pages automatically republishes within a minute or two.

Your site is now live. Your CMS is at:
`https://jsmith.github.io/aec-website/admin/` (swap in your actual URL).

---

## Part 2: Who can edit the site (access control)

There's no separate username/password system to manage — that would need a
paid server and real security work to do safely. Instead, **editing access
is the same thing as being a Collaborator on the GitHub repo**:

- **To let someone edit the site:** Go to your repo → **Settings** →
  **Collaborators** → **Add people** → enter their GitHub username or email.
  They'll get an email invite; once they accept, they can log into `/admin`.
- **To remove someone's access:** Same page → click the **⋯** next to their
  name → **Remove**. Effective immediately.

No code or config changes needed for either — it's a couple of clicks on
github.com, any time you want.

---

## Part 3: Logging into `/admin`

Each editor (including you) logs in with their **own** GitHub account using
a Personal Access Token (PAT) — a long password-like code you generate once.
No separate login system, no shared password.

1. Go to `https://YOUR-SITE-URL/admin/`.
2. Click **Sign In Using Access Token**.
3. The CMS gives you a link to GitHub's token creation page with the right
   permissions already selected. Click it.
4. On GitHub, give the token a name (e.g. "AEC website editing"), leave the
   expiration and permissions as pre-filled, and click **Generate token**.
5. Copy the token GitHub shows you (you won't be able to see it again).
6. Paste it back into the CMS prompt and confirm.

You're in. You'll only need to repeat this if your token expires or you're
on a new device — GitHub will remember you're a Collaborator either way, so
there's no separate "request access" step.

---

## Part 4: Editing content

All editing happens at `/admin`, organized into these sections in the
left-hand menu:

### Events
**Events** collection → **Events** file. Add/remove/edit entries with title,
date, time, location, and description. They automatically appear on the site
sorted soonest-first — you don't need to keep them in any particular order.

### Officers
**Officers** collection → **Officers** file. Each entry has a name, role,
photo upload, and short bio. They display in the order they appear in the
list — drag the handle on the left of an entry to reorder.

### Competitions
**Competitions** collection → **Competitions** file. Name, description,
status (Upcoming / In Progress / Completed — pick from the dropdown), and
date.

### Gallery (with reordering)
**Gallery** collection → **Gallery** file. Each entry is a photo + caption.
**To reorder photos:** drag the small handle on the left edge of each entry
up or down. The order in this list is exactly the order they'll appear on
the site — no extra "order number" to manage.

### Join Link
**Site Settings** collection → **Join Form URL** field. Paste your Google
Form link here. It automatically updates every "Join" button across the
whole site — you only ever edit it in this one place.

### Meeting Info
**Site Settings** collection → **Meeting Info** section. Set the day, time,
location, and a free-text "Notes / exceptions" field for things like "No
meeting during finals week."

### Socials
**Site Settings** collection → **Socials** section. Paste your Instagram
and Discord URLs. Leave either blank to hide that button.

---

## Part 5: The announcement banner

**Site Settings** collection → **Announcement Banner** section:

- **Show banner** — toggle on/off. Off = banner never appears, no matter
  what the text field says.
- **Banner text** — the message shown across the top of the site.
- **Banner link** — optional. If filled in, the message becomes a clickable
  link. Leave blank for plain text.

Visitors can also dismiss the banner themselves with the ✕ button; it
reappears for them next time you change the text (or next browser session).

---

## Part 6: Swapping the logo

**Site Settings** collection → **Logo** field → click the image, then
**Upload** (or drag a new image on) → **Choose selected image**. It updates
the header and footer automatically. Square images work best.

---

## Part 7: Showing, hiding, and reordering sections

**Sections** collection → **Sections** file. This controls the 8 main blocks
on the homepage (Hero, Gallery, Events, Officers, Competitions, Join,
Meeting Info, Socials):

- **Visible on site** toggle — turn a section off to hide it completely
  without deleting its content (e.g. hide Competitions during the off-season,
  turn it back on later — nothing is lost).
- **Drag to reorder** — drag the handle on the left of a section to change
  where it appears on the page, top to bottom.

Note: the announcement banner and footer aren't in this list — the banner
has its own on/off toggle (Part 5), and the footer always shows since it
carries the "this is a student-run page" notice.

---

## Part 8: Adding a brand-new section later

Everything above lets you show/hide/reorder the *existing* sections. If you
ever want an entirely new kind of section (say, a "Sponsors" block), that
needs a small amount of new code — the layout, styling, and a new CMS field
have to be built for it. That's expected and outside what a no-code CMS can
do on its own. When you're ready for that, just ask for it as a follow-up
request rather than trying to add it through `/admin`.

---

## Troubleshooting

- **"There are errors in the CMS configuration"** — someone likely edited
  `admin/config.yml` by hand and introduced a typo. Compare against the
  version in this repo's history, or ask for help fixing the specific error
  shown on screen.
- **Changes not showing up on the live site** — GitHub Pages usually
  updates within 1–2 minutes of a commit. Try a hard refresh
  (Ctrl+Shift+R / Cmd+Shift+R). If it's been longer than 5 minutes, check
  your repo's **Actions** tab (or the little dot next to your latest commit)
  for a red ✕, which means something failed.
- **Someone can't log into `/admin`** — check they're listed under your
  repo's **Settings → Collaborators**, and that they generated their PAT
  from *their own* GitHub account (tokens aren't shareable between people).
