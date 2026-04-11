import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      aria-label={label ?? "Loading"}
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin glow-blue-sm",
          sizeMap[size],
        )}
      />
      {label && (
        <p className="text-muted-foreground font-body text-sm animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div
        className="flex flex-col items-center gap-4"
        aria-label="Loading"
        aria-busy="true"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin glow-blue" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary font-display text-lg font-bold text-glow-blue">
              ⚡
            </span>
          </div>
        </div>
        <p className="text-muted-foreground font-display text-sm tracking-widest uppercase animate-pulse">
          Initializing
        </p>
      </div>
    </div>
  );
}
