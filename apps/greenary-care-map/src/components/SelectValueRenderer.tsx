export const SelectValueRenderer = ({
  values,
  placeholder,
  multiplePlaceholder,
}: {
  values: string[];
  placeholder: string;
  multiplePlaceholder: string;
}) => (
  <div className="text-left px-3 truncate whitespace-nowrap">
    {values.length === 0 ? placeholder : values.length === 1 ? values[0] : multiplePlaceholder}
  </div>
);
