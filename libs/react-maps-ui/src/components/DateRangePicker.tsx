import { X } from "@bratislava/react-maps-icons";
import { useEffect, useRef, useState } from "react";
import { I18nProvider, useDateRangePicker } from "react-aria";
import {
  DateRangePickerStateOptions,
  useDateRangePickerState,
} from "react-stately";
import { Button } from "./Button";
import { DateField } from "./DateField";
import { Popover } from "./Popover";
import { DateValue } from "@react-types/calendar";
import { RangeCalendar } from "./RangeCalendar";
import { useTranslation } from "react-i18next";

export type DateRangePickerProps = {
  onResetClick?: () => void;
} & DateRangePickerStateOptions;

const DateRangePicker = (props: DateRangePickerProps) => {
  const state = useDateRangePickerState(props);
  const ref = useRef<HTMLDivElement | null>(null);
  const { i18n } = useTranslation();
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
          className="flex items-center w-full bg-background-lightmode dark:bg-background-darkmode placeholder:text-foreground-lightmode placeholder:dark:text-foreground-darkmode border-2 font-medium placeholder:font-medium border-gray-lightmode dark:border-gray-darkmode border-opacity-10 dark:border-opacity-20 h-12 rounded-lg px-5 outline-none focus:border-primary focus:border-opacity-100 focus:dark:border-primary transition-all justify-between"
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
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H18V1H16V3H8V1H6V3H5C3.895 3 3.01 3.895 3.01 5L3 19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>
        </div>
      }
      panel={
        <div {...dialogProps}>
          <I18nProvider locale={i18n.language}>
            <RangeCalendar {...calendarProps} />
          </I18nProvider>
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
