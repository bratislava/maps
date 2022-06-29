import React, {
  ReactNode,
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
  forwardRef,
} from "react";
import cx from "classnames";
import { BottomSheet } from "react-spring-bottom-sheet";
import { mapboxContext } from "../Mapbox/Mapbox";

export interface ISlotChildProps {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export interface ISlotProps {
  name: string;
  children?: ReactNode | FC<ISlotChildProps>;
  isVisible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  bottomSheetOptions?: {
    header?: ReactNode;
    footer?: ReactNode;
  };
  openPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  avoidControls?: boolean;
}

export const Slot = forwardRef<HTMLDivElement, ISlotProps>(
  (
    {
      name,
      bottomSheetOptions,
      children,
      isVisible: inputIsVisible,
      setVisible: inputSetVisible,
      openPadding = {},
      avoidControls = true,
    },
    ref
  ) => {
    const [isVisible, setVisible] = useState(true);

    const { considerPadding, removePadding } = useContext(mapboxContext);

    useEffect(() => {
      considerPadding({
        name,
        padding: openPadding,
        isVisible: inputIsVisible ?? isVisible,
        avoidControls,
      });
      return () => {
        removePadding(name);
      };
    }, [name, openPadding, isVisible, avoidControls]);

    return bottomSheetOptions ? (
      <BottomSheet
        snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 88]}
        defaultSnap={({ snapPoints }) => snapPoints[1]}
        blocking={false}
        onDismiss={() => {
          inputSetVisible ? inputSetVisible(false) : setVisible(false);
        }}
        open={inputIsVisible ?? isVisible}
        className={cx("relative z-30")}
        expandOnContentDrag
        header={bottomSheetOptions.header}
        footer={bottomSheetOptions.footer}
      >
        {typeof children === "function"
          ? children({ isVisible, setVisible })
          : children}
      </BottomSheet>
    ) : typeof children === "function" ? (
      children({
        isVisible: inputIsVisible ?? isVisible,
        setVisible: inputSetVisible ?? setVisible,
      })
    ) : (
      <>{children}</>
    );
  }
);

Slot.displayName = "Slot";
