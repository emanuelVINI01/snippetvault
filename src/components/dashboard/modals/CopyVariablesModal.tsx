import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, Check, Copy } from "lucide-react";
import Modal from "./Modal";

interface CopyVariablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  variables: string[];
}

export default function CopyVariablesModal({
  isOpen,
  onClose,
  code,
  variables,
}: CopyVariablesModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showMask, setShowMask] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Initialize values
  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      const initialMask: Record<string, boolean> = {};
      variables.forEach((v) => {
        initialValues[v] = "";
        // Auto-mask sensitive field names
        const lower = v.toLowerCase();
        if (
          lower.includes("key") ||
          lower.includes("pass") ||
          lower.includes("pwd") ||
          lower.includes("token") ||
          lower.includes("secret")
        ) {
          initialMask[v] = true;
        } else {
          initialMask[v] = false;
        }
      });
      setValues(initialValues);
      setShowMask(initialMask);
      setCopied(false);
    }
  }, [isOpen, variables]);

  const handleChange = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const toggleMask = (name: string) => {
    setShowMask((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCopy = () => {
    const copiedCode = code.replace(/{{\s*([A-Za-z0-9_-]+)\s*}}/g, (match, name) => {
      return values[name] !== undefined && values[name].trim() !== ""
        ? values[name]
        : match;
    });

    navigator.clipboard.writeText(copiedCode);
    setCopied(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Copiar com Variáveis" maxWidth="max-w-md">
      <div className="flex flex-col gap-4 py-2">
        <p className="text-xs text-dracula-comment leading-relaxed">
          Este snippet possui placeholders. Preencha os valores abaixo para copiar o código pronto para uso.
        </p>

        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
          {variables.map((v) => {
            const isSensitive =
              v.toLowerCase().includes("key") ||
              v.toLowerCase().includes("pass") ||
              v.toLowerCase().includes("pwd") ||
              v.toLowerCase().includes("token") ||
              v.toLowerCase().includes("secret");

            const shouldMask = showMask[v];

            return (
              <div key={v} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dracula-fg flex items-center justify-between">
                  <span>{v}</span>
                  {isSensitive && (
                    <span className="text-[9px] text-dracula-pink uppercase font-bold tracking-wider">
                      Sensível
                    </span>
                  )}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={shouldMask ? "password" : "text"}
                    value={values[v] || ""}
                    onChange={(e) => handleChange(v, e.target.value)}
                    placeholder={`Valor para {{${v}}}`}
                    className="w-full bg-dracula-bg/50 border border-dracula-card rounded-lg pl-3 pr-10 py-2 text-xs text-dracula-fg placeholder-dracula-comment/30 focus:border-dracula-purple/60 focus:outline-none focus:ring-1 focus:ring-dracula-purple/60"
                  />
                  {isSensitive && (
                    <button
                      type="button"
                      onClick={() => toggleMask(v)}
                      className="absolute right-3 text-dracula-comment hover:text-dracula-fg transition-colors"
                    >
                      {shouldMask ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-dracula-card/30">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-dracula-comment hover:text-dracula-fg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              copied
                ? "bg-dracula-green text-dracula-bg"
                : "bg-dracula-purple text-dracula-bg hover:bg-dracula-purple/80"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar Preenchido</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
