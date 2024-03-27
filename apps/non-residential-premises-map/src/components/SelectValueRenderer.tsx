import * as React from "react";

export interface ISelectValueRendererProps {
  values: string[];
  placeholder: string;
  multiplePlaceholder: string;
  singlePlaceholder?: string;
}

export const SelectValueRenderer = ({
  values,
  placeholder,
  multiplePlaceholder,
  singlePlaceholder,
}: ISelectValueRendererProps) => {
  return (
    <div className="text-left px-3 truncate whitespace-nowrap">
      {values.length === 0
        ? placeholder
        : values.length === 1
        ? singlePlaceholder ?? values[0]
        : multiplePlaceholder}
    </div>
  );
};
