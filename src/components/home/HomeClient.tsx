"use client";

import CodePreview from "@/src/components/home/sections/CodePreview";
import FAQ from "@/src/components/home/sections/FAQ";
import Features from "@/src/components/home/sections/Features";
import HomeHero from "@/src/components/home/hero/HomeHero";
import HomeNav from "@/src/components/home/HomeNav";
import HowItWorks from "@/src/components/home/sections/HowItWorks";
import Intelligence from "@/src/components/home/sections/Intelligence";
import MobileBottomNav from "@/src/components/shared/navigation/MobileBottomNav";
import SnippetBrowserMockup from "@/src/components/home/mockups/SnippetBrowserMockup";

interface HomeClientProps {
  isAuthenticated: boolean;
}

export default function HomeClient({ isAuthenticated }: HomeClientProps) {
  return (
    <div className="min-h-screen pb-24 text-dracula-fg md:pb-0">
      <HomeNav isAuthenticated={isAuthenticated} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
          <div className="w-full lg:w-[48%]">
            <HomeHero isAuthenticated={isAuthenticated} />
          </div>
          <div className="w-full lg:w-[52%]">
            <SnippetBrowserMockup />
          </div>
        </div>
        <CodePreview />
        <Intelligence />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <MobileBottomNav />
    </div>
  );
}
