import { Keyboard } from "lucide-react";
import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="absolute top-8 left-8 flex items-center gap-2 group transition-all"
        >
            <Keyboard className="w-6 h-6 group-hover:scale-110 transition-transform text-purple" />
            <span
                className="text-xl font-bold tracking-tight text-purple"
            >
                Snippet Vault
            </span>
        </Link>
    )
}