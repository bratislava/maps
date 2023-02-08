import cx from "classnames";
import { Popover, Tag } from "@bratislava/react-maps-ui";
import { Information } from "@bratislava/react-maps-icons";
import { ITooltip, tooltips } from "./App";

interface IValue<T extends string> {
  key: T;
  label: string;
  isActive?: boolean;
}

export interface ITagFilter<T extends string> {
  title?: string;
  values?: IValue<T>[];
  onTagClick?: (key: T) => void;
  modalHandler: (arg1: ITooltip | null) => void;
}

export const TagFilter = <T extends string>({
  title,
  values = [],
  onTagClick = () => void 0,
  modalHandler,
}: ITagFilter<T>) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex">
        <label className="px-6">{title}
          <Popover
            button={({ toggle }) => (
              <div
                className="cursor-pointer ml-[5px]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  modalHandler(tooltips.find(t => t.name === 'state') || null)
                  toggle();
                }}
              >
                <Information className="text-primary" size="sm" />
              </div>
            )}
            panel={
              <div className="flex flex-col gap-2 max-w-sm">
                <div className="text-md font-semibold">
                  {/* {t(`categories.${type}`)} */}
                </div>
                <div className="">{tooltips.find(t => t.name === 'state')?.description}</div>
              </div>
            }
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 px-6">
        {values.map(({ key, label, isActive = false }) => (
          <Tag
            key={key}
            className={cx("cursor-pointer", {
              "bg-primary-soft dark:text-background-darkmode": isActive,
            })}
            onClick={() => onTagClick(key)}
          >
            {label}
          </Tag>
        ))}
      </div>

    </div>
  );
};
