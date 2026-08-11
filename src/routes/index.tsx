import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import songs from "../data/songs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tollywoodsaloon — 90s & 2000s Telugu Barbershop Jukebox" },
      {
        name: "description",
        content:
          "A nostalgia jukebox of iconic 1990s–2010s Telugu film songs that played in every neighborhood barbershop.",
      },
      { property: "og:title", content: "Tollywoodsaloon — Barbershop Jukebox" },
      {
        property: "og:description",
        content: "90s & 2000s Telugu bangers that played at every neighborhood saloon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function fmt(s: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Index() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    let cancelled = false;

    function create() {
      if (cancelled || playerRef.current) return;
      playerRef.current = new (window as any).YT.Player("yt-audio-host", {
        height: "0",
        width: "0",
        videoId: songs[0].videoId,
        playerVars: { playsinline: 1, controls: 0 },
        events: {
          onReady: () => {
            readyRef.current = true;
          },
          onStateChange: (e: any) => {
            const YT = (window as any).YT;
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
            if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
            if (e.data === YT.PlayerState.ENDED) {
              const next = (indexRef.current + 1) % songs.length;
              setIndex(next);
              playerRef.current?.loadVideoById(songs[next].videoId);
              setPlaying(true);
            }
          },
        },
      });
    }

    if ((window as any).YT && (window as any).YT.Player) {
      create();
    } else {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        create();
      };
      if (!document.getElementById("yt-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (p?.getCurrentTime) {
        setCurrent(p.getCurrentTime() || 0);
        setDuration(p.getDuration() || 0);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    if (playing) {
      p.pauseVideo();
      setPlaying(false);
    } else {
      p.playVideo();
      setPlaying(true);
    }
  };

  const go = (delta: number) => {
    const next = (index + delta + songs.length) % songs.length;
    setIndex(next);
    setCurrent(0);
    setDuration(0);
    const p = playerRef.current;
    if (p && readyRef.current) {
      p.loadVideoById(songs[next].videoId);
      setPlaying(true);
    }
  };

  const song = songs[index];
  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <main className="relative min-h-screen font-sans text-cream">
      <div id="yt-audio-host" className="pointer-events-none absolute h-0 w-0 overflow-hidden" />

      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-mustard),var(--color-terracotta)_55%,var(--color-teal-faded))]" />
        <img
          src="/hero.jpg"
          alt="Vintage Telugu neighborhood barbershop with film posters and a radio"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,12,4,0.55),rgba(20,12,4,0.35)_35%,rgba(12,20,22,0.88))]" />

        <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pt-16 pb-40 sm:pb-16">
          <span className="rounded-full border border-mustard/50 bg-black/35 px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] text-mustard backdrop-blur-sm sm:text-xs">
            🎵 EST. 1995 · BARBERSHOP JUKEBOX
          </span>

          <h1 className="mt-8 text-center font-display text-5xl leading-[0.95] font-black tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl">
            <span className="text-mustard">TOLLYWOOD</span>
            <span className="text-cream">SALOON</span>
          </h1>

          <p className="mt-4 max-w-xl text-center text-sm text-cream/85 sm:text-base">
            90s &amp; 2000s Telugu bangers that played at every neighborhood saloon
          </p>

          <div className="mt-6 flex w-56 items-center gap-3">
            <span className="h-px flex-1 bg-cream/40" />
            <ScissorsIcon />
            <span className="h-px flex-1 bg-cream/40" />
          </div>

          <div className="flex-1" />

          <div className="fixed inset-x-0 bottom-0 z-20 sm:static sm:w-full sm:max-w-xl">
            <div className="border-t border-cream/15 bg-[#1b1410]/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md sm:rounded-3xl sm:border sm:p-6 sm:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-4">
                <div
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle,var(--color-terracotta)_0%,#241a14_70%)] ring-2 ring-mustard/50 sm:h-16 sm:w-16 ${playing ? "animate-spin [animation-duration:6s]" : ""}`}
                >
                  <span className="h-3 w-3 rounded-full bg-cream/80" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-mustard">
                    NOW PLAYING
                  </p>
                  <p className="truncate font-display text-lg font-bold text-cream sm:text-2xl">
                    {song.title}
                  </p>
                  <p className="truncate text-xs text-cream/60 sm:text-sm">
                    {song.movie} · {song.year}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/15">
                  <div
                    className="h-full rounded-full bg-mustard transition-[width] duration-1000 ease-linear"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-cream/50">
                  <span>{fmt(current)}</span>
                  <span>{fmt(duration)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-6">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous track"
                  className="text-cream/70 transition-colors hover:text-mustard"
                >
                  <SkipIcon dir="prev" />
                </button>
                <button
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  className="grid h-14 w-14 place-items-center rounded-full bg-mustard text-[#1b1410] shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next track"
                  className="text-cream/70 transition-colors hover:text-mustard"
                >
                  <SkipIcon dir="next" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="rounded-full border border-cream/30 bg-black/30 px-5 py-2 text-xs font-medium text-cream/90 backdrop-blur-sm transition-colors hover:border-mustard hover:text-mustard"
            >
              Listen on Spotify
            </a>
            <a
              href="#"
              className="rounded-full border border-cream/30 bg-black/30 px-5 py-2 text-xs font-medium text-cream/90 backdrop-blur-sm transition-colors hover:border-mustard hover:text-mustard"
            >
              Listen on YT Music
            </a>
          </div>

          <footer className="mt-8 text-center text-[11px] text-cream/50">
            Songs via YouTube · Full playlists on Spotify &amp; YT Music
          </footer>
        </div>
      </section>
    </main>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function SkipIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={dir === "prev" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M5 6v12l9-6-9-6z" />
      <rect x="16" y="6" width="3" height="12" rx="1" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="text-mustard"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8 7.5 20 18M8 16.5 20 6" />
    </svg>
  );
}
