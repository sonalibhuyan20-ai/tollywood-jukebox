# Tollywood Jukebox

Build a single-page React + Tailwind website called "Tollywoodsaloon" — a nostalgia music site celebrating iconic Telugu (Tollywood) film songs from the 1990s–2010s that played in neighborhood barbershops.

IMAGE HANDLING — READ FIRST (this broke in a previous attempt, follow exactly)

- I am uploading one hero image. Save it to /public/hero.jpg (lowercase, no spaces, no special characters, no trailing underscores in the filename — rename on upload if needed)

- Reference it in code as a plain <img src="/hero.jpg" className="..." /> tag with object-cover and full-width/full-height styling — do NOT use a JS Image() preloader pattern, background-image CSS with dynamic loaded-state, or any conditional rendering based on a "loaded" state. Plain <img> tag only, rendered directly in JSX.

- Layer a warm gradient (mustard yellow → terracotta → faded teal) as a background behind the <img>, so if the image genuinely fails to load, the page still looks intentional

- After building, confirm the image file exists in /public and is referenced with the exact matching filename before considering this step done

STRUCTURE

Single page, no routing, no navigation menu, no extra routes. Everything visible in one view like a music player app.

LAYOUT

1. Full-bleed hero section using /hero.jpg as described above

2. A badge/pill element near the top of the hero: "🎵 EST. 1995 · BARBERSHOP JUKEBOX"

3. Site title "TOLLYWOODSALOON" — large, bold, retro display font, two-tone coloring (e.g. "TOLLYWOOD" in warm orange/gold, "SALOON" in white), centered

4. Subtitle beneath: "90s & 2000s Telugu bangers that played at every neighborhood saloon"

5. A decorative small divider (e.g. a pair of scissors icon flanked by thin lines) below the subtitle

6. A floating "NOW PLAYING" card, positioned toward the bottom of the hero / as a fixed bar on scroll:

   - Small "NOW PLAYING" label

   - Song title (bold, large)

   - Movie name + year (smaller, muted)

   - Circular album-art-style icon or disc graphic next to the text

   - Play/pause button (large, central)

   - Previous / Next buttons flanking play

   - Thin progress bar showing playback position

7. Below the player card: two small pill-shaped buttons — "Listen on Spotify" and "Listen on YT Music" — placeholder href="#" for now

8. Footer: small centered text "Songs via YouTube · Full playlists on Spotify & YT Music"

RESPONSIVE BEHAVIOR

On mobile (viewport < 640px), the "NOW PLAYING" card becomes a fixed bar pinned to the bottom of the screen, full width.

AUDIO PLAYBACK — IMPORTANT

Use the YouTube IFrame Player API to stream audio by video ID. Do NOT use <audio> tags with file URLs, do NOT host or fetch actual audio files.

- Load the YouTube IFrame API script dynamically on mount

- Create a hidden YouTube player instance (0x0 dimensions, not visually shown)

- Wire play/pause to playVideo()/pauseVideo()

- Wire Next/Previous to load the next/previous videoId and auto-play it

- Update the progress bar using getCurrentTime()/getDuration(), polled every second while playing

- Do NOT attempt to autoplay on page load — only start playback after the user's first click, due to browser autoplay restrictions

- When a track ends, automatically advance to the next track (loop back to the first after the last)

SONG DATA

Store this as a hardcoded array in src/data/songs.js. Build the player to work with any array length so I can extend this list later without other code changes:

const songs = [

  { videoId: "Bvd0kNVlSmA", title: "Sasivadane", movie: "Iddaru", year: 1997 },

  { videoId: "eswNfGWPhYQ", title: "Hai Re Hai Rabba", movie: "Jeans", year: 1998 },

  { videoId: "zXWJLEE7LeI", title: "Butta Bomma", movie: "Ala Vaikunthapurramuloo", year: 2020 },

  { videoId: "g3wP-QO14d4", title: "Kammani Kalalaku", movie: "Priya O Priya", year: 1997 },

  { videoId: "U0EyR7y-EJM", title: "Palike Gorinka", movie: "Priyuralu Pilichindi", year: 1998 },

];

STYLING

- Tailwind CSS only, no external UI libraries

- Warm nostalgic palette: mustard yellow, terracotta, faded teal, cream — matching the uploaded barbershop artwork

- Retro-inspired display font for the title (e.g. "Fraunces" or "Playfair Display" via Google Fonts), clean sans-serif for body text

- Rounded corners, soft shadows on the player card

- Avoid generic SaaS-dashboard look — this should feel like a warm scrapbook artifact

TECH REQUIREMENTS

- React functional components, hooks only (useState, useEffect, useRef)

- Tailwind CSS for all styling

- No backend, no database, no login — fully client-side

- Clean, single-purpose codebase

Do not add any content, pages, or features beyond what's described above.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/65b57889-5aa6-4094-b59c-734b5129c70c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
