
import { ReactComponent as CvickoIcon } from "../assets/icons/cvicko.svg";
import { ReactComponent as OtherIcon } from "../assets/icons/other.svg";
import { ReactComponent as PoolIcon } from "../assets/icons/pool.svg";

export const icons = [
  {
    name: "cvicko",
    component: CvickoIcon,
  },
  {
    name: "pool",
    component: PoolIcon,
  },
] as const;

export interface IIconProps {
  icon?: typeof icons[number]["name"];
  size?: number;
}

export const Icon = ({ icon, size = 24 }: IIconProps) => {
  const IconSvgComponent = icons.find((i) => i.name === icon)?.component;

  return IconSvgComponent ? (
    <IconSvgComponent width={size} height={size} />
  ) : (
    <OtherIcon width={size} height={size} />
  );
};
