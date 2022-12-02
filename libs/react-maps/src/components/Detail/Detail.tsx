import {
  forwardRef,
  HTMLProps,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import { snapPoints } from 'react-spring-bottom-sheet/dist/types';
import cx from 'classnames';
import { Slot } from '../Layout/Slot';
import { useWindowSize } from 'usehooks-ts';
import { useResizeDetector } from 'react-resize-detector';
import { IconButton, ScrollArea } from '@bratislava/react-maps-ui';
import { X } from '@bratislava/react-maps-icons';

export type DetailProps = {
  children?: ReactNode;
  isBottomSheet?: boolean;
  bottomSheetSnapPoints?: snapPoints;
  bottomSheetDefaultSnapPointIndex?: number;
  onClose: () => void;
  isVisible?: boolean;
  onBottomSheetSnapChange?: (snap: number) => void;
};

export type DetailHandle = {
  snapTo: (index: number) => void;
};

export const Detail = forwardRef<DetailHandle, DetailProps>(
  (
    {
      children,
      isBottomSheet = false,
      bottomSheetSnapPoints = ({ maxHeight }) => [maxHeight, maxHeight / 2, 84],
      bottomSheetDefaultSnapPointIndex = 1,
      onClose,
      isVisible = true,
      onBottomSheetSnapChange,
      ...rest
    },
    forwardedRef,
  ) => {
    const sheetRef = useRef<BottomSheetRef>(null);

    const detailRef = useRef<HTMLDivElement>(null);
    const { height: detailHeight = 0 } = useResizeDetector({
      targetRef: detailRef,
    });

    const [currentSnap, setCurrentSnap] = useState(0);

    useEffect(() => {
      onBottomSheetSnapChange && onBottomSheetSnapChange(currentSnap);
    }, [currentSnap, onBottomSheetSnapChange]);

    // Update current snap
    const onSnapChange = useCallback(() => {
      requestAnimationFrame(() =>
        setCurrentSnap(sheetRef.current?.height === 84 ? 1 : 0),
      );
    }, []);

    const { height: windowHeight } = useWindowSize();

    const shouldBeBottomLeftCornerRounded = useMemo(() => {
      return windowHeight > detailHeight;
    }, [detailHeight, windowHeight]);

    useImperativeHandle(
      forwardedRef,
      () => ({
        snapTo: (snapIndex: number) => {
          sheetRef.current?.snapTo(({ snapPoints }) => snapPoints[snapIndex]);
        },
        ...rest,
      }),
      [rest],
    );

    return isBottomSheet ? (
      <Slot
        id="bottom-sheet-detail"
        position="bottom"
        padding={{ bottom: sheetRef.current?.height }}
      >
        <BottomSheet
          ref={sheetRef}
          snapPoints={bottomSheetSnapPoints}
          defaultSnap={({ snapPoints }) =>
            snapPoints[bottomSheetDefaultSnapPointIndex]
          }
          expandOnContentDrag
          blocking={false}
          className="relative z-30"
          open={isVisible}
          onSpringStart={onSnapChange}
        >
          <div className="text-foreground-lightmode dark:text-foreground-darkmode">
            {children}
          </div>
        </BottomSheet>
      </Slot>
    ) : (
      <Slot
        id="dektop-detail"
        position="top-right"
        isVisible={isVisible}
        autoPadding
      >
        <div
          ref={detailRef}
          className={cx(
            'w-96 bg-background-lightmode dark:bg-background-darkmode  border-l-2 border-b-2 border-[transparent] dark:border-gray-darkmode/20',
            {
              'shadow-lg': isVisible,
              'rounded-bl-lg': shouldBeBottomLeftCornerRounded,
            },
          )}
        >
          <IconButton
            className={cx(
              'hidden w-8 h-8 !rounded-full !border-0 !shadow-none absolute right-6 top-6 md:flex items-center justify-center z-50',
            )}
            onClick={onClose}
          >
            <X size="sm" />
          </IconButton>
          <ScrollArea>{children}</ScrollArea>
        </div>
      </Slot>
    );
  },
);

Detail.displayName = 'Detail';
