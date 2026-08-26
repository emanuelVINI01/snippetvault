interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * SnippetVault's badge mark: a rounded-square "vault door" holding a
 * bracket pair with a keyhole dot at its center - reads as both
 * "code snippet" (`< >`) and "vault" (the centered lock dot).
 * Pure geometric SVG, no external assets - also used to derive the
 * favicon / app icon.
 */
export default function LogoMark({ size = 28, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="SnippetVault"
    >
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#191a21" />
      <rect x="1" y="1" width="30" height="30" rx="8" stroke="#bd93f9" strokeOpacity="0.25" />
      <path
        d="M13.5 9.5 L7.5 16 L13.5 22.5"
        stroke="#bd93f9"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18.5 9.5 L24.5 16 L18.5 22.5"
        stroke="#bd93f9"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="16" cy="16" r="1.7" fill="#bd93f9" />
    </svg>
  );
}
