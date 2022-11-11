import { ReactNode, useRef } from "react";
import {
  BottomSheet as ReactSpringBottomSheet,
  BottomSheetRef as ReactSpringBottomSheetRef,
} from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

export interface IBottomSheet {
  isOpen?: boolean;
  children?: ReactNode;
}

export const BottomSheet = ({ isOpen = false, children }: IBottomSheet) => {
  const sheetRef = useRef<ReactSpringBottomSheetRef>(null);
  return (
    <ReactSpringBottomSheet ref={sheetRef} open={isOpen}>
      {children}
    </ReactSpringBottomSheet>
  );
};
