import { Padding } from '../../../../../libs/react-mapbox/src';
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

import { mapContext } from '../Map/Map';
import { useDebounce } from 'usehooks-ts';
import { useResizeDetector } from 'react-resize-detector';
import { SlotState } from '../Map/types';

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
  avoidMapboxControls?: boolean;
  persistChildrenWhenClosing?: boolean;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export const Slot = ({
  id,
  children,
  isVisible = true,
  position,
  hidingEdge,
  autoPadding = false,
  className,
  avoidMapboxControls = false,
  padding,
  persistChildrenWhenClosing = true,
}: ISlotProps) => {
  // Update of children when closing is delayed due animation
  const debouncedVisible = useDebounce(isVisible, 10);
  const [persistedChildren, setPersistedChildren] = useState(children);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

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

  const finalPadding: Padding = useMemo(
    () =>
      autoPadding
        ? {
            top: topPadding,
            right: rightPadding,
            bottom: bottomPadding,
            left: leftPadding,
          }
        : {
            top: padding?.top ?? 0,
            right: padding?.right ?? 0,
            bottom: padding?.bottom ?? 0,
            left: padding?.left ?? 0,
          },
    [
      autoPadding,
      topPadding,
      rightPadding,
      bottomPadding,
      leftPadding,
      padding?.top,
      padding?.right,
      padding?.bottom,
      padding?.left,
    ],
  );

  const slotState: SlotState = useMemo(() => {
    return {
      id,
      isVisible: debouncedVisible,
      padding: {
        top: finalPadding.top,
        right: finalPadding.right,
        bottom: finalPadding.bottom,
        left: finalPadding.left,
      },
      avoidMapboxControls,
    };
  }, [
    id,
    debouncedVisible,
    finalPadding.top,
    finalPadding.right,
    finalPadding.bottom,
    finalPadding.left,
    avoidMapboxControls,
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
    if (!debouncedVisible || isLoading) {
      if (calculatedHidingEdge === 'left') return '-100%';
      if (calculatedHidingEdge === 'right') return '100%';
      return 0;
    }
    return 0;
  }, [debouncedVisible, calculatedHidingEdge, isLoading]);

  const y = useMemo(() => {
    if (!debouncedVisible || isLoading) {
      if (calculatedHidingEdge === 'top') return '-100%';
      if (calculatedHidingEdge === 'bottom') return '100%';
      return 0;
    }
    return 0;
  }, [debouncedVisible, calculatedHidingEdge, isLoading]);

  // Update children after animation complete
  const onAnimationComplete = useCallback(() => {
    setPersistedChildren(children);
  }, [children]);

  // Update children whenever Slot is visible
  useEffect(() => {
    if (isVisible === true) {
      setPersistedChildren(children);
    }
  }, [isVisible, children]);

  return (
    <motion.div
      ref={ref}
      animate={{
        x,
        y,
      }}
      transition={{ ease: 'easeInOut', duration: isLoading ? 0 : 0.5 }}
      onAnimationComplete={onAnimationComplete}
      className={cx(
        'fixed z-20',
        {
          'top-0': position?.includes('top'),
          'bottom-0': position?.includes('bottom'),
          'left-0': position?.includes('left'),
          'right-0': position?.includes('right'),
        },
        className,
      )}
    >
      {persistChildrenWhenClosing ? persistedChildren : children}
    </motion.div>
  );
};
