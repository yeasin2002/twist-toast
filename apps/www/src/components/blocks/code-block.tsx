import { Highlight, themes, type Language } from "prism-react-renderer";

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

  return (
    <Highlight
      code={code.trim()}
      language={resolvedLanguage}
      theme={themes.nightOwl}
    >
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`tt-code-block bg-foreground dark:bg-background ${className}`}
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
  );
}
