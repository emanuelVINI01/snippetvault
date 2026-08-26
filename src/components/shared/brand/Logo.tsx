import Link from "next/link";
import LogoMark from "./LogoMark";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="font-bold text-base tracking-tight text-dracula-fg">SnippetVault</span>
        </Link>
    )
}
