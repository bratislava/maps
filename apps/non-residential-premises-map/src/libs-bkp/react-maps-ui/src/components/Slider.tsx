import { useRef, ReactNode } from "react";
import { useSliderState } from "react-stately";
import cx from "classnames";

import { AriaSliderProps, useNumberFormatter, useSlider } from "react-aria";

import { Thumb } from "./Thumb";

export interface ISliderProps extends AriaSliderProps {
  unit?: ReactNode;
}

export const Slider = (props: ISliderProps) => {
  const { unit, minValue, maxValue } = props;

  const trackRef = useRef<HTMLDivElement | null>(null);

  const numberFormatter = useNumberFormatter({});

  const state = useSliderState({ ...props, numberFormatter });

  const { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef
  );

  return (
    <div className="flex flex-col gap-2" {...groupProps}>
      {/* Create a container for the label and output element. */}
      {props.label && (
        <div className="flex justify-between">
          <label {...labelProps}>{props.label}</label>
          <output className="w-max whitespace-nowrap" {...outputProps}>
            {state.getThumbValueLabel(0)} - {state.getThumbValueLabel(1)} {unit}
          </output>
        </div>
      )}
      {/* The track element holds the visible track line and the thumb. */}
      <div className="py-2">
        <div className="px-2 bg-gray-lightmode/20 dark:bg-gray-darkmode/20">
          <div className="py-[1px]">
            <div
              {...trackProps}
              ref={trackRef}
              className={cx("w-full", {
                "": state.isDisabled,
              })}
            >
              <Thumb
                isActive={state.getThumbValue(0) !== minValue}
                index={0}
                state={state}
                trackRef={trackRef}
              />
              <Thumb
                isActive={state.getThumbValue(1) !== maxValue}
                index={1}
                state={state}
                trackRef={trackRef}
              />
            </div>
          </div>
        </div>
      </div>
      {unit && (
        <div className="flex justify-between text-sm text-gray-lightmode/70 dark:text-gray-darkmode/70">
          <div>
            {numberFormatter.format(minValue ?? 0)} {unit}
          </div>
          <div>
            {numberFormatter.format(maxValue ?? 0)} {unit}
          </div>
        </div>
      )}
    </div>
  );
};
