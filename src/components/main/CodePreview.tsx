import { Code2, Terminal } from "lucide-react";

export default function CodePreview() {
  return (
    <section className="py-24 px-6 bg-dracula-card/10 border-y border-dracula-card/30">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dracula-cyan/10 border border-dracula-cyan/20 text-dracula-cyan text-xs font-semibold uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            Editor Bonito
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-dracula-fg leading-tight">
            Leia como se estivesse no seu editor.
          </h2>
          <p className="text-dracula-comment text-lg leading-relaxed">
            Nada de interfaces feias ou formatações quebradas. Ao salvar seu código, ele recebe syntax highlighting fiel às suas cores favoritas, preservando cada vírgula e indentação.
          </p>
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <div className="rounded-xl border border-dracula-card/70 overflow-hidden shadow-2xl shadow-black/40 bg-[#282a36]">
            {/* Window header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#21222c] border-b border-dracula-card/60">
              <span className="w-3 h-3 rounded-full bg-dracula-red" />
              <span className="w-3 h-3 rounded-full bg-dracula-yellow" />
              <span className="w-3 h-3 rounded-full bg-dracula-green" />
              <div className="ml-4 text-xs font-mono text-dracula-comment flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" /> utils.ts
              </div>
            </div>
            
            {/* Code Body */}
            <div className="p-5 overflow-x-auto text-sm font-mono leading-loose">
              <pre>
                <code className="text-[#f8f8f2]">
                  <span className="text-[#ff79c6]">export const</span> <span className="text-[#50fa7b]">debounce</span> <span className="text-[#ff79c6]">=</span> ({"\n"}
                  {"  "}<span className="text-[#ffb86c]">func</span>: (...args: <span className="text-[#8be9fd]">any</span>[]) {'=>'} <span className="text-[#8be9fd]">void</span>,{"\n"}
                  {"  "}<span className="text-[#ffb86c]">wait</span>: <span className="text-[#8be9fd]">number</span>{"\n"}
                  ) {'=>'} {"{"}{"\n"}
                  {"  "}<span className="text-[#ff79c6]">let</span> timeout: <span className="text-[#8be9fd]">NodeJS.Timeout</span>;{"\n"}
                  {"  "}<span className="text-[#ff79c6]">return</span> (...<span className="text-[#ffb86c]">args</span>: <span className="text-[#8be9fd]">any</span>[]) {'=>'} {"{"}{"\n"}
                  {"    "}<span className="text-[#50fa7b]">clearTimeout</span>(timeout);{"\n"}
                  {"    "}timeout <span className="text-[#ff79c6]">=</span> <span className="text-[#50fa7b]">setTimeout</span>(() {'=>'} <span className="text-[#50fa7b]">func</span>(...args), wait);{"\n"}
                  {"  "}{"}"};{"\n"}
                  {"}"};
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
