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
} from '../../../../../libs/react-maps-ui/src';
import { X } from '../../../../../libs/react-maps-icons/src';
import { SnapPoint } from '../../../../../libs/react-framer-motion-bottom-sheet/src';

export type DetailProps = {
  children?: ReactNode;
  isBottomSheet?: boolean;
  bottomSheetSnapPoints?: SnapPoint[];
  bottomSheetInitialSnap?: number;
  onClose: () => void;
  isVisible?: boolean;
  onBottomSheetSnapChange?: (index: number) => void;
  hideBottomSheetHeader?: boolean;
  avoidMapboxControls?: boolean;
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
      hideBottomSheetHeader = false,
      avoidMapboxControls = false,
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
            setCurrentSnapHeight(snapHeight);
            setCurrentSnap(snapIndex);
          }}
          // switching between two features (terrain service) on homeles-people-help-map, causes multiple calls to onClose
          // onClose={onClose}
          hideHeader={hideBottomSheetHeader}
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
        persistChildrenWhenClosing
        avoidMapboxControls={avoidMapboxControls}
      >
        <div
          ref={detailRef}
          className={cx(
            'relative w-96 bg-background-lightmode dark:bg-background-darkmode max-h-full',
            {
              'shadow-lg': isVisible,
              'rounded-bl-lg': shouldBeBottomLeftCornerRounded,
            },
          )}
        >
          <div
            className={cx(
              'dark:border-gray-darkmode/20 absolute h-full w-full border-l-2 border-b-2 border-[transparent]',
              { 'rounded-bl-lg': shouldBeBottomLeftCornerRounded },
            )}
          />
          <IconButton
            className={cx(
              'hidden w-8 h-8 !rounded-full !border-0 !shadow-none absolute right-4 top-4 md:flex items-center justify-center z-50',
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
