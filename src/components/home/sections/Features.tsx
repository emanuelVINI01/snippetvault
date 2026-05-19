"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import FeatureCard from "../common/FeatureCard";
import SectionHeading from "../common/SectionHeading";

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle={t.home.featuresSubtitle}>
          {t.home.featuresTitlePrefix}{" "}
          <span className="text-dracula-purple">{t.home.featuresTitleHighlight}</span>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.home.features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              description={feature.description}
              index={index}
              title={feature.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
