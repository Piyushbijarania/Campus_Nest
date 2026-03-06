"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
