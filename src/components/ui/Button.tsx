import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-violet-300/40 bg-gradient-to-b from-[#9b6dff] to-accent text-white shadow-[0_0_22px_rgba(124,58,237,0.45)] hover:from-[#a78bfa] hover:to-accent-hover",
  outline:
    "border border-accent/50 bg-transparent text-foreground shadow-[0_0_12px_rgba(124,58,237,0.15)] hover:border-accent/70 hover:bg-accent/10",
  ghost:
    "bg-transparent text-muted hover:bg-white/5 hover:text-foreground",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
