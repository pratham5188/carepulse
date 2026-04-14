import { useId } from "react";

interface CarePulseLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "white" | "gradient";
}

const sizeMap = {
  sm: { container: "h-8 w-8", icon: 20 },
  md: { container: "h-10 w-10", icon: 26 },
  lg: { container: "h-12 w-12", icon: 32 },
  xl: { container: "h-20 w-20", icon: 52 },
};

const pulsePathD = "M2 12 L6 12 L8 6 L11 18 L14 8 L16 14 L18 12 L22 12";

function PulseSweep({ size }: { size: number }) {
  const id = useId();
  const gradientId = `sweep-${id.replace(/:/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="1" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-1 0; 2 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <path
        d={pulsePathD}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.2}
      />
      <path
        d={pulsePathD}
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function CarePulseLogo({ size = "md", className = "", variant = "default" }: CarePulseLogoProps) {
  const s = sizeMap[size];

  const bgClass = variant === "white"
    ? "bg-white/20 backdrop-blur-sm"
    : variant === "gradient"
      ? "bg-gradient-to-br from-primary to-accent"
      : "bg-primary";

  return (
    <div
      className={`${s.container} rounded-xl ${bgClass} flex items-center justify-center shrink-0 ${className}`}
    >
      <PulseSweep size={s.icon} />
    </div>
  );
}

export function CarePulseLogoAnimated({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-6 ${className} animate-fadeIn`}>
      <div className="animate-slideUp">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
          <PulseSweep size={48} />
        </div>
      </div>

      <div className="text-center animate-fadeIn" style={{ animationDelay: "0.8s", animationFillMode: "backwards" }}>
        <h1 className="font-display font-bold text-4xl tracking-tight text-white">
          Care<span className="text-red-400 inline-block animate-pulse-text">Pulse</span>
        </h1>
        <p className="text-white/50 text-sm mt-1 font-medium tracking-wide">
          Intelligent Healthcare Analytics
        </p>
      </div>
    </div>
  );
}
