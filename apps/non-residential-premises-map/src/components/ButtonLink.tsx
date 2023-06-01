import { Chevron } from "@bratislava/react-maps-icons";
import classnames from "classnames";
import { ReactNode } from "react";
import { colors } from "../utils/colors";
import type { TOccupacy } from "./Detail/DetailDataDisplay";

export interface IButtonProps {
  href: string;
  children: ReactNode;
  occupancy: TOccupacy;
  noShadow?: boolean;
}

export const ButtonLink = ({ href, children, occupancy, noShadow = false }: IButtonProps) => {
  const background = occupancy === 'forRent' ? colors.forRent : 'black';
  const txtColor = occupancy === 'forRent' ? 'black' : 'white';
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={classnames(
        `group font-semibold select-none text-${txtColor} cursor-pointer flex items-center gap-4 w-fit px-6 h-12 rounded-lg`,
        {
          "shadow-lg": !noShadow,
        },
      )}
      style={{ background }}
    >
      <span style={{ color: txtColor }}>{children}</span>
      <div className="relative flex items-center">
        <div
          className={classnames(
            `absolute transition-all right-1 w-0 group-hover:w-5 group-hover:-right-1 h-[2px] rounded-full bg-${txtColor}`,
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
