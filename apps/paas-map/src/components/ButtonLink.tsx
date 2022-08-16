import { Chevron } from "@bratislava/react-maps-icons";
import classnames from "classnames";

export interface IButtonProps {
  href: string;
  text: string;
  isSecondary?: boolean;
  noShadow?: boolean;
}

export const ButtonLink = ({ href, text, isSecondary = false, noShadow = false }: IButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={classnames(
        "group font-semibold select-none cursor-pointer flex items-center gap-4 w-fit px-6 h-12 rounded-lg",
        {
          "bg-primary text-secondary": !isSecondary,
          "bg-secondary text-primary": isSecondary,
          "shadow-lg": !noShadow,
        },
      )}
    >
      <span>{text}</span>
      <div className="relative flex items-center">
        <div
          className={classnames(
            "absolute transition-all right-1 w-0 group-hover:w-5 group-hover:-right-1 h-[2px] rounded-full",
            {
              "bg-secondary": !isSecondary,
              "bg-primary": isSecondary,
            },
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
