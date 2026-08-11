import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import songs from "../data/songs";
import heroMobile from "../assets/hero-mobile.png.asset.json";

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

const SPOTIFY_URL =
  "https://open.spotify.com/playlist/5AzQwHGapByXOKvX5pEEZN?si=VWIWra-wR9WaXg3lud__ag";
const YTM_URL = "https://music.youtube.com/playlist?list=PLFJmmpGcirtU&si=Ij2dPsEkMT9aqxWv";
const BMC_URL = "https://buymeacoffee.com/sonali.bhuyan";

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
        videoId: songs[0]!.videoId,
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
              playerRef.current?.loadVideoById(songs[next]!.videoId);
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
      p.loadVideoById(songs[next]!.videoId);
      setPlaying(true);
    }
  };

  const [clock, setClock] = useState("");
  const [online, setOnline] = useState(21);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase(),
      );
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setOnline((n) => Math.max(8, Math.min(48, n + (Math.random() < 0.5 ? -1 : 1))));
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const song = songs[index]!;
  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <main className="relative h-screen w-full overflow-hidden font-sans text-cream">
      <div id="yt-audio-host" className="pointer-events-none absolute h-0 w-0 overflow-hidden" />

      <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-mustard),var(--color-terracotta)_55%,var(--color-teal-faded))]" />
      <img
        src="/hero.jpg"
        alt="Vintage Telugu neighborhood barbershop with film posters and a radio"
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
      />
      <img
        src={heroMobile.url}
        alt="Vintage Telugu neighborhood barbershop with film posters and a radio"
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,12,4,0.35),rgba(20,12,4,0.05)_35%,rgba(12,10,8,0.55))]" />

      <h1 className="pointer-events-none absolute inset-x-0 top-32 z-10 px-6 text-center font-display text-4xl leading-[0.95] font-black tracking-tight text-cream drop-shadow-[0_6px_24px_rgba(0,0,0,0.75)] sm:top-14 sm:text-6xl lg:text-7xl">
        TOLLYWOOD
        <br />
        SALOON
      </h1>

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 text-[13px] sm:px-6 sm:py-4">
        <span className="text-cream/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">{clock}</span>

        <span className="flex items-center gap-2 text-cream/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
          <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.19_150)]" />
          <span className="font-medium">{online}</span>
          <span className="text-cream/70">online</span>
        </span>

        <nav className="flex items-center gap-3 sm:gap-5">
          <a
            href={SPOTIFY_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-cream/90 transition-colors hover:text-mustard drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
          >
            <SpotifyIcon />
            <span className="hidden sm:inline">Spotify</span>
            <ArrowIcon />
          </a>
          <a
            href={YTM_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-cream/90 transition-colors hover:text-mustard drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
          >
            <YtIcon />
            <span className="hidden sm:inline">YT Music</span>
            <ArrowIcon />
          </a>
          <a
            href={BMC_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-cream/90 transition-colors hover:text-mustard drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
          >
            <CoffeeIcon />
            <span className="hidden sm:inline">Buy me a coffee</span>
            <ArrowIcon />
          </a>
        </nav>
      </header>

      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-3 sm:bottom-10">
        <div className="flex w-full max-w-xl items-center gap-4 rounded-full border border-cream/10 bg-black/45 py-2.5 pr-5 pl-2.5 backdrop-blur-md">
          <div
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle,var(--color-terracotta)_0%,#241a14_70%)] ring-1 ring-mustard/40 ${playing ? "animate-spin [animation-duration:6s]" : ""}`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-cream/80" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-cream">{song.title}</p>
            <p className="truncate text-xs text-cream/60">
              {song.movie} · {song.year}
            </p>
            <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-cream/20">
              <div
                className="h-full rounded-full bg-cream/85 transition-[width] duration-1000 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-cream/45">
              {fmt(current)} / {fmt(duration)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous track"
              className="text-cream/70 transition-colors hover:text-cream"
            >
              <SkipIcon dir="prev" />
            </button>
            <button
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="grid h-11 w-11 place-items-center rounded-full bg-cream text-[#1b1410] transition-transform hover:scale-105 active:scale-95"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next track"
              className="text-cream/70 transition-colors hover:text-cream"
            >
              <SkipIcon dir="next" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.5 14.4a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.53-1.03 8.46-.58 11.6 1.34.35.22.46.68.31 1.03Zm1.34-2.94a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.96-1.4a.94.94 0 1 1-.55-1.79c4.36-1.32 9.78-.68 13.49 1.6.44.27.58.85.31 1.28Zm.12-3.06C14.09 8.1 7.9 7.89 4.4 8.95a1.12 1.12 0 1 1-.65-2.15c4.02-1.22 10.85-.98 15.13 1.56a1.12 1.12 0 1 1-1.14 1.94Z" />
    </svg>
  );
}

function YtIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.2A8.2 8.2 0 1 1 20.2 12 8.2 8.2 0 0 1 12 20.2ZM9.8 7.9l6.6 4.1-6.6 4.1V7.9Z" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M6 2v3M10 2v3M14 2v3" />
    </svg>
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
