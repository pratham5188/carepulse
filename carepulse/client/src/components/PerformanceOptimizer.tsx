import { useEffect } from "react";
import { useDisplayFPS } from "@/hooks/use-display-fps";

export function PerformanceOptimizer() {
  const { refreshRate, isHighRefresh } = useDisplayFPS();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--display-fps", String(refreshRate));
    root.style.setProperty("--frame-time", `${(1000 / refreshRate).toFixed(2)}ms`);

    if (isHighRefresh) {
      root.style.setProperty("--transition-speed", "0.85");
      root.style.setProperty("--animation-smoothness", "cubic-bezier(0.22, 1, 0.36, 1)");
    } else {
      root.style.setProperty("--transition-speed", "1");
      root.style.setProperty("--animation-smoothness", "cubic-bezier(0.4, 0, 0.2, 1)");
    }

    root.classList.add("gpu-accelerated");

    if (isHighRefresh) {
      root.classList.add("high-refresh");
      root.classList.remove("standard-refresh");
    } else {
      root.classList.add("standard-refresh");
      root.classList.remove("high-refresh");
    }

    return () => {
      root.classList.remove("gpu-accelerated", "high-refresh", "standard-refresh");
    };
  }, [refreshRate, isHighRefresh]);

  return null;
}
