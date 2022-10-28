import { Padding } from '@bratislava/react-mapbox';
import { motion } from 'framer-motion';
import cx from 'classnames';
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ISlotState, mapContext } from '../Map/Map';
import { useDebounce } from 'usehooks-ts';
import { useResizeDetector } from 'react-resize-detector';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'right' | 'left';

type Positon =
  | VerticalPosition
  | HorizontalPosition
  | `${VerticalPosition}-${HorizontalPosition}`;

export interface ISlotProps {
  id: string;
  children?: ReactNode;
  isVisible?: boolean;
  position?: Positon;
  hidingEdge?: VerticalPosition | HorizontalPosition;
  autoPadding?: boolean;
  className?: string;
}

export const Slot = ({
  id,
  children,
  isVisible = true,
  position,
  hidingEdge,
  autoPadding = false,
  className,
}: ISlotProps) => {
  // Update of children when closing is delayed due animation
  const debouncedVisible = useDebounce(isVisible, 10);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  const { ref, width = 0, height = 0 } = useResizeDetector();

  const calculatedHidingEdge: VerticalPosition | HorizontalPosition | null =
    useMemo(() => {
      if (!position) {
        return null;
      }

      if (hidingEdge) {
        return hidingEdge;
      }

      if (position.includes('left')) return 'left';
      if (position.includes('right')) return 'right';
      return position as 'top' | 'bottom';
    }, [hidingEdge, position]);

  const topPadding = useMemo(() => {
    if (isVisible && calculatedHidingEdge === 'top') {
      return height;
    }
    return 0;
  }, [isVisible, calculatedHidingEdge, height]);

  const bottomPadding = useMemo(() => {
    if (isVisible && calculatedHidingEdge === 'bottom') {
      return height;
    }
    return 0;
  }, [isVisible, calculatedHidingEdge, height]);

  const leftPadding = useMemo(() => {
    if (isVisible && calculatedHidingEdge === 'left') {
      return width;
    }
    return 0;
  }, [isVisible, calculatedHidingEdge, width]);

  const rightPadding = useMemo(() => {
    if (isVisible && calculatedHidingEdge === 'right') {
      return width;
    }
    return 0;
  }, [isVisible, calculatedHidingEdge, width]);

  const padding: Padding = useMemo(
    () =>
      autoPadding
        ? {
            top: topPadding,
            right: rightPadding,
            bottom: bottomPadding,
            left: leftPadding,
          }
        : { top: 0, right: 0, bottom: 0, left: 0 },
    [autoPadding, topPadding, rightPadding, bottomPadding, leftPadding],
  );

  const slotState: ISlotState = useMemo(() => {
    return {
      id,
      isVisible: debouncedVisible,
      padding: {
        top: padding.top,
        right: padding.right,
        bottom: padding.bottom,
        left: padding.left,
      },
    };
  }, [
    id,
    debouncedVisible,
    padding.top,
    padding.right,
    padding.bottom,
    padding.left,
  ]);

  const {
    methods: { unmountSlot, mountOrUpdateSlot },
  } = useContext(mapContext);

  useEffect(() => {
    mountOrUpdateSlot(slotState);
    return () => {
      unmountSlot(slotState);
    };
  }, [mountOrUpdateSlot, slotState, unmountSlot]);

  const x = useMemo(() => {
    if (!debouncedVisible) {
      if (calculatedHidingEdge === 'left') return '-100%';
      if (calculatedHidingEdge === 'right') return '100%';
      return 0;
    }
    return 0;
  }, [debouncedVisible, calculatedHidingEdge]);

  const y = useMemo(() => {
    if (!debouncedVisible) {
      if (calculatedHidingEdge === 'top') return '-100%';
      if (calculatedHidingEdge === 'bottom') return '100%';
      return 0;
    }
    return 0;
  }, [debouncedVisible, calculatedHidingEdge]);

  // Update children after animation complete
  const onAnimationComplete = useCallback(() => {
    setDisplayedChildren(children);
  }, [children]);

  // Update children whenever Slot is visible
  useEffect(() => {
    if (isVisible === true) {
      setDisplayedChildren(children);
    }
  }, [isVisible, children]);

  return (
    <motion.div
      ref={ref}
      animate={{
        x,
        y,
      }}
      transition={{ ease: 'easeInOut' }}
      onAnimationComplete={onAnimationComplete}
      className={cx(
        'fixed',
        {
          'top-0': position?.includes('top'),
          'bottom-0': position?.includes('bottom'),
          'left-0': position?.includes('left'),
          'right-0': position?.includes('right'),
        },
        className,
      )}
    >
      {displayedChildren}
    </motion.div>
  );
};
