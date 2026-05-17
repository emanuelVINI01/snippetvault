"use client";

import FooterBrand from "./FooterBrand";
import FooterContact from "./FooterContact";
import FooterCopyright from "./FooterCopyright";
import FooterProjectLinks from "./FooterProjectLinks";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-dracula-card/70 bg-dracula-bg text-dracula-comment">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-32 pt-10 sm:gap-10 sm:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
          <FooterBrand />
          <FooterProjectLinks />
          <FooterContact />
        </div>
        <FooterCopyright />
      </div>
    </footer>
  );
}
