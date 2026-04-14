import { useState, useEffect, useRef, useSyncExternalStore, useCallback } from "react";

function getRefreshLabel(rate: number): string {
  if (rate <= 30) return "30Hz";
  if (rate <= 60) return "60Hz";
  if (rate <= 75) return "75Hz";
  if (rate <= 90) return "90Hz";
  if (rate <= 120) return "120Hz";
  if (rate <= 144) return "144Hz";
  if (rate <= 165) return "165Hz";
  if (rate <= 240) return "240Hz";
  return `${rate}Hz`;
}

interface DisplayFPSInfo {
  fps: number;
  refreshRate: number;
  isHighRefresh: boolean;
  label: string;
}

let cachedRefreshRate: DisplayFPSInfo | null = null;
let detectPromise: Promise<DisplayFPSInfo> | null = null;

function detectRefreshRate(): Promise<DisplayFPSInfo> {
  if (cachedRefreshRate) return Promise.resolve(cachedRefreshRate);
  if (detectPromise) return detectPromise;

  detectPromise = new Promise((resolve) => {
    const timestamps: number[] = [];
    const sampleCount = 30;

    function measure(timestamp: number) {
      timestamps.push(timestamp);

      if (timestamps.length >= sampleCount) {
        const deltas: number[] = [];
        for (let i = 1; i < timestamps.length; i++) {
          deltas.push(timestamps[i] - timestamps[i - 1]);
        }
        const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        const detectedFps = Math.round(1000 / avgDelta);

        const standardRates = [30, 60, 75, 90, 120, 144, 165, 240, 360];
        const matchedRate = standardRates.reduce((closest, rate) =>
          Math.abs(rate - detectedFps) < Math.abs(closest - detectedFps) ? rate : closest
        );

        cachedRefreshRate = {
          fps: matchedRate,
          refreshRate: matchedRate,
          isHighRefresh: matchedRate > 60,
          label: getRefreshLabel(matchedRate),
        };
        resolve(cachedRefreshRate);
        return;
      }

      requestAnimationFrame(measure);
    }

    requestAnimationFrame(measure);
  });

  return detectPromise;
}

export function useDisplayFPS(): DisplayFPSInfo {
  const [info, setInfo] = useState<DisplayFPSInfo>(
    cachedRefreshRate || { fps: 60, refreshRate: 60, isHighRefresh: false, label: "60Hz" }
  );

  useEffect(() => {
    if (cachedRefreshRate) {
      setInfo(cachedRefreshRate);
      return;
    }
    detectRefreshRate().then(setInfo);
  }, []);

  return info;
}

let liveFpsListeners: Set<() => void> = new Set();
let liveFpsValue = 0;
let liveFpsActive = false;
let liveFpsRaf = 0;
let liveFpsFrameCount = 0;
let liveFpsLastTime = 0;

function startLiveFps() {
  if (liveFpsActive) return;
  liveFpsActive = true;
  liveFpsLastTime = performance.now();
  liveFpsFrameCount = 0;

  function tick(now: number) {
    if (!liveFpsActive) return;
    liveFpsFrameCount++;
    const elapsed = now - liveFpsLastTime;

    if (elapsed >= 1000) {
      liveFpsValue = Math.round((liveFpsFrameCount * 1000) / elapsed);
      liveFpsFrameCount = 0;
      liveFpsLastTime = now;
      liveFpsListeners.forEach((fn) => fn());
    }

    liveFpsRaf = requestAnimationFrame(tick);
  }

  liveFpsRaf = requestAnimationFrame(tick);
}

function stopLiveFps() {
  liveFpsActive = false;
  cancelAnimationFrame(liveFpsRaf);
}

function subscribeLiveFps(callback: () => void) {
  liveFpsListeners.add(callback);
  if (liveFpsListeners.size === 1) startLiveFps();

  return () => {
    liveFpsListeners.delete(callback);
    if (liveFpsListeners.size === 0) stopLiveFps();
  };
}

function getLiveFpsSnapshot() {
  return liveFpsValue;
}

export function useLiveFPS(): number {
  return useSyncExternalStore(subscribeLiveFps, getLiveFpsSnapshot);
}

export function useAdaptiveAnimation(refreshRate: number) {
  const adaptDuration = useCallback(
    (baseDuration: number) => baseDuration * (refreshRate > 60 ? 0.85 : 1),
    [refreshRate]
  );

  return { adaptDuration };
}
