import {
  arrow,
  FloatingPortal,
  offset,
  Placement,
  useDismiss,
  useFloating,
  useInteractions,
  autoPlacement,
  shift,
} from "@floating-ui/react-dom-interactions";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { FC, ReactNode, useRef, useState, useMemo } from "react";
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
}

export const Popover = ({
  button: Button,
  panel,
  isSmall = false,
  allowedPlacements,
  isOpen: isOpenExternal,
  onOpenChange,
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
      offset(12),
      shift(),
      autoPlacement({ allowedPlacements }),
      arrow({ element: arrowRef }),
    ],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useDismiss(context, {
      escapeKey: true,
      outsidePointerDown: true,
      ancestorScroll: true,
    }),
  ]);

  return (
    <>
      <div
        className="inline-block w-fit"
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              {...getFloatingProps()}
              className="z-40"
              ref={floating}
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: isOpen ? 1 : 0.9,
                opacity: isOpen ? 1 : 0,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              transition={{
                type: "easeInOut",
                duration: 0.2,
              }}
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
                    middlewareData.arrow?.x
                      ? `${middlewareData.arrow?.x}px`
                      : ""
                  }
                  y={
                    middlewareData.arrow?.y
                      ? `${middlewareData.arrow?.y}px`
                      : ""
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
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};
