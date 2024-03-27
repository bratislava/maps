import {
  arrow,
  autoPlacement,
  FloatingPortal,
  offset,
  Placement,
  shift, useDismiss,
  useFloating,
  useInteractions
} from '@floating-ui/react';
import cx from "classnames";
import { FC, ReactNode, useMemo, useRef, useState } from "react";
import { PopoverArrow } from "./PopoverArrow";

export interface IPopoverProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  button:
  | FC<{
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  }>
  | ReactNode;
  panel: ReactNode;
  isSmall?: boolean;
  allowedPlacements?: Placement[];
  className?: string;
}

export const Popover = ({
  button: Button,
  panel,
  isSmall = false,
  allowedPlacements,
  isOpen: isOpenExternal,
  onOpenChange,
  className,
}: IPopoverProps) => {
  const arrowRef = useRef(null);
  const [isOpenInternal, setOpenInternal] = useState(false);

  const isOpen = useMemo(() => {
    return isOpenExternal ?? isOpenInternal;
  }, [isOpenExternal, isOpenInternal]);

  const setOpen = useMemo(() => {
    return onOpenChange ?? setOpenInternal;
  }, [onOpenChange]);

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    placement,
    middlewareData,
    context,
  } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    strategy: "fixed",
    middleware: [
      offset(15),
      shift(),
      autoPlacement({ allowedPlacements }),
      arrow({ element: arrowRef }),
    ],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useDismiss(context, {
      escapeKey: true,
      outsidePressEvent: "mousedown",
      ancestorScroll: true,
    }),
  ]);

  return (
    <>
      <div
        className={cx("inline-block w-fit", className)}
        ref={reference}
        {...getReferenceProps()}
      >
        {typeof Button === "function" ? (
          <Button
            isOpen={isOpen}
            open={() => setOpen(true)}
            close={() => setOpen(false)}
            toggle={() => setOpen(!isOpen)}
          />
        ) : (
          Button
        )}
      </div>
      <FloatingPortal>
        {isOpen && (
          <div
            {...getFloatingProps()}
            className="z-40"
            ref={floating}
            style={{
              position: strategy,
              top: `${y ?? 0}px`,
              left: `${x ?? 0}px`,
            }}
          >
            <div className="relative">
              <PopoverArrow
                ref={arrowRef}
                placement={placement}
                x={
                  middlewareData.arrow?.x ? `${middlewareData.arrow?.x}px` : ""
                }
                y={
                  middlewareData.arrow?.y ? `${middlewareData.arrow?.y}px` : ""
                }
                isSmall={isSmall}
              />
              <div
                className={cx(
                  "bg-background-lightmode w-fit dark:bg-background-darkmode border-2 border-background-lightmode dark:border-gray-darkmode/20 rounded-lg shadow-lg text-foreground-lightmode dark:text-foreground-darkmode",
                  {
                    "p-6": !isSmall,
                    "p-2": isSmall,
                  }
                )}
              >
                {panel}
              </div>
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};
