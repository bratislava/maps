import cx from "classnames";

import { ReactComponent as ClosureIcon } from "../assets/icons/closure.svg";
import { ReactComponent as DigupIcon } from "../assets/icons/digup.svg";
import { ReactComponent as DisorderIcon } from "../assets/icons/disorder.svg";
import { ReactComponent as RepairIcon } from "../assets/icons/repair.svg";

interface IIcon {
  name: string;
  component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  background: string;
}

const icons: Array<IIcon> = [
  {
    name: "closure",
    component: ClosureIcon,
    background: "bg-closure",
  },
  {
    name: "digup",
    component: DigupIcon,
    background: "bg-digup",
  },
  {
    name: "disorder",
    component: DisorderIcon,
    background: "bg-disorder",
  },
  {
    name: "repair",
    component: RepairIcon,
    background: "bg-repair",
  },
];

export interface IIconProps {
  icon: (typeof icons)[number]["name"];
  size?: number;
  isWhite?: boolean;
  count?: number;
  shadow?: boolean;
}

export const Icon = ({ icon, size = 24, isWhite = false, count, shadow = true }: IIconProps) => {
  const currentIcon: IIcon | undefined = icons.find((i) => i.name === icon);

  let svgBackground: string = !isWhite
    ? `${currentIcon?.background} text-secondary`
    : "bg-white !text-primary z-50";

  if (shadow) svgBackground = svgBackground + " shadow-lg";
  const IconSvgComponent = currentIcon?.component;

  return IconSvgComponent ? (
    <div
      className={`relative transform active:scale-75 transition-transform cursor-pointer w-fit h-fit rounded-full text-white flex items-center justify-center text-secondary ${svgBackground} shadow-lg`}
    >
      {count !== undefined && (
        <div
          className={cx(
            `absolute -top-[6px] -right-[8px] rounded-full min-w-[24px] px-2 h-6 text font-bold flex items-center shadow-lg text-primary bg-primary-soft`,
          )}
        >
          {count}
        </div>
      )}
      <IconSvgComponent width={size} height={size} />
    </div>
  ) : (
    <></>
  );
};
