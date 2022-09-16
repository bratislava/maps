import { X } from "@bratislava/react-maps-icons";
import cx from "classnames";
import AnimateHeight from "react-animate-height";
import { useResizeDetector } from "react-resize-detector";

export interface IActiveFilter {
  title: string;
  items: string[];
}

export interface IActiveFiltersProps {
  areFiltersDefault?: boolean;
  activeFilters: IActiveFilter[];
  onResetClick: () => void;
  title: string;
  resetFiltersButtonText: string;
}

export const ActiveFilters = ({
  areFiltersDefault = true,
  activeFilters,
  onResetClick,
  title,
  resetFiltersButtonText,
}: IActiveFiltersProps) => {
  const { height: activeFiltersContentHeight, ref: activeFiltersContentRef } =
    useResizeDetector();

  return (
    <AnimateHeight
      className={cx(
        "bg-gray-lightmode dark:bg-gray-darkmode bg-opacity-10 dark:bg-opacity-10 transition-opacity",
        {
          "opacity-0": areFiltersDefault,
        }
      )}
      aria-hidden={false}
      height={areFiltersDefault ? 1 : activeFiltersContentHeight ?? 1}
    >
      <div ref={activeFiltersContentRef}>
        <div className="p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-md">{title}</h2>

          <div className="flex gap-x-8 flex-wrap">
            {activeFilters
              .filter(({ items }) => items.length)
              .map(({ title, items }, index) => (
                <div key={index}>
                  <div className="italic font-normal">{title}</div>
                  <div className="font-semibold">{items.join(", ")}</div>
                </div>
              ))}
          </div>
          <button
            onClick={onResetClick}
            className="flex gap-2 items-center hover:underline"
          >
            <span className="font-semibold">{resetFiltersButtonText}</span>
            <X className="text-primary" />
          </button>
        </div>
      </div>
    </AnimateHeight>
  );
};
