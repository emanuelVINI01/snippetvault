"use client";

import { useState } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import FAQItem from "./FAQItem";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section id="faq" className="relative scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading className="mb-12 text-center">{t.home.faqTitle}</SectionHeading>
        <div className="space-y-4">
          {t.home.faqs.map((faq, index) => (
            <FAQItem
              key={faq.q}
              answer={faq.a}
              index={index}
              isOpen={openIdx === index}
              onToggle={() => setOpenIdx((current) => (current === index ? null : index))}
              question={faq.q}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
