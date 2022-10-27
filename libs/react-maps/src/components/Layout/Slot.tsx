import { mapboxContext, PartialPadding } from '@bratislava/react-mapbox';
import { usePrevious } from '@bratislava/utils';
import cx from 'classnames';
import {
  Dispatch,
  forwardRef,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { mapContext } from '../Map/Map';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';

export interface ISlotChildProps {
  isVisible: boolean | undefined;
  setVisible: Dispatch<SetStateAction<boolean | undefined>>;
}

export interface ISlotProps {
  name: string;
  children?: ReactNode;
  isVisible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean | undefined>>;
  openPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  autoPadding?: boolean;
  avoidControls?: boolean;
  verticalPosition?: VerticalPosition;
  horizontalPosition?: HorizontalPosition;
}

export const Slot = forwardRef<HTMLDivElement, ISlotProps>(
  (
    {
      children,
      isVisible,
      openPadding = {},
      avoidControls = true,
      autoPadding = false,
      verticalPosition,
      horizontalPosition,
    },
    forwardedRef,
  ) => {
    const [padding, setPadding] = useState({} as PartialPadding);
    const [margin, setMargin] = useState({} as PartialPadding);

    const previousPadding = usePrevious(padding);
    const previousMargin = usePrevious(margin);

    const { width, height, ref } = useResizeDetector();

    const paddingTop = useMemo(
      () => (openPadding.top ? (isVisible ? openPadding.top : 0) : undefined),
      [openPadding.top, isVisible],
    );
    const paddingRight = useMemo(
      () =>
        openPadding.right ? (isVisible ? openPadding.right : 0) : undefined,
      [openPadding.right, isVisible],
    );
    const paddingBottom = useMemo(
      () =>
        openPadding.bottom ? (isVisible ? openPadding.bottom : 0) : undefined,
      [openPadding.bottom, isVisible],
    );
    const paddingLeft = useMemo(
      () => (openPadding.left ? (isVisible ? openPadding.left : 0) : undefined),
      [openPadding.left, isVisible],
    );

    const marginTop = useMemo(
      () =>
        openPadding.top && avoidControls
          ? isVisible
            ? openPadding.top
            : 0
          : undefined,
      [openPadding.top, isVisible, avoidControls],
    );
    const marginRight = useMemo(
      () =>
        openPadding.right && avoidControls
          ? isVisible
            ? openPadding.right
            : 0
          : undefined,
      [openPadding.right, isVisible, avoidControls],
    );
    const marginBottom = useMemo(
      () =>
        openPadding.bottom && avoidControls
          ? isVisible
            ? openPadding.bottom
            : 0
          : undefined,
      [openPadding.bottom, isVisible, avoidControls],
    );
    const marginLeft = useMemo(
      () =>
        openPadding.left && avoidControls
          ? isVisible
            ? openPadding.left
            : 0
          : undefined,
      [openPadding.left, isVisible, avoidControls],
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

    return <div ref={ref}>{children}</div>;
  },
);

Slot.displayName = 'Slot';
