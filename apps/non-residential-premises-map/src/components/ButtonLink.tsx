import { Chevron } from "@bratislava/react-maps-icons";
import classnames from "classnames";
import { ReactNode } from "react";

export interface IButtonProps {
  href: string;
  children: ReactNode;
  color: string;
  noShadow?: boolean;
}

export const ButtonLink = ({ href, children, color, noShadow = false }: IButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={classnames(
        "group font-semibold select-none text-white cursor-pointer flex items-center gap-4 w-fit px-6 h-12 rounded-lg",
        {
          "shadow-lg": !noShadow,
        },
      )}
      style={{ background: color }}
    >
      <span>{children}</span>
      <div className="relative flex items-center">
        <div
          className={classnames(
            "absolute transition-all right-1 w-0 group-hover:w-5 group-hover:-right-1 h-[2px] rounded-full bg-white",
          )}
        ></div>
        <Chevron
          className="group-hover:translate-x-2 transition-transform"
          direction="right"
          size="xs"
        />
      </div>
    </a>
  );
};
