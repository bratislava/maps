import { useRef } from "react";
import { useCalendarCell, AriaCalendarCellProps } from "@react-aria/calendar";
import { isSameDay, getDayOfWeek } from "@internationalized/date";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { RangeCalendarState } from "react-stately";
import cx from "classnames";

export type CalendarCell = {
  state: RangeCalendarState;
} & AriaCalendarCellProps;

export const CalendarCell = ({ state, date }: CalendarCell) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref);

  // The start and end date of the selected range will have
  // an emphasized appearance.
  const isSelectionStart = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.start)
    : isSelected;
  const isSelectionEnd = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.end)
    : isSelected;

  // We add rounded corners on the left for the first day of the month,
  // the first day of each week, and the start date of the selection.
  // We add rounded corners on the right for the last day of the month,
  // the last day of each week, and the end date of the selection.
  const dayOfWeek = getDayOfWeek(date, "sk");
  const isRoundedLeft =
    isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date));

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td
      {...cellProps}
      className={`py-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={`w-10 h-10 outline-none group ${
          isRoundedLeft ? "rounded-l-full" : ""
        } ${isRoundedRight ? "rounded-r-full" : ""} ${
          isSelected ? (isInvalid ? "bg-red-300" : "bg-primary-soft") : ""
        } ${isDisabled ? "disabled" : ""}`}
      >
        <div
          className={cx(
            "w-full h-full rounded-full flex items-center justify-center",
            {
              "text-gray-400": isDisabled && !isInvalid,
              "ring-2 group-focus:z-2 ring-violet-600 ring-offset-2":
                isFocusVisible,
              "bg-red-600 text-white hover:bg-red-700":
                (isSelectionStart || isSelectionEnd) && isInvalid,
              "bg-primary text-white":
                (isSelectionStart || isSelectionEnd) && !isInvalid,
              "hover:bg-red-400":
                isSelected &&
                !isDisabled &&
                !(isSelectionStart || isSelectionEnd) &&
                isInvalid,
              "hover:bg-primary hover:text-white":
                isSelected &&
                !isDisabled &&
                !(isSelectionStart || isSelectionEnd) &&
                !isInvalid,
              "hover:bg-primary-soft": !isSelected && !isDisabled,
            }
          )}
        >
          {formattedDate}
        </div>
      </div>
    </td>
  );
};
