"use client";

import { Check, Copy } from "lucide-react";
import { Highlight, themes, type Language } from "prism-react-renderer";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface CodeBlockProps {
  code: string;
  language?: Language;
}

function detectLanguage(code: string): Language {
  const source = code.trimStart();

  if (/^(pnpm|npm|yarn|bun|npx|curl)\b/.test(source)) {
    return "bash";
  }

  return "tsx";
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const resolvedLanguage = language ?? detectLanguage(code);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative">
      <Button
        type="button"
        onClick={copyCode}
        className="absolute top-2 right-4 z-10"
        aria-live="polite"
        variant={"outline"}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>

      <Highlight
        code={code.trim()}
        language={resolvedLanguage}
        theme={themes.nightOwl}
      >
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`tt-code-block bg-foreground dark:bg-background pr-20 ${className}`}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
