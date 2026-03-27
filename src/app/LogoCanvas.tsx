"use client";

import { useEffect, useRef } from "react";

export default function LogoCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Any pixel darker than threshold → transparent
        const brightness = (r + g + b) / 3;
        if (brightness < 60) {
          data[i + 3] = 0;
        } else if (brightness < 120) {
          // Soft edge: partial transparency for anti-alias pixels
          data[i + 3] = Math.round(((brightness - 60) / 60) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
    img.src = "/justquinn-1-blk.png";
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="justQuinn"
      className={className}
      style={{
        display: "block",
        filter:
          "drop-shadow(0 0 28px rgba(192,132,252,0.9)) drop-shadow(0 0 70px rgba(192,132,252,0.4)) drop-shadow(0 0 110px rgba(192,132,252,0.2))",
      }}
    />
  );
}
