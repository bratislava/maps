import { X } from "@bratislava/react-maps-icons";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import { Sidebar } from "@bratislava/react-maps-ui";
import { useRef } from "react";

export const Row = ({ label, text }: { label: string; text: string }) => {
  if (!text || (text === " " && !label)) {
    return null;
  } else {
    return (
      <div className="">
        <div>{label}</div>
        <div className="font-bold">{text}</div>
      </div>
    );
  }
};

export interface DetailProps {
  onToggle: () => void;
  isMobile: boolean;
  isOpen: boolean;
}

export const Detail = ({ onToggle, isMobile, isOpen }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  const detail = (
    <div className="flex flex-col space-y-4 p-8 pt-0 sm:pt-4 overflow-auto">
      <div className="flex flex-col space-y-4"></div>
    </div>
  );

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 80]}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      expandOnContentDrag
      blocking={false}
      className="relative z-30"
      open={isOpen}
    >
      {detail}
    </BottomSheet>
  ) : (
    <Sidebar isMobile={false} setVisible={onToggle} isVisible={isOpen} position="right">
      {detail}
    </Sidebar>
  );
};

export default Detail;
