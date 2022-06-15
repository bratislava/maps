import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Close } from "@bratislava/mapbox-maps-icons";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "react-spring-bottom-sheet";

interface IMobileBottomSheetSlotProps {
  containerRef?: MutableRefObject<any>;
  title: string;
  isOpen: boolean;
  isMobile: boolean;
  children: ReactNode;
  onClose: () => void;
}

export const MobileBottomSheetSlot = forwardRef<
  HTMLDivElement,
  IMobileBottomSheetSlotProps
>(({ isOpen, children, onClose, isMobile }, ref) => {
  const { t } = useTranslation();

  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    if (isOpen) {
      setDisplayedChildren(children);
    }
  }, [isOpen, children, setDisplayedChildren]);

  if (isMobile) {
    return (
      <BottomSheet onDismiss={onClose} blocking={false} open={isOpen}>
        <div ref={ref}>
          <div className="flex-1 h-full">{displayedChildren}</div>
          <div className="md:absolute bg-white md:bg-transparent py-4 md:py-0 md:left-auto md:bottom-auto md:top-6 md:right-4 flex justify-center w-full md:w-auto">
            <button onClick={onClose} className="flex items-center group">
              <span>{t("maps:close")}</span>
              <Close className="group-hover:text-primary" />
            </button>
          </div>
        </div>
      </BottomSheet>
    );
  } else {
    return null;
  }
});
