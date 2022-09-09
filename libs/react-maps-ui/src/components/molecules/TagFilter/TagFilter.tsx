import cx from "classnames";
import { Tag } from "../../atoms/Tag/Tag";

interface IValue<T extends string> {
  key: T;
  label: string;
  isActive?: boolean;
}

export interface ITagFilter<T extends string> {
  title?: string;
  values?: IValue<T>[];
  onTagClick?: (key: T) => void;
}

export const TagFilter = <T extends string>({
  title,
  values = [],
  onTagClick = () => void 0,
}: ITagFilter<T>) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="px-6">{title}</label>
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
