export const SelectValueRenderer = ({
  values,
  placeholder,
  multiplePlaceholder,
  singlePlaceholder,
}: {
  values: string[];
  placeholder: string;
  multiplePlaceholder: string;
  singlePlaceholder?: string;
}) => (
  <div className="text-left px-3 truncate whitespace-nowrap">
    {values.length === 0
      ? placeholder
      : values.length === 1
      ? singlePlaceholder ?? values[0]
      : multiplePlaceholder}
  </div>
);
