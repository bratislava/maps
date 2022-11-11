import { useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useSliderThumb,
  VisuallyHidden,
} from "react-aria";
import { SliderState } from "react-stately";
import cx from "classnames";
import { motion } from "framer-motion";

export interface IThumbProps {
  state: SliderState;
  trackRef: React.MutableRefObject<HTMLDivElement | null>;
  index: number;
  isActive?: boolean;
}

export const Thumb = (props: IThumbProps) => {
  const { state, trackRef, index, isActive = false } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { thumbProps, inputProps, isDragging } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
    },
    state
  );

  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div {...thumbProps}>
      <motion.div
        className={cx(
          "w-4 h-4 rounded-full bg-gray-lightmode dark:bg-gray-darkmode hover:bg-primary dark:hover:bg-primary cursor-grab active:cursor-grabbing",
          {
            "outline outline-primary outline-2 outline-offset-2":
              isFocusVisible,
            "bg-primary dark:bg-primary": isDragging || isActive,
          }
        )}
      />
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
};
