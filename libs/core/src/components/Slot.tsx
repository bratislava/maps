import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from "react";
import cx from "classnames";
import { SlotAnimation } from "src/types";
import { BottomSheet } from "react-spring-bottom-sheet";

export interface ISlotProps {
  containerRef?: MutableRefObject<any>;
  animation?: SlotAnimation;
  children?: ReactNode;
  isVisible?: boolean;
  className?: string;
  bottomSheetOptions?: {
    header?: ReactNode;
    footer?: ReactNode;
  };
  onClose?: () => void;
}

export const Slot = forwardRef<HTMLDivElement, ISlotProps>(
  (
    {
      children,
      isVisible = false,
      animation = "none",
      className,
      bottomSheetOptions,
      onClose,
    },
    ref
  ) => {
    const [displayedChildren, setDisplayedChildren] = useState(children);

    useEffect(() => {
      if (isVisible) {
        setDisplayedChildren(children);
      }
    }, [isVisible, children, setDisplayedChildren]);

    const animationClasses = {
      none: ["", ""],
      "slide-left": ["left-0 translate-x-0", "left-0 -translate-x-full"],
      "slide-right": ["right-0 translate-x-0", "right-0 translate-x-full"],
    };

    return bottomSheetOptions ? (
      <BottomSheet
        snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 88]}
        defaultSnap={({ snapPoints }) => snapPoints[1]}
        blocking={false}
        onDismiss={onClose}
        open={isVisible}
        className={cx(className, "relative z-30")}
        expandOnContentDrag
        header={bottomSheetOptions.header}
        footer={bottomSheetOptions.footer}
      >
        {displayedChildren}
      </BottomSheet>
    ) : (
      <div
        ref={ref}
        className={cx(
          className,
          "fixed z-20 transform duration-500 ease-in-out transition-all max-h-full",
          {
            "shadow-none": !isVisible,
            [animationClasses[animation][0]]: isVisible,
            [animationClasses[animation][1]]: !isVisible,
          }
        )}
      >
        {children}
      </div>
    );
  }
);
