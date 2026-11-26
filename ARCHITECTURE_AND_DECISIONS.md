# Architecture & Design Decisions — Pratyush & Sayanee Wedding Invitation

This document records **what was built, what was removed, why each decision was made, and how each subsystem works**, intended as a durable engineering and creative reference for any future conversation or update.

---

## 1. Product Identity & Creative Direction

- **Occasion:** Single-ceremony Bengali wedding (**Shubho Biye · শুভ বিবাহ**) for **Pratyush & Sayanee** (`P · S`, `#PratyushWedsSayanee`).
- **Date & Location:** `Tuesday, 16 February 2027`, `7:00 PM onwards (Shubh Muhurat)`, Kolkata (`WEDDING_DATA` in `src/data/weddingData.js`).
- **Editorial Direction:** Handcrafted cotton-paper wedding editorial (*Biye Patro* aesthetic) pairing Bengali sacred traditions (*Alpona*, *Topor & Mukut*, *Shankha*, *Kulo & Pradip*, *Paan Pata*, *Sindoor*, *Kori Khela*, *Tattwa Ilish*) with quiet luxury typography, tactile soundscapes, and zero backend dependencies.
- **Deployment Target:** Static bundle hosted on GitHub Pages under a subpath (`https://testingaccg.github.io/pratyush-wedding/`) via `.github/workflows/deploy.yml` on pushes to `main`.

---

## 2. Design System & Visual Tokens (`tailwind.config.js`, `src/index.css`, `index.html`)

### Color Palette (`tailwind.config.js`)
| Token | Hex | Purpose |
| :--- | :--- | :--- |
| `ivory` | `#FAF7F2` | Primary warm handmade cotton paper canvas |
| `cream` | `#F3ECE1` | Soft secondary cards and inset stages |
| `sindoor.DEFAULT` / `deep` / `bright` | `#A61C24` / `#781117` / `#C92A2A` | Primary ceremonial crimson accent, CTAs, seal & header accents |
| `terracotta` | `#C85A32` | Clay pradip / agni warm accent |
| `kansa.DEFAULT` / `light` / `muted` | `#C59B38` / `#E6CA7E` / `#7D5E1B` | Heirloom brass & antique gold (`kansa.muted` ensures WCAG AA `>= 5.1:1` contrast on ivory/cream) |
| `indigoNight` | `#1B263B` | Evening / contrast accent |
| `ink` | `#24191A` | Deep warm charcoal body text |

### Typography (`index.html` + `tailwind.config.js`)
- `font-script`: `'Great Vibes'` — Display couple names & personalised guest salutation.
- `font-serif`: `'Cormorant Garamond'` — Editorial headings, quotes, ritual titles, with subtle debossed letterpress `text-shadow` on `h2.font-serif` / `h3.font-serif`.
- `font-bengali`: `'Noto Serif Bengali'` — Native Bengali headers, ritual labels, and `বাংলা` toggle copy.
- `font-sans`: `'Manrope'` — Clean tracked uppercase labels, pills, countdown captions, and controls.

### Signature Textures & Frames (`src/index.css`, `src/App.jsx`)
- **Cotton Paper Grain (`.paper-grain`):** Inline SVG `<feTurbulence>` noise filter layered at `opacity: 0.032` with `mix-blend-mode: multiply` over the whole page (`pointer-events-none`).
- **Letterpress Borders (`.alpona-frame`, `.rajbari-frame`):** Nested double-hairline CSS `box-shadow` borders mimicking blind-debossed foil stationery.
- **Foil Sweep (`.foil-text`):** Hero names run a crimson-to-gold gradient shimmer (`foil-text-sweep`, 3 iterations, then rests cleanly in solid sindoor so the hero never causes visual fatigue).
- **Touch & Focus Discipline:** `future: { hoverOnlyWhenSupported: true }` in `tailwind.config.js` prevents sticky hover states on phones; global `:focus-visible` uses a `#C59B38` ring (`outline-offset: 3px`).

---

## 3. Major Architectural Decisions (What, Why & How)

### A. Single-Ceremony Scope & Cultural Alignment
- **What & Why:** Originally scaffolded as a multi-day multi-function wedding (`Haldi`, `Mehendi`, `Sangeet`, `Pheras`, Jaipur cues) with an RSVP form and a Jora Maach pond widget. Per explicit host direction, the invitation was focused strictly on **one ceremony (`Shubho Biye`) in Kolkata**, with **no RSVP section** and **no Jora Maach pond**.
- **How:**
  - `WEDDING_DATA.events` holds a single event (`id: 'wedding'`, `Shubho Biye`), paired with `WEDDING_DATA.ceremonyTimeline` (`Bor Jatri & Boron`, `Shubho Drishti & Saat Paak`, `Mala Bodol & Sindoor Daan`, `Pritibhoj Feast`).
  - `RsvpSection.jsx` and `JoraMaachPond` were removed, and `Navbar.jsx` links match the active sections (`#celebrations`, `#attire`, `#story`, `#concierge`).
  - `CoupleQuiz` (`src/data/weddingData.js`) was trimmed to 3 single-ceremony questions (`16 February`, `Royal Crimson & Gold`, `Seven steps in Saptapadi`).

### B. Interactive Bengali Ceremony Moments (`src/components/BiyeRitualsInteractive.jsx`)
- **What & Why:** Replace generic North Indian phrasing (`Pheras`) and a plain garland-exchange clicker with authentic, tactile **Bengali Biye moments** featuring expressive caricature illustration and sound/petal feedback so guests feel part of the rituals.
- **What Was Removed / Replaced:**
  - Avoided calling vows *"pheras"* in interactive UI and copy, using traditional **`Saat Paak` / `Saptapadi`** (`সপ্তপদী`).
  - Removed the standalone garland-exchange interaction and replaced it with a **couple caricature `Shubho Drishti` reveal**, then expanded into a 6-chapter interactive sequence:
- **How (`RITUAL_TABS` with Framer Motion `layoutId="biyeRitualPill"` & `Next: ... ->` bar):**
  1. **`Boron · বরণ` (`BoronStage`):** Tap/click circles an illustrated woven bamboo *Kulo* (with *Dhan-Durba* and a flickering clay *Pradip* flame) 3 times around Pratyush in white/crimson *Topor* & *Jor*. Plays `playKansaThali()` on circles 1–2 and triggers `playShankha()` + `'wedding-petal-burst'` confetti toast on circle 3.
  2. **`Shubho Drishti · শুভদৃষ্টি` (`CoupleCaricatureStage`, default tab):** Caricature of Pratyush (*Topor*) and Sayanee (*Mukut*, bindi, chandan dots, crimson Banarasi) holding twin green *Paan Pata* (betel leaves). Clicking lowers the leaves with spring lean-in, brightens blush & smiles, expands a gold ring + floating heart, plays `playShubhoDrishti()`, and dispatches `'wedding-petal-burst'`. Fixed Sayanee's hairline behind her face (`#2A2320` hair circle at `cy=84` behind `#F4CEAE` face) so hairline & eyes remain crisp.
  3. **`Saptapadi · সপ্তপদী` (`SaptapadiStage`):** Interactive 7-step orbit around the *Homa Agni* displaying each of the 7 vows (`Nourishment` through `Eternal Friendship`), rotating markers and playing an ascending note via `playSaatPaakStep(step)` before finishing with `playPradipLit()` + petals on step 7.
  4. **`Khoi Daan · খই দান` (`KhoiDaanStage`):** Tap showers 14 golden puffed rice grains from cupped hands into the brightening Homa flame with `playHoludSplash()`.
  5. **`Sindoor Daan · সিঁদুরদান` (`SindoorDaanStage`):** Beneath the crimson gold-bordered *Lajja Bastra* veil, animates a vermilion stroke (`pathLength` 0 -> 1) onto Sayanee's hair parting alongside a golden *Sindoor Kouto*, playing `playPradipLit()` + petal burst.
  6. **`Kori Khela · কড়ি খেলা` (`KoriKhelaStage`):** Tossing 5 cowrie shells onto an *Alpona* mat with spring rotations and playful alternating winner callouts for Pratyush & Sayanee.

### C. Opening Ritual & Continuous Layer (`ShubhoDrishtiIntro.jsx`, `AmbientCanvas.jsx`, `PetalButton.jsx`, `Footer`)
- **3D Carved Lacquer Doors (`ShubhoDrishtiIntro.jsx`):** Full-screen tactile entrance. Guests can swipe or click to open the doors, synchronously firing `soundEngine.beginCelebration()` inside the user gesture so browser autoplay policies permit immediate background music + chimes.
- **Floating Petals & Ambient Glow (`AmbientCanvas.jsx`, `PetalButton.jsx`):** Ambient canvas particles plus on-demand crimson/gold petal bursts dispatched via `window.dispatchEvent(new CustomEvent('wedding-petal-burst'))` from anywhere in the app.
- **Footer Easter Egg (`src/App.jsx`):** Tapping the `<CoutureCrest />` emblem in the footer glides an illustrated **Tattwa Ilish (festive Topor-wearing fish)** across the footer (`.tattwa-glide`), plays `playHoludSplash()`, showers petals, and toasts `শুভ তত্ত্ব · Tattwa Ilish brings sweet blessings ✦`.

### D. Unconditional Animation Policy (`MotionConfig reducedMotion="never"`)
- **What & Why:** On mobile devices (low-power/battery-saver mode) or browsers with OS-level "Reduce Motion" enabled, Framer Motion defaults to suppressing transforms and complex keyframes, making doors, rituals, mandalas, and petals feel static. Per user instruction (*"make sure all animations runs regardless of browser settings or phone settings"*), **every animation runs unconditionally**.
- **How:**
  - Wrapped the root application inside `<MotionConfig reducedMotion="never">` in `src/App.jsx`.
  - Removed all `useReducedMotion()` / `prefers-reduced-motion` early-returns and conditional branches across `ShubhoDrishtiIntro.jsx`, `PetalButton.jsx`, `BengaliMotifs.jsx`, `AmbientCanvas.jsx`, and `src/index.css`.
- **Trade-off Note:** Guests with vestibular sensitivity who intentionally enable OS `prefers-reduced-motion` will still see full animations; reversing this later only requires restoring `reducedMotion="user"` on `<MotionConfig>`.

### E. Self-Hosted Audio Engine & Original Shankha Sound (`src/utils/soundEngine.js`)
- **Why:**
  1. Synthetic music and external music URLs were unreliable or broke under GitHub Pages subpaths; synthetic conch harmonics (`sawtooth` + un-enveloped noise) sounded artificial.
  2. Absolute `/kudmayi.mp3` paths break when hosted under `/pratyush-wedding/` on GitHub Pages.
  3. Browser tabs should silence audio cleanly when backgrounded (`visibilitychange`).
- **How:**
  - **Relative URL Resolution:** `WEDDING_DATA.couple.musicUrl` (`'./kudmayi.mp3'`) and `WEDDING_DATA.couple.shankhaUrl` (`'./shankha.mp3'`) are resolved via `new URL(relPath, document.baseURI).href` so cached `<Audio>` `src` equality checks never drift and subpath hosting works seamlessly alongside `vite.config.js` `base: './'`.
  - **Background Soundtrack:** `public/kudmayi.mp3` loops at gentle `volume = 0.04` when unlocked, with a full Web Audio API F-major *Romantic Bridal Ballad* fallback (`playWarmPiano` + `playLeadMelody`) if the MP3 cannot play.
  - **Original Shankha Conch (`playShankha`):** Plays `public/shankha.mp3` (499,543 bytes; Freesound #439477 `Sankh_conch.mp3` by `Odiasites.com`, licensed **CC BY-NC 3.0** — valid for personal non-commercial wedding use). Holds for `6.2s` at `volume = 0.65`, then fades out smoothly over `1.4s` (~`7.6s` total) while softly cross-fading background music back up (`0.012 -> 0.04`). Falls back to a smoothed triangle-wave `playShankhaSynth()` if playback is blocked/offline.
  - **Tactile Micro-SFX:** Procedural Web Audio synthesis handles `playShubhoDrishti()`, `playSaatPaakStep(idx)`, `playKansaThali()`, `playHoludSplash()`, `playPradipLit()`, and `playSoftTick()`.

### F. Bilingual Experience Without Duplicate Pages (`src/context/LangContext.jsx`)
- **What & Why:** Families and elders appreciate warm Bengali script (`বাংলা`), while extended friends need crisp English (`EN`). Rather than duplicating routes, a React Context (`LangProvider`, `useLang()`) toggles `lang` (`'en' | 'bn'`) live from the pill in `Navbar.jsx`, updating section headings, eyebrows, navigation links, and personalized guest greetings (`Dearest ...` <-> `প্রিয় ...`).

### G. Personalized Guest Links, Calendar `.ics`, & Canvas Keepsake Pass (Zero Backend)
- **URL Personalization (`src/utils/guest.js`):** Parses `?guest=` (or `?g=`) with control-character stripping and length capping (`60` chars). Passing `?host` reveals `<HostLinkMaker />` at the bottom of the page so the couple can batch-generate individualized WhatsApp invitation URLs without exposing a backend/admin database.
- **Keepsake Invite Pass (`src/utils/passCanvas.js` + `SacredThreadEvents.jsx`):** Client-side HTML5 `<canvas>` generator renders a downloadable/shareable PNG pass featuring the guest's name, `P · S` crest, Shubho Biye details, and Web Share API integration (`navigator.canShare({ files })`) with fallback PNG download.
- **Calendar Integration (`src/utils/calendar.js`):** Generates one-click `.ics` downloads and Google Calendar prefilled URLs using `WEDDING_DATA.events[0]`.
- **WhatsApp Link Preview (`index.html` + `public/og-cover.png`):** Absolute `og:image` / `twitter:image` URL (`https://testingaccg.github.io/pratyush-wedding/og-cover.png`, 1200x630 PNG) ensures rich WhatsApp/iMessage link cards.
- **Live Countdown Engine (`src/utils/schedule.js`, `HeroSection.jsx`):** Uses `events[0].startISO` / `endISO` (plus optional `?date=` preview override if needed) to tick down dynamically and display a live `"Happening now"` banner during the wedding window.

---

## 4. File Inventory & Change Summary

### Added Modules & Assets
- `public/kudmayi.mp3` — Self-hosted background soundtrack
- `public/shankha.mp3` — Original recorded *Shankh Naad* MP3 (CC BY-NC 3.0)
- `public/og-cover.png` — 1200x630 WhatsApp/OpenGraph social preview banner
- `src/context/LangContext.jsx` — Global `EN / বাংলা` context provider
- `src/components/BengaliMotifs.jsx` — Rotating `AlponaMandala`, `ToporMukutEmblem`, `ShankhaIcon`
- `src/components/BiyeRitualsInteractive.jsx` — 6-stage interactive Bengali ceremony module
- `src/components/HostLinkMaker.jsx` — `?host` single & bulk personalized URL generator
- `src/utils/guest.js` — Sanitized `?guest=` / `?g=` / `?host` parser & URL builder

### Intentionally Removed
- `src/components/RsvpSection.jsx` — Removed RSVP section per host request; invitation is celebration-first with `.ics`, Maps, Concierge, and Keepsake Pass.
- *Jora Maach Pond* component & references — Removed to avoid clutter and keep focus on ceremony & cultural rituals.
- *Pheras / Standalone Garland Exchange* framing — Replaced with Bengali *Saat Paak / Saptapadi* and `Shubho Drishti` couple caricature.
- `prefers-reduced-motion` suppression gates — Removed so all animations always run across devices.

---

## 5. Verification Status & Pre-Launch Personalization Checklist

### Verification Notes
- **Build & Static Checks:** Verified via `npm run build` (`vite build` exit `0`), validating asset copying into `dist/` (`index.html`, `assets/*`, `kudmayi.mp3`, `shankha.mp3`, `og-cover.png`) and verifying zero `prefers-reduced-motion` bypass guards remain in code.
- **Live Browser Audio/Visual Caveat:** Early layout iterations were visually inspected in headless Chromium, while the final commits (Boron circle animation, unconditional `reducedMotion="never"`, and `public/shankha.mp3` playback) were build-verified only after Chrome DevTools MCP became unavailable following a session restart. Test live audio & mobile gestures on a physical phone before distributing the URL.

### Real-World Data Still to Confirm in `src/data/weddingData.js`
1. **Venue & Map Link (`events[0].venue`, `events[0].mapsUrl`):** Currently `'The Heritage Courtyard'` and generic `'https://maps.google.com/?q=Kolkata,+West+Bengal'`. Replace with the finalized venue name and exact Google Maps pin.
2. **Ceremony Date (`couple.dateRange`, `ceremonyISO`, `events[0]`):** Currently `'16 February 2027'`. Confirm exact year & muhurat time with both families.
3. **Bengali Name Spelling (`couple.bengaliNames`):** `'প্রত্যূষ ও সায়নী'` — confirm exact spelling (`প্রত্যূষ` / `প্রত্যুষ`, `সায়নী`).
4. **Placeholder Contact (`couple.whatsappNumber`):** `'919876543210'` in `weddingData.js` is a sample placeholder; update or remove if referenced in future features. Also `HostLinkMaker.jsx` uses sample input placeholder `'Mehra Family'`.
5. **Story Gallery Photos (`StoryGallery.jsx`, `weddingData.js` `gallery`):** Currently uses fine-art SVG scenes (`variant`); any entry supports optional `image: './...'` when pre-wedding photographs are ready.
