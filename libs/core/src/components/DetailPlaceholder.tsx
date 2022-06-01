import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from "react";
import cx from "classnames";
import { ChevronLeftSmall, Close } from "@bratislava/mapbox-maps-icons";
import { useTranslation } from "react-i18next";

interface DetailProps {
  containerRef?: MutableRefObject<any>;
  title: string;
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ title, isOpen, children, onClose }, ref) => {
    const { t } = useTranslation();

    const [displayedChildren, setDisplayedChildren] = useState(children);

    useEffect(() => {
      if (isOpen) {
        setDisplayedChildren(children);
      }
    }, [isOpen, children, setDisplayedChildren]);

    return (
      <div
        ref={ref}
        className={cx(
          "fixed left-0 top-0 bottom-0 md:bottom-auto md:left-auto right-0 bg-background z-20 transform duration-500 ease-in-out transition-transform flex flex-col md:w-96 max-h-full overflow-auto",
          { "shadow-lg": isOpen, "translate-x-full shadow-none": !isOpen }
        )}
      >
        <button
          onClick={onClose}
          className="flex absolute items-center space-x-4 md:hidden top-8 left-8"
        >
          <ChevronLeftSmall width={20} height={20} />
          <span className="text-md font-medium">{title}</span>
        </button>
        <div className="flex-1 h-full">{displayedChildren}</div>
        <div className="md:absolute bg-white md:bg-transparent py-4 md:py-0 md:left-auto md:bottom-auto md:top-6 md:right-4 flex justify-center w-full md:w-auto">
          <button onClick={onClose} className="flex items-center group">
            <span>{t("maps:close")}</span>
            <Close className="group-hover:text-primary" />
          </button>
        </div>
      </div>
    );
  }
);

export default Detail;
