import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  color?: "primary" | "accent" | "purple" | "orange";
}

export function StatCard({ title, value, icon: Icon, trend, className, color = "primary" }: StatCardProps) {
  const colorStyles = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    purple: "text-violet-500 bg-violet-500/10",
    orange: "text-orange-500 bg-orange-500/10",
  };

  return (
    <div className={cn(
      "bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold font-display tracking-tight text-foreground">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-xl", colorStyles[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            trend.isPositive ? "text-emerald-600 bg-emerald-100" : "text-rose-600 bg-rose-100"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
