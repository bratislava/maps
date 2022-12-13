import {
  ReactNode,
  useState,
  UIEventHandler,
  useEffect,
  useCallback,
} from "react";
import { useResizeDetector } from "react-resize-detector";
import cx from "classnames";

export type ScrollAreaProps = {
  children?: ReactNode;
  onScroll?: () => void;
};

export const ScrollArea = ({ children }: ScrollAreaProps) => {
  const { ref: outerRef, height: outerHeight = 0 } =
    useResizeDetector<HTMLDivElement>();
  const { ref: innerRef, height: innerHeight = 0 } =
    useResizeDetector<HTMLDivElement>();

  const [isTop, setTop] = useState(true);
  const [isBottom, setBottom] = useState(true);

  const handleUpdate = useCallback(() => {
    const scrollTop = outerRef.current?.scrollTop ?? 0;
    setTop(scrollTop === 0);
    setBottom(outerHeight + scrollTop >= innerHeight);
  }, [innerHeight, outerHeight]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  return (
    <>
      <div className="h-full w-full relative">
        {/* INVISIBLE CHILDREN FOR HEIGHT CALCULATIONS */}
        <div
          className="h-full max-h-screen overflow-auto"
          onScroll={handleUpdate}
          ref={outerRef}
        >
          <div ref={innerRef}>{children}</div>
        </div>
        <div
          className={cx(
            "pointer-events-none absolute z-50 w-full top-0 h-10 overflow-hidden transition-opacity duration-500",
            { "opacity-0": isTop }
          )}
        >
          <div className="w-full h-full -translate-y-10 shadow-[0_-8px_16px_16px_rgba(0,0,0,0.2)] dark:shadow-[0_-8px_16px_16px_rgba(0,0,0,0.5)]" />
        </div>
        <div
          className={cx(
            "pointer-events-none absolute z-50 w-full bottom-0 h-10 overflow-hidden transition-opacity duration-500",
            { "opacity-0": isBottom }
          )}
        >
          <div className="w-full h-full translate-y-10 shadow-[0_8px_16px_16px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_16px_16px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </>
  );
};
