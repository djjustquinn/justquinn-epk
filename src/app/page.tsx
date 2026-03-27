"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LogoCanvas from "./LogoCanvas";

/* ── Scroll reveal hook ──────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Section wrapper ─────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Label chip ──────────────────────────────────────────────────────────── */
function Label({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-neon">{text}</span>
      <span className="block h-px w-10 bg-neon opacity-50" />
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Bio", "Music", "Photos", "Shows", "Book"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 transition-all duration-300 ${
        scrolled ? "py-3 bg-[#080810]/85 backdrop-blur-xl border-b border-[rgba(239,68,68,0.2)]" : "py-5"
      }`}
    >
      <a href="#hero" className="flex items-center">
        <LogoCanvas className="h-14 w-auto" />
      </a>

      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-8">
        {links.slice(0, -1).map((l) => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              className="text-[13px] font-medium tracking-widest uppercase text-slate-400 hover:text-white transition-colors"
            >
              {l}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#booking"
            className="text-[13px] font-medium tracking-widest uppercase text-neon border border-neon px-5 py-2 rounded hover:bg-neon hover:text-black transition-all"
          >
            Book
          </a>
        </li>
      </ul>

      {/* Mobile toggle */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-1 z-[101]"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-6 h-0.5 bg-slate-200 transition-all duration-300"
            style={
              open
                ? i === 0 ? { transform: "rotate(45deg) translate(5px,5px)" }
                : i === 1 ? { opacity: 0 }
                : { transform: "rotate(-45deg) translate(5px,-5px)" }
                : {}
            }
          />
        ))}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 bg-[#080810]/97 flex flex-col items-center justify-center gap-10 z-[100]">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l === "Book" ? "booking" : l.toLowerCase()}`}
              className="text-2xl font-semibold tracking-widest uppercase text-white"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Hero background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", objectPosition: "center 35%" }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,8,16,0.35) 0%, rgba(8,8,16,0.05) 50%, rgba(8,8,16,0.7) 100%)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(239,68,68,0.05) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Neon glows */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-neon opacity-[0.08] blur-[100px] animate-pulse-glow" />
      <div
        className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-cyan opacity-[0.06] blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "-2.5s" }}
      />

      <div className="relative z-10 text-center px-6">
        <p
          className="font-mono text-[11px] tracking-[0.25em] uppercase text-cyan mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          Electronic Press Kit
        </p>
        {/* Logo — canvas removes black bg pixel by pixel, then glow via filter */}
        <div className="flex justify-center mb-6">
          <LogoCanvas className="animate-float w-[clamp(240px,46vw,480px)] h-auto" />
        </div>
        <p
          className="font-mono text-[clamp(0.7rem,1.5vw,0.85rem)] tracking-[0.2em] uppercase text-slate-500 mb-12 opacity-0 animate-fade-up"
          style={{ animationDelay: "550ms", animationFillMode: "forwards" }}
        >
          DJ · Producer · Curator
        </p>
        <div
          className="flex gap-4 justify-center flex-wrap opacity-0 animate-fade-up"
          style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
        >
          <a
            href="#music"
            className="px-8 py-3 bg-neon text-black font-semibold text-sm tracking-wide rounded hover:bg-red-400 hover:shadow-[0_0_24px_rgba(239,68,68,0.6)] transition-all -translate-y-0 hover:-translate-y-0.5"
          >
            Listen Now
          </a>
          <a
            href="#booking"
            className="px-8 py-3 border border-neon text-neon font-semibold text-sm tracking-wide rounded hover:bg-neon hover:text-black hover:shadow-[0_0_24px_rgba(239,68,68,0.5)] transition-all"
          >
            Book Me
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#bio"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        aria-label="Scroll down"
      >
        <span
          className="block w-px h-16 mx-auto animate-scroll-line"
          style={{ background: "linear-gradient(to bottom, transparent, #ef4444)" }}
        />
      </a>
    </section>
  );
}

/* ── Bio ─────────────────────────────────────────────────────────────────── */
function Bio() {
  return (
    <section id="bio" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <Label text="About" />
        </Reveal>
        <div className="max-w-3xl">
          {/* Text */}
          <div className="space-y-5">
            <Reveal delay={150}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                The <span className="text-neon">Sound</span> of justQuinn
              </h2>
            </Reveal>
            {[
              "justQuinn is a Denver-based DJ and multi-genre track selector with a knack for reading a room and taking it somewhere unexpected. From deep house to hip-hop to bass-forward club cuts — every set is a journey.",
              "Holding residencies and appearances at some of Denver's top venues including Beacon Denver and Larimer Lounge, justQuinn has built a reputation for versatility, energy, and seamless selection.",
              "Whether it's a headline set, a birthday takeover, or a private event, justQuinn brings the same dedication to craft and dancefloor connection every single time.",
            ].map((p, i) => (
              <Reveal key={i} delay={200 + i * 60}>
                <p className="text-slate-400 leading-relaxed text-[1.05rem]">{p}</p>
              </Reveal>
            ))}

            <Reveal delay={380}>
              <div
                className="flex gap-10 mt-10 pt-8 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                {[
                  { num: "33+", label: "Shows Played" },
                  { num: "2.3K", label: "Followers" },
                  { num: "Denver", label: "Based In" },
                ].map(({ num, label }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-mono text-3xl font-bold text-neon leading-none">{num}</span>
                    <span className="font-mono text-[11px] tracking-widest uppercase text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Music ───────────────────────────────────────────────────────────────── */
function Music() {
  return (
    <section id="music" className="py-28 px-6" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-4xl mx-auto">
        <Reveal><Label text="Music" /></Reveal>
        <Reveal delay={80}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Watch <span className="text-neon">justQuinn</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="text-slate-400 mb-10 text-[1.05rem]">
            Live sets, mixes, and more on{" "}
            <a
              href="https://www.youtube.com/@dj.justQuinn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon hover:opacity-70 transition-opacity"
            >
              YouTube
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/IGudys5-rWs?start=1200"
                title="justQuinn — YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
        <Reveal delay={280}>
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.youtube.com/@dj.justQuinn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 border border-neon text-neon font-semibold text-sm tracking-wide rounded hover:bg-neon hover:text-black hover:shadow-[0_0_24px_rgba(239,68,68,0.5)] transition-all"
            >
              More on YouTube
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Photos ──────────────────────────────────────────────────────────────── */
function Photos() {
  const photos = [
    { src: "/photos/photo-03.jpg", large: true, label: "Press Photo 1" },
    { src: "/photos/photo-05.jpg", label: "Press Photo 2" },
    { src: "/photos/photo-08.jpg", label: "Press Photo 3" },
    { src: "/photos/photo-11.jpg", label: "Press Photo 4" },
    { src: "/photos/photo-14.jpg", label: "Press Photo 5" },
  ];

  return (
    <section id="photos" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal><Label text="Press Photos" /></Reveal>
        <Reveal delay={80}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Press <span className="text-neon">Gallery</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="text-slate-500 mb-12 text-[1.05rem]">
            High-res downloads available on request —{" "}
            <a href="#booking" className="text-neon border-b border-transparent hover:border-neon transition-colors">
              contact for assets
            </a>.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map(({ src, large, label }, i) => (
            <Reveal key={src} delay={i * 60} className={large ? "col-span-2" : ""}>
              <div className="relative group rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: large ? "16/9" : "4/3" }}
                >
                  <Image
                    src={src}
                    alt={label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute inset-0 bg-neon/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold tracking-widest uppercase">Download</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Shows ───────────────────────────────────────────────────────────────── */
function Shows() {
  const shows = [
    { month: "APR", day: "03", venue: "Beacon Denver", location: "Denver, CO", tag: "Upcoming" },
    { month: "MAY", day: "15", venue: "Larimer Lounge", location: "Denver, CO", tag: "Bday Takeover" },
  ];

  return (
    <section id="shows" className="py-28 px-6" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-5xl mx-auto">
        <Reveal><Label text="Live" /></Reveal>
        <Reveal delay={80}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
            Upcoming <span className="text-neon">Shows</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-2">
          {shows.map(({ month, day, venue, location, tag }, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="flex items-center gap-6 md:gap-8 p-6 md:p-8 rounded-xl border transition-all duration-300 hover:translate-x-1 group"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div
                  className="flex flex-col items-center pr-6 md:pr-8 min-w-[52px] border-r"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-neon">{month}</span>
                  <span className="font-mono text-3xl font-bold leading-none">{day}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[1.05rem]">{venue}</h3>
                  <p className="text-sm text-slate-500">{location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="hidden sm:block font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded border"
                    style={{ color: "var(--neon-cyan)", borderColor: "rgba(249,115,22,0.35)", background: "rgba(249,115,22,0.08)" }}
                  >
                    {tag}
                  </span>
                  <a
                    href={tag === "Private" ? "#booking" : "#"}
                    className="text-[12px] font-semibold tracking-wide px-4 py-2 border rounded transition-all hover:border-neon hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    style={{ borderColor: "var(--border)", color: "var(--neon)" }}
                  >
                    {tag === "Private" ? "Inquire" : "Tickets"}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ── Booking ─────────────────────────────────────────────────────────────── */
function Booking() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    }, 900);
  }

  const inputClass = `w-full rounded-lg px-4 py-3 text-[0.95rem] text-slate-200 outline-none transition-all duration-200 focus:ring-2 focus:ring-neon/30 focus:border-neon`;
  const inputStyle = { background: "var(--surface)", border: "1px solid var(--border)" };

  return (
    <section id="booking" className="py-28 px-6" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-2xl mx-auto">
        <Reveal><Label text="Contact" /></Reveal>
        <Reveal delay={80}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Book <span className="text-neon">justQuinn</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="text-slate-400 mb-12 text-[1.05rem]">
            For bookings, collabs, and press inquiries — reach out below or directly.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-[180px_1fr] gap-12 items-start">
          {/* Contact info */}
          <Reveal delay={180}>
            <div className="flex flex-col gap-7">
              {[
                { label: "Booking & General", email: "dj.justquinn@gmail.com" },
              ].map(({ label, email }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-slate-500 mb-1">{label}</p>
                  <a href={`mailto:${email}`} className="text-neon text-sm hover:opacity-70 transition-opacity">{email}</a>
                </div>
              ))}

              <div className="flex gap-2 mt-1">
                {[
                  { label: "IG", href: "https://www.instagram.com/dj.justquinn/" },
                  { label: "SC", href: "#" },
                  { label: "MC", href: "#" },
                  { label: "YT", href: "https://www.youtube.com/@dj.justQuinn" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg border font-mono text-[11px] font-bold text-slate-500 transition-all hover:border-neon hover:text-neon hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={220}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-slate-500 mb-2">Name</label>
                  <input type="text" name="name" placeholder="Your name" required className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-slate-500 mb-2">Email</label>
                  <input type="email" name="email" placeholder="your@email.com" required className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-slate-500 mb-2">Inquiry Type</label>
                <select name="inquiry" className={inputClass} style={inputStyle}>
                  <option value="">Select type...</option>
                  <option>Booking / Performance</option>
                  <option>Collaboration / Production</option>
                  <option>Press / Interview</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-slate-500 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell me about your event, venue, date, budget..."
                  required
                  className={`${inputClass} resize-y min-h-[140px]`}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full py-3 bg-neon text-black font-bold text-sm tracking-wide rounded-lg transition-all hover:bg-red-400 hover:shadow-[0_0_24px_rgba(239,68,68,0.5)] disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : status === "done" ? "Sent!" : "Send Inquiry"}
              </button>
              {status === "done" && (
                <p className="text-center font-mono text-[13px] text-cyan border border-cyan/30 bg-cyan/5 rounded-lg py-3">
                  Message sent! I&apos;ll get back to you within 48 hours.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-12 text-center border-t" style={{ borderColor: "var(--border)" }}>
      <p className="font-mono text-lg font-bold text-neon tracking-wider mb-2">justQuinn</p>
      <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} justQuinn. All rights reserved.</p>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Bio />
        <Music />
        <Photos />
        <Shows />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
