import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

type ButtonVariant = "primary" | "secondary" | "outline" | "dark";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-700 text-white hover:bg-orange-800 focus-visible:outline-orange-700",
  secondary:
    "bg-teal-800 text-white hover:bg-teal-900 focus-visible:outline-teal-800",
  outline:
    "border-2 border-slate-900 bg-transparent text-slate-950 hover:bg-slate-950 hover:text-white focus-visible:outline-slate-950",
  dark:
    "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-950",
};

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  to: string;
  variant?: ButtonVariant;
};

export function ButtonLink({
  children,
  className = "",
  to,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const classes = `inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-bold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${variantClasses[variant]} ${className}`;
  const external = /^(?:https?:|mailto:|tel:)/.test(to);

  if (external) {
    return (
      <a className={classes} href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} to={to} {...props}>
      {children}
    </Link>
  );
}

