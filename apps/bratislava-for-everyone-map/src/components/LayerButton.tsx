import { Eye, EyeCrossed } from "@bratislava/react-maps-icons";
import cx from "classnames";

export type LayerButtonProps = {
  color?: string;
  isVisible: boolean;
  title: string;
  onClick?: () => void;
};

export const LayerButton = ({ color, isVisible, title, onClick }: LayerButtonProps) => {
  return (
    <button
      className={cx(
        "w-full flex justify-between items-center py-3 text-left border-l-4 pr-6 pl-[20px] transition-all bg-opacity-10 dark:bg-opacity-10",
        {
          "bg-gray-lightmode dark:bg-gray-darkmode": isVisible,
          "border-background-lightmode dark:border-background-darkmode": !isVisible,
        },
      )}
      style={{
        borderColor: isVisible ? color : "transparent",
      }}
      onClick={onClick}
    >
      <div>{title}</div>
      <div className="cursor-pointer p-1">
        <Eye isCrossed={!isVisible} size="default" />
      </div>
    </button>
  );
};
