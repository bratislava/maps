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
import { FC, ReactNode, useRef, useState } from "react";
import { PopoverArrow } from "./PopoverArrow";

export interface IPopoverProps {
  button: FC<{
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  }>;
  panel: ReactNode;
  isSmall?: boolean;
  placement?: Placement;
}

export const Popover = ({
  button: Button,
  panel,
  isSmall = false,
  placement: placementInput = "right",
}: IPopoverProps) => {
  const arrowRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

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
    placement: placementInput,
    open: isOpen,
    onOpenChange: setOpen,
    strategy: "fixed",
    middleware: [
      offset(12),
      arrow({ element: arrowRef }),
      shift(),
      autoPlacement(),
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
        <Button
          isOpen={isOpen}
          open={() => setOpen(true)}
          close={() => setOpen(false)}
          toggle={() => setOpen((o) => !o)}
        />
      </div>
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              {...getFloatingProps()}
              className={cx(
                "bg-background-lightmode z-50 w-fit dark:bg-background-darkmode border-2 border-background-lightmode dark:border-gray-darkmode/20 rounded-lg shadow-lg text-foreground-lightmode dark:text-foreground-darkmode",
                {
                  "p-8": !isSmall,
                  "p-2": isSmall,
                }
              )}
              ref={floating}
              initial={{
                // scale: 0.8,
                opacity: 0,
              }}
              animate={{
                originX: 0.5,
                // placement === "right" ? 0 : placement === "left" ? 1 : 0.5,
                originY: 0.5,
                // placement === "bottom" ? 0 : placement === "top" ? 1 : 0.5,
                // scale: isOpen ? 1 : 0.8,
                opacity: isOpen ? 1 : 0,
              }}
              exit={{
                // scale: 0.8,
                opacity: 0,
              }}
              transition={{
                type: "easeInOut",
                duration: 0.2,
              }}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
              }}
            >
              {/* <PopoverArrow
                ref={arrowRef}
                placement={placement}
                x={middlewareData.arrow?.x ?? 0}
                y={middlewareData.arrow?.y ?? 0}
                isSmall={isSmall}
              /> */}
              {panel}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};
