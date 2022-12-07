import { forwardRef } from "react";
import {
  Sheet,
  Header,
  Content,
  SheetRef,
  SheetProps,
} from "@bratislava/react-framer-motion-bottom-sheet";

export type SheetHandle = SheetRef;

export type BottomSheetProps = Omit<SheetProps, "className">;

export const BottomSheet = forwardRef<SheetRef, BottomSheetProps>(
  ({ onClose, children, ...props }, ref) => {
    const handleClose = () => {
      onClose && onClose();
    };

    return (
      <Sheet
        ref={ref}
        onClose={handleClose}
        {...props}
        className="bg-background-lightmode dark:bg-background-darkmode z-30 shadow-lg"
      >
        <Header>
          <div className="flex pt-3 items-center justify-center border-t-[2px] border-background-lightmode dark:border-gray-darkmode/20">
            <div className="w-12 h-[4px] rounded-full bg-gray-lightmode/20 dark:bg-gray-darkmode/20"></div>
          </div>
        </Header>
        <Content>{children}</Content>
      </Sheet>
    );
  }
);

BottomSheet.displayName = "BottomSheet";
