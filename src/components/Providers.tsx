"use client";

import React from "react";
import { LanguageProvider } from "@/src/context/LanguageContext";
import ParallaxGrid from "@/src/components/ParallaxGrid";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ParallaxGrid />
      <div className="relative z-10 min-h-screen">{children}</div>
    </LanguageProvider>
  );
}
