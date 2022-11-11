import { useRef } from "react";
import { useRangeCalendarState } from "@react-stately/calendar";
import {
  useRangeCalendar,
  RangeCalendarProps as AriaRangeCalendarProps,
} from "@react-aria/calendar";
import { createCalendar } from "@internationalized/date";
import { Button } from "./Button";
import { CalendarGrid } from "./CalendarGrid";
import { DateValue } from "@react-types/calendar";
import { Chevron } from "@bratislava/react-maps-icons";
import { useTranslation } from "react-i18next";

export type RangeCalendarProps = AriaRangeCalendarProps<DateValue>;

export const RangeCalendar = (props: RangeCalendarProps) => {
  const state = useRangeCalendarState({
    ...props,
    locale: "sk",
    createCalendar,
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref);

  return (
    <div {...calendarProps} ref={ref} className="inline-block">
      <div className="flex items-center pb-4">
        <Button className="p-1" {...prevButtonProps}>
          <Chevron direction="left" />
        </Button>
        <div className="flex-1 text-center font-bold text-md ml-2">{title}</div>
        <Button className="p-1" {...nextButtonProps}>
          <Chevron direction="right" />
        </Button>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
};
