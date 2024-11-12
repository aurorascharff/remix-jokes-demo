import { Link, LinkProps } from "@remix-run/react";
import React from "react";

type Props = {
  to: string;
  children: React.ReactNode;
};

export default function NavButton({
  to,
  children,
  ...otherProps
}: Props & LinkProps) {
  return (
    <Link
      {...otherProps}
      to={to}
      className="m-0 w-fit cursor-pointer rounded bg-yellow px-5 py-3 font-display text-lg font-bold leading-none text-purple shadow-lg"
    >
      {children}
    </Link>
  );
}
