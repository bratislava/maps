import { useCalendarGrid, AriaCalendarGridProps } from "@react-aria/calendar";
import { getWeeksInMonth } from "@internationalized/date";
import { CalendarCell } from "./CalendarCell";
import { RangeCalendarState } from "react-stately";

export type CalendarGridProps = {
  state: RangeCalendarState;
} & AriaCalendarGridProps;

export function CalendarGrid({ state, ...props }: CalendarGridProps) {
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, "sk");

  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className="text-gray-600">
        <tr>
          {weekDays.map((day, index) => (
            <th className="text-center" key={index}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
