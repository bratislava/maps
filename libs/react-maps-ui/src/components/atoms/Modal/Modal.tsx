import React, { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@bratislava/react-maps-icons";
import cx from "classnames";

export interface IModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string | ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
  closeButtonIcon?: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  closeButtonIcon,
}: IModalProps) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        className="fixed z-50 top-0 left-0 right-0 bottom-0 text-foreground-lightmode dark:text-foreground-darkmode"
        onClose={() => onClose && onClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed bg-black bg-opacity-40 top-0 left-0 right-0 bottom-0 z-50" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-12"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center p-8 z-50">
            <Dialog.Panel
              className={cx(
                "relative bg-background-lightmode dark:bg-background-darkmode rounded-xl flex flex-col p-8 gap-4",
                className
              )}
            >
              {title && (
                <Dialog.Title className="text-md font-semibold">
                  {title}
                </Dialog.Title>
              )}

              {description && (
                <Dialog.Description className="">
                  {description}
                </Dialog.Description>
              )}

              <div>{children}</div>

              <div className="w-full flex absolute left-0 -bottom-6 justify-center">
                <button
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                  onClick={() => onClose && onClose()}
                >
                  {closeButtonIcon ?? <X className="text-white" />}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
