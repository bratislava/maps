import {
  Scrollbars,
  positionValues as PositionValues,
} from "react-custom-scrollbars";
import { ReactNode, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import cx from "classnames";

export type ScrollAreaProps = {
  children?: ReactNode;
};

export const ScrollArea = ({ children }: ScrollAreaProps) => {
  const { ref, height = 0 } = useResizeDetector<HTMLDivElement>();

  const [isTop, setTop] = useState(true);
  const [isBottom, setBottom] = useState(false);

  const handleUpdate = ({
    scrollTop,
    clientHeight,
    scrollHeight,
  }: PositionValues) => {
    setTop(scrollTop === 0);
    setBottom(clientHeight + scrollTop === scrollHeight);
  };

  return (
    <div className="h-full w-full relative">
      <Scrollbars
        autoHeight
        autoHeightMax={height}
        hideTracksWhenNotNeeded
        autoHide
        renderThumbVertical={() => (
          <div className="bg-background-lightmode dark:bg-background-darkmode z-50 rounded-full">
            <div className="bg-gray-lightmode/20 dark:bg-gray-darkmode/20 rounded-full h-full" />
          </div>
        )}
        onUpdate={handleUpdate}
      >
        <div ref={ref} className="relative max-h-screen">
          {children}
        </div>
      </Scrollbars>
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
  );
};
