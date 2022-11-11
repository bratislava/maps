import { useRef, useTransition } from "react";
import {
  useDateFieldState,
  DateSegment,
  DateFieldState,
} from "@react-stately/datepicker";
import {
  useDateField,
  useDateSegment,
  AriaDateFieldProps,
} from "@react-aria/datepicker";
import { createCalendar } from "@internationalized/date";
import { DateValue } from "@react-types/datepicker";
import cx from "classnames";

export const DateField = (props: AriaDateFieldProps<DateValue>) => {
  const state = useDateFieldState({
    ...props,
    locale: "sk",
    createCalendar,
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div {...fieldProps} ref={ref} className="flex">
      {state.segments.map((segment, i) => (
        <DateSegmentRender key={i} segment={segment} state={state} />
      ))}
    </div>
  );
};

interface IDateSegmentProps {
  segment: DateSegment;
  state: DateFieldState;
}

const DateSegmentRender = ({ segment, state }: IDateSegmentProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
      }}
      className={cx(
        "box-content tabular-nums text-right outline-none rounded-sm focus:bg-primary-soft focus:text-primary group",
        !segment.isEditable ? "text-gray-500" : "text-gray-800"
      )}
    >
      {segment.isPlaceholder && (
        <span
          aria-hidden="true"
          className="block w-full text-center uppercase text-gray-500"
          style={{
            height: segment.isPlaceholder ? "" : 0,
            pointerEvents: "none",
          }}
        >
          {segment.placeholder}
        </span>
      )}
      {segment.isPlaceholder ? "" : segment.text}
    </div>
  );
};
