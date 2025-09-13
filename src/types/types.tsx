import type { ReactNode } from "react";

export interface buttonProps {
  variants: "primary" | "secondary"; // add more if need and button ;
  classes?: string;
  children?: ReactNode;
  text?: string;
  handleClick?: () => void;
}
export interface AuthHeaderProps {
  title: string;
  description: string;
  link?: {
    url: string;
    text: string;
  };
  isLink: boolean;
}

export interface AuthFooterProps {
  text: string;
  handleBtnClick?: () => void;
}
