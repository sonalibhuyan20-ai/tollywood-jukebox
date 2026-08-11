# Tollywoodsaloon — Full Rebuild Context

Paste everything below into a fresh Lovable project as the first prompt. It contains the
complete spec, design tokens, data, and code needed to recreate this site 1:1.
Two images must be re-uploaded manually (see "Assets").

---

## 1. What the site is

A single-page, client-only nostalgia music site celebrating iconic Telugu (Tollywood) film
songs from the 1990s–2010s that played in neighborhood barbershops. No routing, no nav menu,
no backend, no database, no login. Everything lives in one full-screen view, styled like a
minimal music-player app over a full-bleed vintage barbershop photo.

Domain: `tollywoodsaloon.in`

## 2. Stack

- React 19 functional components, hooks only (`useState`, `useEffect`, `useRef`)
- TanStack Start v1 + TanStack Router (Lovable default). Single route: `src/routes/index.tsx`
- Tailwind CSS v4, configured through `src/styles.css` (`@theme`), no `tailwind.config.js`
- No external UI libraries, no shadcn components used on the page
- Fonts: **Fraunces** (display) + **DM Sans** (body), loaded via `<link>` in `src/routes/__root.tsx`

## 3. Assets (must be re-uploaded)

1. **Desktop hero** — landscape vintage Telugu barbershop scene → save as `public/hero.jpg`
   (lowercase, no spaces/special chars). Referenced as a plain `<img src="/hero.jpg" />`.
2. **Mobile hero** — portrait/vertical version of the same artwork → `src/assets/hero-mobile.png`
   imported into the component.

Image rules that must be followed exactly (these broke a previous attempt):
- Plain `<img>` tags rendered directly in JSX with `object-cover` + full width/height.
- **No** `new Image()` preloader, **no** CSS `background-image` with a loaded-state, **no**
  conditional rendering based on an `isLoaded` flag.
- A warm gradient (mustard → terracotta → faded teal) sits *behind* the `<img>` so the page
  still looks intentional if the image fails.

## 4. Design tokens (`src/styles.css`, inside `@theme`)

```css
@theme {
  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --color-mustard: oklch(0.8 0.14 85);
  --color-terracotta: oklch(0.58 0.14 40);
  --color-teal-faded: oklch(0.5 0.06 200);
  --color-cream: oklch(0.96 0.03 90);
}
```

Aesthetic: warm nostalgic scrapbook artifact — mustard yellow, terracotta, faded teal, cream.
Rounded corners, soft shadows, frosted glass. Explicitly **not** a SaaS dashboard look.

## 5. Layout spec

Root is `<main className="relative h-screen w-full overflow-hidden font-sans text-cream">`.
Layer order, bottom to top:

1. Warm gradient fallback: `bg-[linear-gradient(160deg,var(--color-mustard),var(--color-terracotta)_55%,var(--color-teal-faded))]`
2. Desktop hero `<img src="/hero.jpg">` — `hidden … sm:block`
3. Mobile hero `<img>` — `sm:hidden`
4. Dark scrim gradient top→bottom for text legibility
5. **Title** `<h1>`: "TOLLYWOOD" / line break / "SALOON", white/cream, `font-display`,
   `font-black`, centered, heavy drop shadow. Positioned `top-32` on mobile, `sm:top-14` on
   desktop (near the top, not vertically centered).
6. **Top bar** (`absolute inset-x-0 top-0 z-20`, flex, space-between, small 13px text):
   - Left: live clock (`h:mm am/pm`, lowercase, updates every 20s)
   - Middle: green dot + a randomized "online" counter (starts at 21, drifts ±1 every 7s,
     clamped 8–48) + the word "online"
   - Right: three external links, each = inline SVG icon + label (label `hidden sm:inline`)
     + small ↗ arrow icon, hover turns mustard:
     - Spotify → `https://open.spotify.com/playlist/5AzQwHGapByXOKvX5pEEZN?si=VWIWra-wR9WaXg3lud__ag`
     - YT Music → `https://music.youtube.com/playlist?list=PLFJmmpGcirtU&si=Ij2dPsEkMT9aqxWv`
     - Buy me a coffee → `https://buymeacoffee.com/sonali.bhuyan`
7. **Player pill** (`absolute inset-x-0 bottom-6 sm:bottom-10 z-20`, centered, `max-w-xl`,
   full-width rounded-full, `bg-black/45 backdrop-blur-md`, cream hairline border):
   - Left: 56px circular disc, radial terracotta gradient, mustard ring, cream center dot;
     spins (`animate-spin [animation-duration:6s]`) only while playing
   - Middle: song title (bold, truncate) / `movie · year` (muted) / 3px progress bar /
     `m:ss / m:ss` timestamp
   - Right: Prev, big cream circular Play/Pause, Next — all inline SVGs with aria-labels

Responsive: mobile keeps the same pill pinned near the bottom, full width with side padding.

## 6. Audio playback (YouTube IFrame API)

- Audio streams by YouTube video ID. **No** `<audio>` tags, no hosted/fetched audio files.
- Load `https://www.youtube.com/iframe_api` dynamically on mount (guard by script id;
  chain any existing `window.onYouTubeIframeAPIReady`).
- Create a hidden player in a `0×0` div (`id="yt-audio-host"`), `playerVars: { playsinline: 1, controls: 0 }`.
- Play/pause → `playVideo()` / `pauseVideo()`; Prev/Next → `loadVideoById()` then auto-play.
- Progress polled every 1s while playing via `getCurrentTime()` / `getDuration()`.
- **No autoplay on load** — playback only starts after the user's first click.
- On `ENDED`, auto-advance to the next track, wrapping to the first after the last.
  Use an `indexRef` mirror so the state-change callback reads the current index.
- The player must work with **any array length** so the song list can be extended without
  touching other code.

## 7. Song data — `src/data/songs.js`

```js
const songs = [
  { videoId: "Bvd0kNVlSmA", title: "Sasivadane", movie: "Iddaru", year: 1997 },
  { videoId: "eswNfGWPhYQ", title: "Hai Re Hai Rabba", movie: "Jeans", year: 1998 },
  { videoId: "zXWJLEE7LeI", title: "Butta Bomma", movie: "Ala Vaikunthapurramuloo", year: 2020 },
  { videoId: "g3wP-QO14d4", title: "Kammani Kalalaku", movie: "Priya O Priya", year: 1997 },
  { videoId: "U0EyR7y-EJM", title: "Palike Gorinka", movie: "Priyuralu Pilichindi", year: 1998 },
];

export default songs;
```

A sibling `src/data/songs.d.ts` declares the module's type for TypeScript.

## 8. SEO / head

Set in the route's `head()`:
- title: `Tollywoodsaloon — 90s & 2000s Telugu Barbershop Jukebox`
- description: `A nostalgia jukebox of iconic 1990s–2010s Telugu film songs that played in every neighborhood barbershop.`
- `og:title`, `og:description`, `og:type: website`, `twitter:card: summary_large_image`

## 9. Analytics

Google Analytics (gtag.js) with measurement ID **G-5M8WB3MLS0**, injected in the document head
in `src/routes/__root.tsx` (async gtag script + `dataLayer` init inline script).

## 10. Hosting notes

- GitHub Pages does **not** work — this is a server-rendered TanStack Start app, not a static SPA.
- Vercel works: `vite.config.ts` sets `nitro: { preset: "vercel" }`, plus a `vercel.json` with
  `buildCommand: npm run build` and `installCommand: npm ci`.
- Lovable's own Publish + custom domain is the simplest path.

## 11. Scope guard

Do not add any content, pages, or features beyond the above.