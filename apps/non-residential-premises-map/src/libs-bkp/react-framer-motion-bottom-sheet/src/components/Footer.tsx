import { ReactNode } from "react";

export type FooterProps = {
  children?: ReactNode;
};

export const Footer = ({ children }: FooterProps) => {
  return <div>{children}</div>;
};
