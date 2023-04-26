
import { ReactComponent as CvickoIcon } from "../assets/icons/cvicko.svg";
import { ReactComponent as OtherIcon } from "../assets/icons/other.svg";
import { ReactComponent as PoolIcon } from "../assets/icons/pool.svg";
import { ReactComponent as WaterIcon } from "../assets/icons/water.svg";


export const icons = [
  {
    name: "cvicko",
    component: CvickoIcon,
  },
  {
    name: "pool",
    component: PoolIcon,
  },
  {
    name: "water",
    component: WaterIcon,
  },
] as const;

export interface IIconProps {
  icon?: typeof icons[number]["name"];
  size?: number;
  isActicve?: boolean;
}

export const Icon = ({ icon, size = 24, isActicve = false }: IIconProps) => {
  const IconSvgComponent = icons.find((i) => i.name === icon)?.component;

  const svgBorder = !isActicve ? "" : 'border-8 border-primary-soft';

  const svgBackground: string = !isActicve
    ? `bg-primary text-primary`
    : `!text-primary ` + "bg-white z-50";

  return IconSvgComponent ? (
    <div
      className={`relative transform active:scale-75 transition-transform cursor-pointer w-fit h-fit rounded-full text-white flex items-center justify-center  ${svgBackground}  ${svgBorder}`}
    >
      <IconSvgComponent width={size} height={size} />
    </div>
  ) : (
    <></>
  );


};
