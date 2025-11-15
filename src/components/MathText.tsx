import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText = ({ text, className = "" }: MathTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Replace LaTeX delimiters with rendered math
    const processedText = text.replace(/\$\$(.+?)\$\$/g, (match, latex) => {
      try {
        return katex.renderToString(latex, { displayMode: true, throwOnError: false });
      } catch (e) {
        return match;
      }
    }).replace(/\$(.+?)\$/g, (match, latex) => {
      try {
        return katex.renderToString(latex, { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    containerRef.current.innerHTML = processedText;
  }, [text]);

  return <div ref={containerRef} className={className} />;
};
