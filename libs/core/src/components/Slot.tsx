import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from "react";
import cx from "classnames";

export interface ISlotProps {
  containerRef?: MutableRefObject<any>;
  alignHorizontally: "left" | "right";
  alignVertically: "top" | "bottom";
  children?: ReactNode;
  isOpen?: boolean;
  className?: string;
}

export const Slot = forwardRef<HTMLDivElement, ISlotProps>(
  (
    { children, isOpen = false, alignHorizontally, alignVertically, className },
    ref
  ) => {
    const [displayedChildren, setDisplayedChildren] = useState(children);

    useEffect(() => {
      if (isOpen) {
        setDisplayedChildren(children);
      }
    }, [isOpen, children, setDisplayedChildren]);

    return (
      <div
        ref={ref}
        className={cx(
          className,
          "fixed bg-background z-20 transform duration-500 ease-in-out transition-all max-h-full",
          {
            "shadow-lg": isOpen,
            "translate-x-full shadow-none": !isOpen,
            "left-0": alignHorizontally === "left",
            "right-0": alignHorizontally === "right",
            "top-0": alignVertically === "top",
            "bottom-0": alignVertically === "bottom",
          }
        )}
      >
        {displayedChildren}
      </div>
    );
  }
);
