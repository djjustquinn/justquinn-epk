"use client";

import Image from "next/image";
import Link from "next/link";

const photos = Array.from({ length: 47 }, (_, i) => ({
  src: `/photos/photo-${String(i + 1).padStart(2, "0")}.jpg`,
  label: `Press Photo ${i + 1}`,
}));

export default function PhotosPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-6 py-10 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-neon mb-2">Press Photos</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              justQuinn <span className="text-neon">Gallery</span>
            </h1>
          </div>
          <Link
            href="/"
            className="text-[13px] font-medium tracking-widest uppercase text-slate-400 hover:text-white transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {photos.map(({ src, label }) => (
            <div
              key={src}
              className="break-inside-avoid rounded-xl overflow-hidden border group relative"
              style={{ borderColor: "var(--border)" }}
            >
              <Image
                src={src}
                alt={label}
                width={600}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-neon/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-bold tracking-widest uppercase">Press Photo</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-500 mb-6 text-sm">
            High-res files available for press & media use.
          </p>
          <Link
            href="/#booking"
            className="px-8 py-3 border border-neon text-neon font-semibold text-sm tracking-wide rounded hover:bg-neon hover:text-black hover:shadow-[0_0_24px_rgba(239,68,68,0.5)] transition-all"
          >
            Request High-Res
          </Link>
        </div>
      </div>
    </div>
  );
}
