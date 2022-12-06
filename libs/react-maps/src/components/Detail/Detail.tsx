import {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { Slot } from '../Layout/Slot';
import { useWindowSize } from 'usehooks-ts';
import { useResizeDetector } from 'react-resize-detector';
import {
  BottomSheet,
  IconButton,
  ScrollArea,
  SheetHandle,
} from '@bratislava/react-maps-ui';
import { X } from '@bratislava/react-maps-icons';
import { SnapPoint } from '@bratislava/react-framer-motion-bottom-sheet';

export type DetailProps = {
  children?: ReactNode;
  isBottomSheet?: boolean;
  bottomSheetSnapPoints?: SnapPoint[];
  bottomSheetInitialSnap?: number;
  onClose: () => void;
  isVisible?: boolean;
  onBottomSheetSnapChange?: (height: number) => void;
};

export const Detail = forwardRef<SheetHandle, DetailProps>(
  (
    {
      children,
      isBottomSheet = false,
      bottomSheetSnapPoints,
      bottomSheetInitialSnap = 1,
      onClose,
      isVisible = true,
      onBottomSheetSnapChange,
    },
    forwardedRef,
  ) => {
    const detailRef = useRef<HTMLDivElement>(null);
    const { height: detailHeight = 0 } = useResizeDetector({
      targetRef: detailRef,
    });

    const [currentSnap, setCurrentSnap] = useState(0);
    const [currentSnapHeight, setCurrentSnapHeight] = useState(0);

    useEffect(() => {
      onBottomSheetSnapChange && onBottomSheetSnapChange(currentSnap);
    }, [currentSnap, onBottomSheetSnapChange]);

    const { height: windowHeight } = useWindowSize();

    const shouldBeBottomLeftCornerRounded = useMemo(() => {
      return windowHeight > detailHeight;
    }, [detailHeight, windowHeight]);

    return isBottomSheet ? (
      <Slot
        id="bottom-sheet-detail"
        position="bottom"
        padding={{ bottom: currentSnapHeight }}
      >
        <BottomSheet
          ref={forwardedRef}
          snapPoints={bottomSheetSnapPoints}
          defaultSnapPoint={bottomSheetInitialSnap}
          isOpen={isVisible}
          onSnapChange={({ snapHeight, snapIndex }) => {
            setCurrentSnapHeight(snapHeight), setCurrentSnap(snapIndex);
          }}
          onClose={onClose}
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
