/// <reference types="react" />
import { RangeCalendarProps as AriaRangeCalendarProps } from "@react-aria/calendar";
import { DateValue } from "@react-types/calendar";
export type RangeCalendarProps = AriaRangeCalendarProps<DateValue>;
export declare const RangeCalendar: (props: RangeCalendarProps) => JSX.Element;
