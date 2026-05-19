"use client";

const INPUT_CLASS =
  "w-full rounded-xl bg-dracula-card/40 border border-dracula-card text-dracula-fg text-sm px-3.5 py-2.5 placeholder:text-dracula-comment/60 outline-none focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/20 transition-all duration-150";

interface SnippetTextFieldProps {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  list?: string;
}

export default function SnippetTextField({
  label,
  list,
  onChange,
  placeholder,
  value,
}: SnippetTextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-dracula-comment">{label}</label>
      <input
        className={INPUT_CLASS}
        list={list}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
