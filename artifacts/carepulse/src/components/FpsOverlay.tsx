import { useState, useEffect } from "react";
import { useLiveFPS, useDisplayFPS } from "@/hooks/use-display-fps";

function FpsDisplay() {
  const liveFps = useLiveFPS();
  const { refreshRate, label } = useDisplayFPS();

  const ratio = liveFps / refreshRate;
  const color = ratio >= 0.9 ? "#22c55e" : ratio >= 0.6 ? "#eab308" : "#ef4444";

  return (
    <div
      className="fixed top-3 right-3 z-[9999] pointer-events-none select-none"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/10 shadow-lg">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-white/50 leading-none">{label}</span>
          <span className="text-lg font-bold leading-tight" style={{ color }}>
            {liveFps}
          </span>
          <span className="text-[9px] text-white/40 leading-none">FPS</span>
        </div>
        <div className="w-1.5 h-8 bg-white/10 rounded-full overflow-hidden">
          <div
            className="w-full rounded-full transition-all duration-300"
            style={{
              height: `${Math.min(ratio * 100, 100)}%`,
              backgroundColor: color,
              marginTop: `${Math.max(100 - ratio * 100, 0)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function FpsOverlay() {
  const [visible, setVisible] = useState(() =>
    localStorage.getItem("carepulse-fps-overlay") === "true"
  );

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "carepulse-fps-overlay") {
        setVisible(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handler);

    const customHandler = () => {
      setVisible(localStorage.getItem("carepulse-fps-overlay") === "true");
    };
    window.addEventListener("fps-overlay-toggle", customHandler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("fps-overlay-toggle", customHandler);
    };
  }, []);

  if (!visible) return null;

  return <FpsDisplay />;
}
