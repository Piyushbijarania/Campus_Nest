"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({ children, type = "button", variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "rounded-lg px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md focus:ring-teal-500 " + className
      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm focus:ring-teal-500 " + className;
  return (
    <button type={type} className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  );
}
