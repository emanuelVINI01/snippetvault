"use client";

import { useEffect, useRef } from "react";

export default function ParallaxGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const handleMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!gridRef.current) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const rotateX = ((event.clientY - centerY) / centerY) * 6;
        const rotateY = ((event.clientX - centerX) / centerX) * -6;

        gridRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-dracula-bg"
      style={{ transformStyle: "preserve-3d" }}
      aria-hidden="true"
    >
      <div
        ref={gridRef}
        className="absolute inset-[-20%] opacity-55"
        style={{
          transition: "transform 0.12s ease-out",
          backgroundImage: `
            linear-gradient(rgba(139,233,253,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,233,253,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />
      <div className="absolute inset-0 bg-dracula-bg/60" />
    </div>
  );
}
