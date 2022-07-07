import React, { ReactNode, useRef, useState } from "react";
import { Popover as HeadlessPopover } from "@headlessui/react";
import { usePopper } from "react-popper";

export interface IPopoverProps {
  button: ReactNode;
  panel: ReactNode;
}

export const Popover = ({ button, panel }: IPopoverProps) => {
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(buttonElement, popperElement, {
    placement: "right",
    strategy: "fixed",
    modifiers: [
      {
        name: "offset",
        options: { offset: [0, 16] },
      },
      {
        name: "arrow",
        options: {
          element: arrowElement,
        },
      },
    ],
  });

  return (
    <HeadlessPopover className="relative">
      <HeadlessPopover.Button ref={setButtonElement}>
        {button}
      </HeadlessPopover.Button>

      <HeadlessPopover.Panel
        className="bg-background-lightmode z-50 w-96 dark:bg-background-darkmode p-8 rounded-lg shadow-lg"
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {/* <div ref={setArrowElement} style={styles.arrow} {...attributes.arrow}>
          
        </div> */}
        {panel}
      </HeadlessPopover.Panel>
    </HeadlessPopover>
  );
};
