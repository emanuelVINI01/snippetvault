"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";
import HomeHeroBadge from "./HomeHeroBadge";
import HomeHeroCta from "./HomeHeroCta";
import HomeHeroTitle from "./HomeHeroTitle";
import HomeTrustSignals from "./HomeTrustSignals";

interface HomeHeroProps {
  isAuthenticated: boolean;
}

export default function HomeHero({ isAuthenticated }: HomeHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center sm:px-6 sm:pt-36">
      <HomeHeroBadge label={t.home.badge} />
      <HomeHeroTitle />
      <HeroSubtitle text={t.home.subtitle} />
      <HomeHeroCta isAuthenticated={isAuthenticated} />
      <HomeTrustSignals />
    </section>
  );
}

function HeroSubtitle({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16, duration: 0.5, ease: "easeOut" }}
      className="mt-6 max-w-2xl text-base leading-relaxed text-dracula-comment sm:text-lg"
    >
      {text}
    </motion.p>
  );
}
