import React, { useMemo } from "react";
import { computeDiff } from "@/src/utils/snippets/diff";

interface CodeDiffViewerProps {
  oldCode: string;
  newCode: string;
}

export default function CodeDiffViewer({ oldCode, newCode }: CodeDiffViewerProps) {
  const diffLines = useMemo(() => computeDiff(oldCode, newCode), [oldCode, newCode]);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-dracula-card bg-dracula-bg/50">
      <div className="max-h-[400px] overflow-y-auto font-mono text-xs leading-relaxed">
        <table className="w-full table-fixed border-collapse select-none">
          <tbody>
            {diffLines.map((line, index) => {
              const isAdded = line.type === "added";
              const isRemoved = line.type === "removed";
              
              let rowClass = "hover:bg-dracula-card/10 text-dracula-fg";
              let indicator = " ";
              if (isAdded) {
                rowClass = "bg-dracula-green/10 text-dracula-green hover:bg-dracula-green/15";
                indicator = "+";
              } else if (isRemoved) {
                rowClass = "bg-dracula-red/10 text-dracula-red hover:bg-dracula-red/15 line-through";
                indicator = "-";
              }

              return (
                <tr key={index} className={rowClass}>
                  <td className="w-10 text-right pr-2 text-dracula-comment/40 select-none border-r border-dracula-card/30">
                    {line.oldLineNum || ""}
                  </td>
                  <td className="w-10 text-right pr-2 text-dracula-comment/40 select-none border-r border-dracula-card/30">
                    {line.newLineNum || ""}
                  </td>
                  <td className="w-6 text-center select-none font-bold text-xs">
                    {indicator}
                  </td>
                  <td className="pl-2 pr-4 py-0.5 whitespace-pre overflow-x-auto select-text font-mono">
                    {line.content || " "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
