import { mapboxContext, PartialPadding } from "@bratislava/react-mapbox";
import { usePrevious } from "@bratislava/utils";
import cx from "classnames";
import {
  Dispatch,
  forwardRef,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { mapContext } from "../Map/Map";

export interface ISlotChildProps {
  isVisible: boolean | undefined;
  setVisible: Dispatch<SetStateAction<boolean | undefined>>;
}

export interface ISlotProps {
  name: string;
  children?: ReactNode;
  isVisible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean | undefined>>;
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
      bottomSheetOptions,
      children,
      isVisible: inputIsVisible,
      openPadding = {},
      avoidControls = true,
    },
    ref
  ) => {
    const [isVisible, setVisible] = useState<boolean | undefined>(undefined);

    const [padding, setPadding] = useState({} as PartialPadding);
    const [margin, setMargin] = useState({} as PartialPadding);

    const previousPadding = usePrevious(padding);
    const previousMargin = usePrevious(margin);

    useEffect(() => {
      setVisible(inputIsVisible ?? true);
    }, [inputIsVisible]);

    const paddingTop = useMemo(
      () => (openPadding.top ? (isVisible ? openPadding.top : 0) : undefined),
      [openPadding.top, isVisible]
    );
    const paddingRight = useMemo(
      () =>
        openPadding.right ? (isVisible ? openPadding.right : 0) : undefined,
      [openPadding.right, isVisible]
    );
    const paddingBottom = useMemo(
      () =>
        openPadding.bottom ? (isVisible ? openPadding.bottom : 0) : undefined,
      [openPadding.bottom, isVisible]
    );
    const paddingLeft = useMemo(
      () => (openPadding.left ? (isVisible ? openPadding.left : 0) : undefined),
      [openPadding.left, isVisible]
    );

    const marginTop = useMemo(
      () =>
        openPadding.top && avoidControls
          ? isVisible
            ? openPadding.top
            : 0
          : undefined,
      [openPadding.top, isVisible, avoidControls]
    );
    const marginRight = useMemo(
      () =>
        openPadding.right && avoidControls
          ? isVisible
            ? openPadding.right
            : 0
          : undefined,
      [openPadding.right, isVisible, avoidControls]
    );
    const marginBottom = useMemo(
      () =>
        openPadding.bottom && avoidControls
          ? isVisible
            ? openPadding.bottom
            : 0
          : undefined,
      [openPadding.bottom, isVisible, avoidControls]
    );
    const marginLeft = useMemo(
      () =>
        openPadding.left && avoidControls
          ? isVisible
            ? openPadding.left
            : 0
          : undefined,
      [openPadding.left, isVisible, avoidControls]
    );

    const { changeViewport } = useContext(mapboxContext);
    const { methods: mapMethods } = useContext(mapContext);

    useEffect(() => {
      const padding = {} as PartialPadding;
      if (paddingTop !== undefined) padding.top = paddingTop;
      if (paddingRight !== undefined) padding.right = paddingRight;
      if (paddingBottom !== undefined) padding.bottom = paddingBottom;
      if (paddingLeft !== undefined) padding.left = paddingLeft;
      setPadding(padding);
    }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

    useEffect(() => {
      const margin = {} as PartialPadding;
      if (marginTop !== undefined) margin.top = marginTop;
      if (marginRight !== undefined) margin.right = marginRight;
      if (marginBottom !== undefined) margin.bottom = marginBottom;
      if (marginLeft !== undefined) margin.left = marginLeft;
      setMargin(margin);
    }, [marginTop, marginRight, marginBottom, marginLeft]);

    useEffect(() => {
      if (
        padding &&
        JSON.stringify(padding) !== JSON.stringify(previousPadding)
      ) {
        changeViewport({
          padding,
        });
      }
    }, [padding, previousPadding, changeViewport]);

    useEffect(() => {
      if (JSON.stringify(margin) !== JSON.stringify(previousMargin)) {
        mapMethods.changeMargin(margin);
      }
    }, [margin, previousMargin, mapMethods]);

    return bottomSheetOptions ? (
      <BottomSheet
        snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 88]}
        defaultSnap={({ snapPoints }) => snapPoints[1]}
        blocking={false}
        // onDismiss={() => {
        //   inputSetVisible ? inputSetVisible(false) : setVisible(false);
        // }}
        open={isVisible ?? false}
        className={cx("relative z-30")}
        expandOnContentDrag
        header={bottomSheetOptions.header}
        footer={bottomSheetOptions.footer}
      >
        {children}
      </BottomSheet>
    ) : (
      <>{children}</>
    );
  }
);

Slot.displayName = "Slot";
