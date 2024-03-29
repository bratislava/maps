import { X } from "@bratislava/react-maps-icons";
import { Dialog, Transition } from "@headlessui/react";
import cx from "classnames";
import { Fragment, ReactNode } from "react";
import IconButton from "./IconButton";

export interface IModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string | ReactNode;
  description?: string | ReactNode;
  children?: ReactNode;
  closeButtonIcon?: ReactNode;
  closeButtonOut?: boolean;
  closeButtonInCorner?: boolean;
  noOverlayStyles?: boolean;
  underlayClassName?: string;
  overlayClassName?: string;
  hideCloseButtonIcon?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  closeButtonIcon,
  closeButtonOut = false,
  closeButtonInCorner = false,
  noOverlayStyles = false,
  underlayClassName,
  overlayClassName,
  hideCloseButtonIcon = false,
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
          <div className="fixed bg-gray-lightmode dark:bg-black bg-opacity-40 dark:bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50" />
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
          <div
            className={cx(
              "fixed top-0 left-0 right-0 bottom-0 items-center z-50",
              underlayClassName
            )}
          >
            <div className="w-full h-full overflow-auto">
              <div className="flex items-center">
                <div className="w-full min-h-screen flex items-center justify-center p-8">
                  <Dialog.Panel
                    className={cx(
                      closeButtonOut ? "" : "relative",
                      {
                        "bg-background-lightmode dark:bg-background-darkmode rounded-xl flex flex-col p-8 gap-4":
                          !noOverlayStyles,
                      },
                      overlayClassName
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

                    {children}

                    {!noOverlayStyles && (
                      <div
                        className={cx("w-full flex absolute", {
                          "-top-6 -right-6 justify-end": closeButtonInCorner,
                          "left-0 -bottom-6 justify-center":
                            !closeButtonInCorner,
                        })}
                      >
                        {!hideCloseButtonIcon && (
                          <IconButton
                            className="w-12 outline-none h-12 !bg-primary !border-primary !rounded-full flex items-center justify-center"
                            onClick={() => onClose && onClose()}
                          >
                            {closeButtonIcon ?? <X />}
                          </IconButton>
                        )}
                      </div>
                    )}
                  </Dialog.Panel>
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
