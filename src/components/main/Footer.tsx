import { Keyboard, Heart } from 'lucide-react';
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full mt-24 py-12 border-t border-dracula-card bg-gradient-to-b from-dracula-bg to-dracula-purple/10 text-dracula-comment flex flex-col items-center justify-center transition-colors duration-300">
            <div className="max-w-4xl w-full px-6 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Brand & Description */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="flex items-center gap-2 text-dracula-fg font-semibold text-xl">
                        <Keyboard className="w-6 h-6 text-dracula-purple" />
                        <span>SnippetVault</span>
                    </div>
                    <p className="text-sm text-dracula-comment text-center md:text-left max-w-sm leading-relaxed">
                        Sua abóboda de snippets. Organize, salve e compartilhe seu código com segurança e estilo.
                    </p>
                </div>

                {/* Links */}
                <div className="flex flex-col items-center md:items-end gap-3 text-sm">
                    <a
                        href="https://github.com/emanuelVINI01/snippetvault"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-dracula-fg hover:text-dracula-purple transition-colors bg-dracula-purple/10 px-4 py-2 rounded-lg border border-dracula-purple/20 hover:border-dracula-purple/50"
                    >
                        <FaGithub className="w-4 h-4" />
                        <span className="font-medium">emanuelVINI01/snippetvault</span>
                    </a>

                    <div className="flex items-center gap-1.5 mt-2">
                        <span>Desenvolvido com</span>
                        <Heart className="w-4 h-4 text-dracula-red fill-dracula-red animate-pulse" />
                        <span>por</span>
                        <a
                            href="https://github.com/emanuelVINI01"
                            target="_blank"
                            rel="noreferrer"
                            className="text-dracula-fg hover:text-dracula-cyan transition-colors font-medium ml-1 underline decoration-dracula-cyan/30 hover:decoration-dracula-cyan underline-offset-4"
                        >
                            emanuelVINI
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-6 w-full max-w-4xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-dracula-comment border-t border-dracula-card/50">
                <p>&copy; {new Date().getFullYear()} SnippetVault. Todos os direitos reservados.</p>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <span className="opacity-50">v1.0.0</span>
                </div>
            </div>
        </footer>
    );
}