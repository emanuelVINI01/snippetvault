"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { HelpCircle, Home, LayoutDashboard, LogIn, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#features", label: "Features", icon: Sparkles },
  { href: "/dashboard", label: "Vault", icon: LayoutDashboard },
  { href: "/#faq", label: "FAQ", icon: HelpCircle },
  { href: "/login", label: "Login", icon: LogIn },
];

const observedSections = ["features", "faq"];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    let frame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const anchorLine = window.innerHeight * 0.45;
        const currentSection =
          observedSections.find((sectionId) => {
            const section = document.getElementById(sectionId);
            if (!section) return false;

            const rect = section.getBoundingClientRect();
            return rect.top <= anchorLine && rect.bottom >= anchorLine;
          }) ?? null;

        setActiveSection(currentSection);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-dracula-card/80 bg-dracula-bg/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-stretch gap-0.5 sm:gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const hrefPath = href.split("#")[0] || "/";
          const hrefSection = href.split("#")[1];
          const isActive = hrefSection
            ? pathname === "/" && activeSection === hrefSection
            : pathname === hrefPath && (hrefPath !== "/" || activeSection === null);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex h-full min-w-0 flex-col items-center justify-between rounded-xl px-0.5 py-1.5 text-[9px] font-semibold uppercase tracking-tight transition-colors sm:px-1 sm:text-[10px] ${
                isActive ? "text-dracula-fg" : "text-dracula-comment hover:text-dracula-cyan"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="snippet-mobile-nav-pill"
                  className="absolute inset-0 rounded-xl border border-dracula-purple/35 bg-dracula-surface shadow-lg shadow-black/25"
                  transition={{ type: "spring", stiffness: 430, damping: 36 }}
                />
              )}
              <span
                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-7 sm:w-7 ${
                  isActive ? "bg-dracula-purple/15 text-dracula-purple" : "text-dracula-comment"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="relative z-10 block h-3 max-w-full truncate leading-3">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
