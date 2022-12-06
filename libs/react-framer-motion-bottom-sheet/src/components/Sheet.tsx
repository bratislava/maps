import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import { SnapPoint } from '../types';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { useResizeDetector } from 'react-resize-detector';
import { useWindowSize } from 'usehooks-ts';
import { getClosestSnapPoint } from '../utils/getClosestSnapPoint';
import { usePrevious } from '@bratislava/utils';

export type SheetContext = {
  isOpen: boolean;
  currentHeight: number;
};

export const sheetContext = createContext<SheetContext>({
  isOpen: false,
  currentHeight: 0,
});

export type SheetRef = {
  snapTo: (index: number) => void;
};

export type SheetProps = {
  isOpen?: boolean;
  snapPoints?: SnapPoint[];
  defaultSnapPoint?: number;
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
  onSnapChange?: (event: { snapIndex: number; snapHeight: number }) => void;
};

export const Sheet = forwardRef<SheetRef, SheetProps>(
  (
    {
      isOpen = false,
      snapPoints,
      defaultSnapPoint = 0,
      children,
      onClose,
      className,
      onSnapChange,
    },
    forwaredRef
  ) => {
    const previousOpen = usePrevious(isOpen);

    // Children full height
    const { height: innerHeight = 0, ref: innerRef } =
      useResizeDetector<HTMLDivElement | null>();
    const previousInnerHeight = usePrevious(innerHeight);

    // Screen height
    const { ref: screenRef, height: screenHeight = window.innerHeight } =
      useResizeDetector<HTMLDivElement | null>();

    const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint);

    const mergedSnapPoints: SnapPoint[] = useMemo(
      () => snapPoints ?? ['content'],
      [snapPoints]
    );

    // All snappoints recalculated to absolute numbers
    const absoluteSnapPoints: number[] = useMemo(() => {
      return mergedSnapPoints.map((sp) => {
        if (typeof sp === 'number') return Math.min(sp, screenHeight);
        if (sp === 'content') return Math.min(innerHeight, screenHeight);
        if (typeof sp === 'string')
          return Math.min(
            (screenHeight * parseInt(sp.split('%')[0])) / 100,
            screenHeight
          );
        else return 0;
      });
    }, [innerHeight, mergedSnapPoints, screenHeight]);

    const animation = useAnimation();

    const [y, setY] = useState(0);
    const [resultDebugY, setResultDebugY] = useState(0);

    const animateTo = useCallback(
      (value: number) => {
        const constrainedValue = Math.min(
          Math.max(innerHeight, screenHeight),
          value
        );
        animation.start({ y: -constrainedValue });
        setY(constrainedValue);
      },
      [animation, innerHeight, screenHeight]
    );

    const isScrollable = useMemo(() => {
      return innerHeight > screenHeight;
    }, [innerHeight, screenHeight]);

    const onDragEnd = useCallback(
      (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const resultY = y - info.offset.y - info.velocity.y / 5;

        if (isScrollable && resultY > screenHeight) {
          animateTo(resultY);
          return;
        }

        setResultDebugY(resultY);

        // Calculate nearest snapPoint
        const closestSnapPoint = getClosestSnapPoint(
          absoluteSnapPoints,
          resultY
        );
        animateTo(closestSnapPoint);
      },
      [y, isScrollable, screenHeight, absoluteSnapPoints, animateTo]
    );

    const snapTo = useCallback(
      (index: number) => {
        console.log('snapTo', index);
        animateTo(absoluteSnapPoints[index] ?? 0);
        setCurrentSnapIndex(index);
      },
      [absoluteSnapPoints, animateTo]
    );

    useEffect(() => {
      console.log('snapChange', currentSnapIndex);
      onSnapChange &&
        onSnapChange({
          snapIndex: currentSnapIndex,
          snapHeight: absoluteSnapPoints[currentSnapIndex] ?? 0,
        });
    }, [currentSnapIndex, onSnapChange, absoluteSnapPoints]);

    useEffect(() => {
      if (isOpen && innerHeight !== previousInnerHeight) {
        snapTo(currentSnapIndex);
      }
    }, [isOpen, innerHeight, previousInnerHeight, currentSnapIndex, snapTo]);

    const handleOpen = useCallback(() => {
      snapTo(defaultSnapPoint);
    }, [snapTo, defaultSnapPoint]);

    const handleClose = useCallback(() => {
      animateTo(0);
      onClose && onClose();
    }, [animateTo, onClose]);

    useEffect(() => {
      if (!previousOpen && isOpen) handleOpen();
      if (previousOpen && !isOpen) handleClose();
    }, [isOpen, handleOpen, handleClose, previousOpen]);

    const sheetContextValue = useMemo(
      () => ({
        isOpen: false,
        currentHeight: y,
      }),
      [y]
    );

    return createPortal(
      <sheetContext.Provider value={sheetContextValue}>
        <div
          ref={screenRef}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 50,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        ></div>
        {/* <div
          style={{
            position: 'fixed',
            zIndex: 10,
            left: 0,
            bottom: resultDebugY,
            height: 1,
            width: '100vw',
            background: 'blue',
          }}
        />
        {absoluteSnapPoints.map((sp, index) => (
          <div
            key={index}
            style={{
              position: 'fixed',
              zIndex: 10,
              left: 0,
              bottom: sp - 1,
              height: 1,
              width: '100vw',
              background: 'red',
            }}
          />
        ))} */}
        <motion.div
          dragConstraints={{
            bottom: 0,
            top: Math.min(-screenHeight, -innerHeight),
          }}
          animate={animation}
          transition={{ ease: 'easeOut', duration: 0.5 }}
          drag="y"
          style={{
            position: 'fixed',
            left: 0,
            top: screenHeight,
            width: '100vw',
            paddingBottom: screenHeight,
          }}
          onDragEnd={onDragEnd}
          className={className}
        >
          <div ref={innerRef}>{children}</div>
        </motion.div>
      </sheetContext.Provider>,
      document.body
    );
  }
);

Sheet.displayName = 'Sheet';
