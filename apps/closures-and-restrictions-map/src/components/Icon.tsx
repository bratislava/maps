import { ReactComponent as ClosureIcon } from "../assets/icons/closure.svg";
import { ReactComponent as DigupIcon } from "../assets/icons/digup.svg";
import { ReactComponent as DisorderIcon } from "../assets/icons/disorder.svg";
import { ReactComponent as RepairIcon } from "../assets/icons/repair.svg";

interface IIcon {
  name: string;
  component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  background: string;
  border: string;
  text: string;
}

const icons: Array<IIcon> = [
  {
    name: "closure",
    component: ClosureIcon,
    background: "bg-closure",
    border: "border-8 border-closure-soft",
    text: "!text-closure"
  },
  {
    name: "digup",
    component: DigupIcon,
    background: "bg-digup",
    border: "border-8 border-digup-soft",
    text: "!text-digup"

  },
  {
    name: "disorder",
    component: DisorderIcon,
    background: "bg-disorder",
    border: "border-8 border-disorder-soft",
    text: "!text-disorder"
  },
  {
    name: "repair",
    component: RepairIcon,
    background: "bg-repair",
    border: "border-8 border-repair-soft",
    text: "!text-repair"
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
    : `${currentIcon?.text} ` + "bg-white z-50";

  const svgBorder = !isWhite ? "" : currentIcon?.border;

  if (shadow) svgBackground = svgBackground + " shadow-lg";
  const IconSvgComponent = currentIcon?.component;

  return IconSvgComponent ? (
    <div
      className={`relative transform active:scale-75 transition-transform cursor-pointer w-fit h-fit rounded-full text-white flex items-center justify-center  ${svgBackground}  ${svgBorder}`}
    >
      {count !== undefined && (
        <div
          className={
            `absolute -top-[6px] -right-[8px] rounded-full min-w-[24px] px-2 h-6 text font-bold flex items-center shadow-lg text-primary bg-primary-soft`
          }
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
