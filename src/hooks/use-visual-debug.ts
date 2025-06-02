import { useEffect, useRef } from "react";

export function useVisualDebug() {
  const enabledRef = useRef(false);
  const styleTagRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const toggleDebug = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "b") {
        enabledRef.current = !enabledRef.current;
        if (enabledRef.current) {
          applyOutline();
        } else {
          removeOutline();
        }
      }
    };

    window.addEventListener("keydown", toggleDebug);
    return () => {
      window.removeEventListener("keydown", toggleDebug);
      removeOutline();
    };
  }, []);

  const applyOutline = () => {
    const style = document.createElement("style");
    style.setAttribute("id", "debug-outline");

    // Generate depth-based colors up to 6 levels deep
    const rules = Array.from({ length: 6 }, (_, i) => {
      const selectors = Array(i + 1)
        .fill("*:not(svg *):not(svg)")
        .join(" > ");
      const color = `hsl(${(i * 60) % 360}, 100%, 50%)`;
      return `${selectors} { outline: 1px solid ${color} !important; }`;
    }).join("\n");

    style.innerHTML = rules;
    document.head.appendChild(style);
    styleTagRef.current = style;
  };

  const removeOutline = () => {
    if (styleTagRef.current) {
      styleTagRef.current.remove();
      styleTagRef.current = null;
    }
  };
}
