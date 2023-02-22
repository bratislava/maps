import { X } from "@bratislava/react-maps-icons";
import { useEffect, useRef, useState } from "react";
import { useDateRangePicker } from "react-aria";
import {
  DateRangePickerStateOptions,
  useDateRangePickerState,
} from "react-stately";
import { Button } from "./Button";
import { DateField } from "./DateField";
import { Popover } from "./Popover";
import { DateValue } from "@react-types/calendar";
import { RangeCalendar } from "./RangeCalendar";

export type DateRangePickerProps = {
  onResetClick?: () => void;
} & DateRangePickerStateOptions;

const DateRangePicker = (props: DateRangePickerProps) => {
  const state = useDateRangePickerState(props);
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(
    {
      ...props,
      value: {
        start: props.value?.start ?? (null as unknown as DateValue),
        end: props.value?.end ?? (null as unknown as DateValue),
      },
    },
    state,
    ref
  );

  const { value, onResetClick } = props;

  return (
    <Popover
      isOpen={state.isOpen}
      onOpenChange={(isOpen) => {
        !isOpen ? state.close() : undefined;
      }}
      className="!block !w-full"
      button={
        <div
          {...groupProps}
          ref={ref}
          className="flex items-center w-full bg-background-lightmode dark:bg-background-darkmode placeholder:text-foreground-lightmode placeholder:dark:text-foreground-darkmode border-[1px] font-medium placeholder:font-medium border-gray-lightmode dark:border-gray-darkmode border-opacity-10 dark:border-opacity-20 h-12 rounded-lg px-5 outline-none focus:border-primary focus:border-opacity-100 focus:dark:border-primary transition-all justify-between"
          aria-label="Date picker"
        >
          <div className="flex">
            <DateField {...startFieldProps} />
            <span style={{ padding: "0 4px" }}>-</span>
            <DateField {...endFieldProps} />
            {state.validationState === "invalid" && (
              <span aria-hidden="true">🚫</span>
            )}
          </div>
          <div className="flex items-center gap-2 -mr-1">
            {value && (
              <div
                tabIndex={0}
                onClick={onResetClick}
                className="cursor-pointer flex w-6 h-6 rounded-full bg-primary-soft items-center justify-center text-primary mr-1 hover:text-white hover:bg-primary focus:text-white focus:bg-primary outline-none"
              >
                <X size="xs" />
              </div>
            )}
            <Button {...buttonProps}>
              <svg 
                width="20" 
                height="22" 
                viewBox="0 0 20 22" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8889 2.85014V0.890137H14.3889V2.85014H5.60891V0.890137H4.10891V2.85014H0.128906V21.2401H14.1589L19.8589 15.5401V2.85014H15.8789H15.8889ZM4.10891 4.35014V5.64014H5.60891V4.35014H14.3889V5.64014H15.8889V4.35014H18.3689V7.22014H1.62891V4.35014H4.10891ZM1.62891 8.72014H18.3589V13.3401H11.9589V19.7401H1.62891V8.72014ZM13.5389 19.7401H13.4689V14.8401H18.3689V14.9101L13.5389 19.7401Z" fill="#333333" />
              </svg>
            </Button>
          </div>
        </div>
      }
      panel={
        <div {...dialogProps}>
          <RangeCalendar {...calendarProps} />
        </div>
      }
    />
  );
};

// This is ugly workaround for react-aria rerender because there is no option to reset
export const DateRangePickerFixed = (props: DateRangePickerProps) => {
  const [isRendered, setRendered] = useState(true);
  useEffect(() => {
    setRendered(true);
  }, [isRendered]);
  useEffect(() => {
    if (props.value === undefined) setRendered(false);
  }, [props.value]);

  return isRendered ? <DateRangePicker {...props} /> : null;
};
