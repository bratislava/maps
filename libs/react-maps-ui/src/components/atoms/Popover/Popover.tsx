import {
  arrow,
  FloatingPortal,
  offset,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react-dom-interactions";
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
}

export const Popover = ({ button: Button, panel }: IPopoverProps) => {
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
    placement: "right",
    open: isOpen,
    onOpenChange: setOpen,
    strategy: "fixed",
    middleware: [offset(12), arrow({ element: arrowRef })],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useDismiss(context, {
      escapeKey: true,
      outsidePointerDown: true,
      ancestorScroll: true,
    }),
  ]);

  return (
    <div className="relative">
      <div ref={reference} {...getReferenceProps()}>
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
              className="bg-background-lightmode z-50 w-fit dark:bg-background-darkmode p-8 rounded-lg shadow-lg"
              ref={floating}
              initial={{
                scale: 0.5,
                opacity: 0,
              }}
              animate={{
                originX: 0,
                scale: isOpen ? 1 : 0.5,
                opacity: isOpen ? 1 : 0.5,
              }}
              exit={{
                scale: 0.5,
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
              <PopoverArrow
                ref={arrowRef}
                placement={placement}
                x={middlewareData.arrow?.x ?? 0}
                y={middlewareData.arrow?.y ?? 0}
              />
              {panel}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  );
};
