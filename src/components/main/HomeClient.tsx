"use client";

import CodePreview from "@/src/components/main/CodePreview";
import FAQ from "@/src/components/main/FAQ";
import Features from "@/src/components/main/Features";
import HomeHero from "@/src/components/main/HomeHero";
import HomeNav from "@/src/components/main/HomeNav";
import HowItWorks from "@/src/components/main/HowItWorks";
import MobileBottomNav from "@/src/components/main/MobileBottomNav";
import SnippetBrowserMockup from "@/src/components/main/SnippetBrowserMockup";

interface HomeClientProps {
  isAuthenticated: boolean;
}

export default function HomeClient({ isAuthenticated }: HomeClientProps) {
  return (
    <div className="min-h-screen pb-24 text-dracula-fg md:pb-0">
      <HomeNav isAuthenticated={isAuthenticated} />
      <main>
        <HomeHero isAuthenticated={isAuthenticated} />
        <SnippetBrowserMockup />
        <Features />
        <HowItWorks />
        <CodePreview />
        <FAQ />
      </main>
      <MobileBottomNav />
    </div>
  );
}
