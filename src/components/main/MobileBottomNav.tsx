"use client";

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

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-dracula-card/80 bg-dracula-bg/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-stretch gap-0.5 sm:gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const hrefPath = href.split("#")[0] || "/";
          const isActive = href.includes("#") ? false : pathname === hrefPath;

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
