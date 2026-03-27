"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start muted autoplay
    audio.muted = true;
    audio.play().then(() => {
      setPlaying(true);
      // Show player after a short delay
      setTimeout(() => setVisible(true), 1000);
    }).catch(() => {
      // Autoplay blocked — show player anyway so user can start manually
      setVisible(true);
    });

    // Unmute on first user interaction
    const unmute = () => {
      if (audio.muted) {
        audio.muted = false;
        setMuted(false);
        if (!playing) {
          audio.play().then(() => setPlaying(true)).catch(() => {});
        }
      }
      document.removeEventListener("click", unmute);
      document.removeEventListener("keydown", unmute);
      document.removeEventListener("touchstart", unmute);
    };

    document.addEventListener("click", unmute);
    document.addEventListener("keydown", unmute);
    document.addEventListener("touchstart", unmute);

    return () => {
      document.removeEventListener("click", unmute);
      document.removeEventListener("keydown", unmute);
      document.removeEventListener("touchstart", unmute);
    };
  }, []);

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/track.flac" loop preload="auto" />

      <div
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ background: "rgba(8,8,8,0.85)", borderColor: "var(--border)" }}
      >
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center text-neon hover:opacity-70 transition-opacity"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Track info */}
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Now Playing</span>
          <span className="font-mono text-[11px] text-slate-300 truncate max-w-[140px]">Actin Tough</span>
        </div>

        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
          aria-label={muted ? "Unmute" : "Mute"}
          style={{ color: muted ? "var(--border)" : "var(--neon)" }}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
