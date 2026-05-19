import { Code2 } from "lucide-react";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-dracula-purple" />
            <span className="font-bold text-base tracking-tight text-dracula-fg">SnippetVault</span>
        </Link>
    )
}